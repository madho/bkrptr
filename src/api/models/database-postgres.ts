// src/api/models/database-postgres.ts
import { sql } from '@vercel/postgres';
import * as crypto from 'crypto';

// Dynamic import for nanoid to support Vercel serverless environment
let nanoidInstance: any = null;
async function getNanoid() {
  if (!nanoidInstance) {
    // Use customAlphabet from nanoid for consistent behavior
    const { customAlphabet } = await import('nanoid');
    nanoidInstance = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-', 21);
  }
  return nanoidInstance;
}

export interface Analysis {
  id: string;
  book_title: string;
  author: string;
  genre: string;
  purpose: string;
  audience: string;
  processing_mode: 'batch' | 'expedited';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  error_message?: string;
  webhook_url?: string;
  idempotency_key?: string;
  cost: number;
  processing_time_ms?: number;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface ApiKey {
  id: string;
  key_hash: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  created_at: string;
  last_used_at?: string;
  usage_count: number;
}

export interface Webhook {
  id: string;
  analysis_id: string;
  url: string;
  event_type: string;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  last_attempt_at?: string;
  created_at: string;
}

export class DatabaseService {
  private initialized: boolean = false;

  constructor() {
    // Initialization happens on-demand per request
  }

  private async ensureInitialized() {
    if (this.initialized) return;

    await this.initializeSchema();
    this.initialized = true;
  }

  private async initializeSchema() {
    try {
      // Create tables with proper PostgreSQL syntax
      await sql`
        CREATE TABLE IF NOT EXISTS analyses (
          id TEXT PRIMARY KEY,
          book_title TEXT NOT NULL,
          author TEXT NOT NULL,
          genre TEXT NOT NULL,
          purpose TEXT NOT NULL,
          audience TEXT NOT NULL,
          processing_mode TEXT NOT NULL CHECK(processing_mode IN ('batch', 'expedited')),
          status TEXT NOT NULL CHECK(status IN ('queued', 'processing', 'completed', 'failed')),
          result_url TEXT,
          error_message TEXT,
          webhook_url TEXT,
          idempotency_key TEXT UNIQUE,
          cost DECIMAL(10,2) NOT NULL,
          processing_time_ms INTEGER,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL,
          started_at TIMESTAMP,
          completed_at TIMESTAMP
        )
      `;

      await sql`CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_analyses_idempotency_key ON analyses(idempotency_key)`;

      await sql`
        CREATE TABLE IF NOT EXISTS api_keys (
          id TEXT PRIMARY KEY,
          key_hash TEXT NOT NULL UNIQUE,
          key_prefix TEXT NOT NULL,
          name TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP NOT NULL,
          last_used_at TIMESTAMP,
          usage_count INTEGER NOT NULL DEFAULT 0
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS webhooks (
          id TEXT PRIMARY KEY,
          analysis_id TEXT NOT NULL,
          url TEXT NOT NULL,
          event_type TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'failed')),
          attempts INTEGER NOT NULL DEFAULT 0,
          last_attempt_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL,
          FOREIGN KEY (analysis_id) REFERENCES analyses(id)
        )
      `;

      await sql`CREATE INDEX IF NOT EXISTS idx_webhooks_status ON webhooks(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_webhooks_analysis_id ON webhooks(analysis_id)`;

      // Create default API key if none exist
      const { rows } = await sql`SELECT COUNT(*) as count FROM api_keys`;
      if (rows[0].count === '0') {
        await this.createApiKey('Default API Key');
      }
    } catch (error) {
      console.error('Error initializing schema:', error);
      throw error;
    }
  }

  // Analysis operations
  async createAnalysis(analysis: Omit<Analysis, 'id' | 'created_at' | 'updated_at'>): Promise<Analysis> {
    await this.ensureInitialized();

    const nanoid = await getNanoid();
    const id = `ana_${nanoid()}`;
    const now = new Date().toISOString();

    const { rows } = await sql`
      INSERT INTO analyses (
        id, book_title, author, genre, purpose, audience,
        processing_mode, status, webhook_url, idempotency_key,
        cost, created_at, updated_at
      ) VALUES (
        ${id}, ${analysis.book_title}, ${analysis.author}, ${analysis.genre},
        ${analysis.purpose}, ${analysis.audience}, ${analysis.processing_mode},
        ${analysis.status}, ${analysis.webhook_url || null}, ${analysis.idempotency_key || null},
        ${analysis.cost}, ${now}, ${now}
      )
      RETURNING *
    `;

    return this.mapAnalysisRow(rows[0]);
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    await this.ensureInitialized();

    const { rows } = await sql`SELECT * FROM analyses WHERE id = ${id}`;
    return rows[0] ? this.mapAnalysisRow(rows[0]) : undefined;
  }

  async updateAnalysis(id: string, updates: Partial<Analysis>): Promise<Analysis | undefined> {
    await this.ensureInitialized();

    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic UPDATE query
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(key);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.getAnalysis(id);

    // Construct SQL update dynamically
    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
    const query = `
      UPDATE analyses
      SET ${setClauses}, updated_at = $${fields.length + 1}
      WHERE id = $${fields.length + 2}
      RETURNING *
    `;

    const { rows } = await sql.query(query, [...values, now, id]);
    return rows[0] ? this.mapAnalysisRow(rows[0]) : undefined;
  }

  async listAnalyses(limit = 50, offset = 0, status?: string): Promise<Analysis[]> {
    await this.ensureInitialized();

    let rows;
    if (status) {
      const result = await sql`
        SELECT * FROM analyses
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      rows = result.rows;
    } else {
      const result = await sql`
        SELECT * FROM analyses
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      rows = result.rows;
    }

    return rows.map(row => this.mapAnalysisRow(row));
  }

