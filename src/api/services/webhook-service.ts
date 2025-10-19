// src/api/services/webhook-service.ts
import { DatabaseService, Analysis } from '../models/database-postgres';
import { WebhookPayload } from '../types';
import * as crypto from 'crypto';

export class WebhookService {
  private db: DatabaseService;
  private secret: string;

  constructor(db: DatabaseService, secret?: string) {
    this.db = db;
    this.secret = secret || process.env.WEBHOOK_SECRET || 'default-webhook-secret';
  }

  async sendWebhook(analysis: Analysis, eventType: 'analysis.completed' | 'analysis.failed'): Promise<void> {
    if (!analysis.webhook_url) {
      return;
    }

    // Create webhook record
    const webhook = await this.db.createWebhook({
      analysis_id: analysis.id,
      url: analysis.webhook_url,
      event_type: eventType,
      status: 'pending',
      attempts: 0,
    });

    // Attempt to send
    await this.attemptWebhookDelivery(webhook.id, analysis, eventType);
  }

  async attemptWebhookDelivery(
    webhookId: string,
    analysis: Analysis,
    eventType: 'analysis.completed' | 'analysis.failed'
  ): Promise<void> {
    const webhook = await this.db.getWebhook(webhookId);
    if (!webhook) {
      return;
    }

    try {
      const payload: WebhookPayload = {
        event: eventType,
        analysis: {
          id: analysis.id,
          book: {
            title: analysis.book_title,
            author: analysis.author,
          },
          status: analysis.status,
          resultUrl: analysis.result_url,
          errorMessage: analysis.error_message,
          completedAt: analysis.completed_at || new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };

      const signature = this.generateSignature(payload);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-bkrptr-Signature': signature,
          'X-bkrptr-Event': eventType,
          'User-Agent': 'bkrptr-webhook/1.0',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Webhook delivered successfully
        await this.db.updateWebhook(webhookId, {
          status: 'sent',
          attempts: webhook.attempts + 1,
          last_attempt_at: new Date().toISOString(),
        });
        console.log(`Webhook ${webhookId} delivered successfully`);
      } else {
        // Webhook delivery failed
        console.error(`Webhook ${webhookId} delivery failed: ${response.status} ${response.statusText}`);
        await this.handleWebhookFailure(webhookId, webhook.attempts + 1);
      }
    } catch (error) {
      console.error(`Webhook ${webhookId} delivery error:`, error);
      await this.handleWebhookFailure(webhookId, webhook.attempts + 1);
    }
  }

  private async handleWebhookFailure(webhookId: string, attempts: number): Promise<void> {
    const maxAttempts = 5;

    if (attempts >= maxAttempts) {
      await this.db.updateWebhook(webhookId, {
        status: 'failed',
        attempts,
        last_attempt_at: new Date().toISOString(),
      });
      console.log(`Webhook ${webhookId} failed after ${attempts} attempts`);
    } else {
      await this.db.updateWebhook(webhookId, {
        status: 'pending',
        attempts,
        last_attempt_at: new Date().toISOString(),
      });

      // Schedule retry with exponential backoff
      const retryDelay = Math.pow(2, attempts) * 1000; // 2^n seconds
      console.log(`Webhook ${webhookId} will retry in ${retryDelay}ms (attempt ${attempts + 1}/${maxAttempts})`);

      setTimeout(async () => {
        const webhook = await this.db.getWebhook(webhookId);
        if (webhook) {
          const analysis = await this.db.getAnalysis(webhook.analysis_id);
          if (analysis) {
            await this.attemptWebhookDelivery(webhookId, analysis, webhook.event_type as any);
          }
        }
      }, retryDelay);
    }
  }

  private generateSignature(payload: WebhookPayload): string {
    const payloadString = JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(payloadString);
    return hmac.digest('hex');
  }

  verifySignature(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  async processRetries(): Promise<void> {
    const pendingWebhooks = await this.db.getPendingWebhooks();
    console.log(`Processing ${pendingWebhooks.length} pending webhooks`);

    for (const webhook of pendingWebhooks) {
      const analysis = await this.db.getAnalysis(webhook.analysis_id);
      if (analysis) {
        await this.attemptWebhookDelivery(webhook.id, analysis, webhook.event_type as any);
      }
    }
  }
}
