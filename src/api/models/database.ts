// src/api/models/database.ts
import { Pool, PoolClient, QueryResult } from 'pg';
import { nanoid } from 'nanoid';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

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
  private pool: Pool;

  constructor(connectionString?: string) {
    // Use DATABASE_URL from environment if not provided
    const dbUrl = connectionString || process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    this.pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
    });

    // Initialize schema on startup
    this.initializeSchema().catch(error => {
      console.error('Failed to initialize database schema:', error);
      throw error;
    });
  }

  private async initializeSchema(): Promise<void> {
    const client = await this.pool.connect();

    try {
      // Read and execute schema migration
      const schemaPath = path.join(process.cwd(), 'migrations', '001_initial_schema.sql');

      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        await client.query(schema);
        console.log('✅ Database schema initialized');
      } else {
        console.warn('⚠️  Schema file not found, skipping initialization');
      }

      // Create default API key if none exist
      const keyCount = await client.query('SELECT COUNT(*) as count FROM api_keys');
      if (parseInt(keyCount.rows[0].count) === 0) {
        const { apiKey, record } = await this.createApiKey('Default API Key');
        console.log(`🔑 Created default API key: ${record.key_prefix}`);
      }
    } finally {
      client.release();
    }
  }

  // Analysis operations
  async createAnalysis(analysis: Omit<Analysis, 'id' | 'created_at' | 'updated_at'>): Promise<Analysis> {
    const id = `ana_${nanoid(21)}`;
    const now = new Date().toISOString();

    const result = await this.pool.query<Analysis>(
      `INSERT INTO analyses (
        id, book_title, author, genre, purpose, audience,
        processing_mode, status, webhook_url, idempotency_key,
        cost, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        id,
        analysis.book_title,
        analysis.author,
        analysis.genre,
        analysis.purpose,
        analysis.audience,
        analysis.processing_mode,
        analysis.status,
        analysis.webhook_url || null,
        analysis.idempotency_key || null,
        analysis.cost,
        now,
        now
      ]
    );

    return this.convertTimestamps(result.rows[0]);
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    const result = await this.pool.query<Analysis>(
      'SELECT * FROM analyses WHERE id = $1',
      [id]
    );

    return result.rows[0] ? this.convertTimestamps(result.rows[0]) : undefined;
  }

  async updateAnalysis(id: string, updates: Partial<Analysis>): Promise<Analysis | undefined> {
    const now = new Date().toISOString();

    // Build dynamic update query
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return this.getAnalysis(id);

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => (updates as any)[field]), now];

    const result = await this.pool.query<Analysis>(
      `UPDATE analyses
       SET ${setClause}, updated_at = $${fields.length + 2}
       WHERE id = $1
       RETURNING *`,
      values
    );

    return result.rows[0] ? this.convertTimestamps(result.rows[0]) : undefined;
  }

  async listAnalyses(limit = 50, offset = 0, status?: string): Promise<Analysis[]> {
    let query = 'SELECT * FROM analyses';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
      query += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
      params.push(limit, offset);
    } else {
      query += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const result = await this.pool.query<Analysis>(query, params);
    return result.rows.map(row => this.convertTimestamps(row));
  }

  async countAnalyses(status?: string): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM analyses';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    const result = await this.pool.query(query, params);
    return parseInt(result.rows[0].count);
  }

  // API Key operations
  async createApiKey(name: string): Promise<{ apiKey: string; record: ApiKey }> {
    const id = `key_${nanoid(16)}`;
    const apiKey = `bkrptr_live_${nanoid(32)}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 12) + '...';
    const now = new Date().toISOString();

    const result = await this.pool.query<ApiKey>(
      `INSERT INTO api_keys (id, key_hash, key_prefix, name, created_at, is_active, usage_count)
       VALUES ($1, $2, $3, $4, $5, true, 0)
       RETURNING *`,
      [id, keyHash, keyPrefix, name, now]
    );

    const record = this.convertTimestamps(result.rows[0]) as ApiKey;
    return { apiKey, record };
  }

  async getApiKeyById(id: string): Promise<ApiKey | undefined> {
    const result = await this.pool.query<ApiKey>(
      'SELECT * FROM api_keys WHERE id = $1',
      [id]
    );

    return result.rows[0] ? this.convertTimestamps(result.rows[0]) as ApiKey : undefined;
  }

  async validateApiKey(apiKey: string): Promise<ApiKey | null> {
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const result = await this.pool.query<ApiKey>(
      'SELECT * FROM api_keys WHERE key_hash = $1 AND is_active = true',
      [keyHash]
    );

    const key = result.rows[0];

    if (key) {
      // Update last used and usage count
      await this.pool.query(
        `UPDATE api_keys
         SET last_used_at = $1, usage_count = usage_count + 1
         WHERE id = $2`,
        [new Date().toISOString(), key.id]
      );
    }

    return key ? this.convertTimestamps(key) as ApiKey : null;
  }

  async listApiKeys(): Promise<ApiKey[]> {
    const result = await this.pool.query<ApiKey>(
      'SELECT * FROM api_keys ORDER BY created_at DESC'
    );

    return result.rows.map(row => this.convertTimestamps(row) as ApiKey);
  }

  // Webhook operations
  async createWebhook(webhook: Omit<Webhook, 'id' | 'created_at'>): Promise<Webhook> {
    const id = `wh_${nanoid(21)}`;
    const now = new Date().toISOString();

    const result = await this.pool.query<Webhook>(
      `INSERT INTO webhooks (id, analysis_id, url, event_type, status, attempts, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        id,
        webhook.analysis_id,
        webhook.url,
        webhook.event_type,
        webhook.status,
        webhook.attempts,
        now
      ]
    );

    return this.convertTimestamps(result.rows[0]) as Webhook;
  }

  async getWebhook(id: string): Promise<Webhook | undefined> {
    const result = await this.pool.query<Webhook>(
      'SELECT * FROM webhooks WHERE id = $1',
      [id]
    );

    return result.rows[0] ? this.convertTimestamps(result.rows[0]) as Webhook : undefined;
  }

  async updateWebhook(id: string, updates: Partial<Webhook>): Promise<Webhook | undefined> {
    // Build dynamic update query
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return this.getWebhook(id);

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => (updates as any)[field])];

    const result = await this.pool.query<Webhook>(
      `UPDATE webhooks
       SET ${setClause}
       WHERE id = $1
       RETURNING *`,
      values
    );

    return result.rows[0] ? this.convertTimestamps(result.rows[0]) as Webhook : undefined;
  }

  async getPendingWebhooks(): Promise<Webhook[]> {
    const result = await this.pool.query<Webhook>(
      `SELECT * FROM webhooks
       WHERE status = 'pending' AND attempts < 5
       ORDER BY created_at ASC`
    );

    return result.rows.map(row => this.convertTimestamps(row) as Webhook);
  }

  // Helper method to convert PostgreSQL timestamps to ISO strings
  private convertTimestamps<T>(row: any): T {
    const converted = { ...row };

    // Convert timestamp fields to ISO strings
    const timestampFields = ['created_at', 'updated_at', 'started_at', 'completed_at', 'last_used_at', 'last_attempt_at'];
    for (const field of timestampFields) {
      if (converted[field] instanceof Date) {
        converted[field] = converted[field].toISOString();
      }
    }

    return converted as T;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