  async countAnalyses(status?: string): Promise<number> {
    await this.ensureInitialized();

    let result;
    if (status) {
      result = await sql`SELECT COUNT(*) as count FROM analyses WHERE status = ${status}`;
    } else {
      result = await sql`SELECT COUNT(*) as count FROM analyses`;
    }

    return parseInt(result.rows[0].count);
  }

  // API Key operations
  async createApiKey(name: string): Promise<{ apiKey: string; record: ApiKey }> {
    await this.ensureInitialized();

    const nanoid = await getNanoid();
    const id = `key_${nanoid()}`;
    const apiKey = `bkrptr_live_${nanoid()}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 12) + '...';
    const now = new Date().toISOString();

    const { rows } = await sql`
      INSERT INTO api_keys (id, key_hash, key_prefix, name, created_at, is_active, usage_count)
      VALUES (${id}, ${keyHash}, ${keyPrefix}, ${name}, ${now}, true, 0)
      RETURNING *
    `;

    const record = this.mapApiKeyRow(rows[0]);
    return { apiKey, record };
  }

  async getApiKeyById(id: string): Promise<ApiKey | undefined> {
    await this.ensureInitialized();

    const { rows } = await sql`SELECT * FROM api_keys WHERE id = ${id}`;
    return rows[0] ? this.mapApiKeyRow(rows[0]) : undefined;
  }

  async validateApiKey(apiKey: string): Promise<ApiKey | null> {
    await this.ensureInitialized();

    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const { rows } = await sql`
      SELECT * FROM api_keys WHERE key_hash = ${keyHash} AND is_active = true
    `;

    if (rows[0]) {
      const key = this.mapApiKeyRow(rows[0]);

      // Update last used and usage count
      await sql`
        UPDATE api_keys
        SET last_used_at = ${new Date().toISOString()}, usage_count = usage_count + 1
        WHERE id = ${key.id}
      `;

      return key;
    }

    return null;
  }

  async listApiKeys(): Promise<ApiKey[]> {
    await this.ensureInitialized();

    const { rows } = await sql`SELECT * FROM api_keys ORDER BY created_at DESC`;
    return rows.map(row => this.mapApiKeyRow(row));
  }

  // Webhook operations
  async createWebhook(webhook: Omit<Webhook, 'id' | 'created_at'>): Promise<Webhook> {
    await this.ensureInitialized();

    const nanoid = await getNanoid();
    const id = `wh_${nanoid()}`;
    const now = new Date().toISOString();

    const { rows } = await sql`
      INSERT INTO webhooks (id, analysis_id, url, event_type, status, attempts, created_at)
      VALUES (
        ${id}, ${webhook.analysis_id}, ${webhook.url}, ${webhook.event_type},
        ${webhook.status}, ${webhook.attempts}, ${now}
      )
      RETURNING *
    `;

    return this.mapWebhookRow(rows[0]);
  }

  async getWebhook(id: string): Promise<Webhook | undefined> {
    await this.ensureInitialized();

    const { rows } = await sql`SELECT * FROM webhooks WHERE id = ${id}`;
    return rows[0] ? this.mapWebhookRow(rows[0]) : undefined;
  }

  async updateWebhook(id: string, updates: Partial<Webhook>): Promise<Webhook | undefined> {
    await this.ensureInitialized();

    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(key);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.getWebhook(id);

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
    const query = `
      UPDATE webhooks
      SET ${setClauses}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;

    const { rows } = await sql.query(query, [...values, id]);
    return rows[0] ? this.mapWebhookRow(rows[0]) : undefined;
  }

  async getPendingWebhooks(): Promise<Webhook[]> {
    await this.ensureInitialized();

    const { rows } = await sql`
      SELECT * FROM webhooks
      WHERE status = 'pending' AND attempts < 5
      ORDER BY created_at ASC
    `;

    return rows.map(row => this.mapWebhookRow(row));
  }

  // Helper methods to map PostgreSQL rows to TypeScript types
  private mapAnalysisRow(row: any): Analysis {
    return {
      id: row.id,
      book_title: row.book_title,
      author: row.author,
      genre: row.genre,
      purpose: row.purpose,
      audience: row.audience,
      processing_mode: row.processing_mode,
      status: row.status,
      result_url: row.result_url || undefined,
      error_message: row.error_message || undefined,
      webhook_url: row.webhook_url || undefined,
      idempotency_key: row.idempotency_key || undefined,
      cost: parseFloat(row.cost),
      processing_time_ms: row.processing_time_ms || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
      started_at: row.started_at ? (row.started_at instanceof Date ? row.started_at.toISOString() : row.started_at) : undefined,
      completed_at: row.completed_at ? (row.completed_at instanceof Date ? row.completed_at.toISOString() : row.completed_at) : undefined,
    };
  }

  private mapApiKeyRow(row: any): ApiKey {
    return {
      id: row.id,
      key_hash: row.key_hash,
      key_prefix: row.key_prefix,
      name: row.name,
      is_active: row.is_active,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
      last_used_at: row.last_used_at ? (row.last_used_at instanceof Date ? row.last_used_at.toISOString() : row.last_used_at) : undefined,
      usage_count: parseInt(row.usage_count),
    };
  }

  private mapWebhookRow(row: any): Webhook {
    return {
      id: row.id,
      analysis_id: row.analysis_id,
      url: row.url,
      event_type: row.event_type,
      status: row.status,
      attempts: parseInt(row.attempts),
      last_attempt_at: row.last_attempt_at ? (row.last_attempt_at instanceof Date ? row.last_attempt_at.toISOString() : row.last_attempt_at) : undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    };
  }

  // Compatibility method - PostgreSQL connections are managed by Vercel
  close() {
    // No-op for Vercel Postgres - connections are automatically pooled
  }
}
