// src/api/models/database.ts
import Database from 'better-sqlite3';
import path from 'path';
import { nanoid } from 'nanoid';
import * as crypto from 'crypto';

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
  private db: Database.Database;

  constructor(dbPath?: string) {
    const defaultPath = path.join(process.cwd(), 'data', 'bkrptr.db');
    this.db = new Database(dbPath || defaultPath);
    this.initializeSchema();
  }

  private initializeSchema() {
    // Create tables
    this.db.exec(`
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
        cost REAL NOT NULL,
        processing_time_ms INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        started_at TEXT,
        completed_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
      CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);
      CREATE INDEX IF NOT EXISTS idx_analyses_idempotency_key ON analyses(idempotency_key);

      CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        key_hash TEXT NOT NULL UNIQUE,
        key_prefix TEXT NOT NULL,
        name TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        last_used_at TEXT,
        usage_count INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS webhooks (
        id TEXT PRIMARY KEY,
        analysis_id TEXT NOT NULL,
        url TEXT NOT NULL,
        event_type TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'failed')),
        attempts INTEGER NOT NULL DEFAULT 0,
        last_attempt_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (analysis_id) REFERENCES analyses(id)
      );

      CREATE INDEX IF NOT EXISTS idx_webhooks_status ON webhooks(status);
      CREATE INDEX IF NOT EXISTS idx_webhooks_analysis_id ON webhooks(analysis_id);
    `);

    // Create default API key if none exist
    const keyCount = this.db.prepare('SELECT COUNT(*) as count FROM api_keys').get() as { count: number };
    if (keyCount.count === 0) {
      this.createApiKey('Default API Key');
    }
  }

  // Analysis operations
  createAnalysis(analysis: Omit<Analysis, 'id' | 'created_at' | 'updated_at'>): Analysis {
    const id = `ana_${nanoid(21)}`;
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO analyses (
        id, book_title, author, genre, purpose, audience,
        processing_mode, status, webhook_url, idempotency_key,
        cost, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
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
    );

    return this.getAnalysis(id)!;
  }

  getAnalysis(id: string): Analysis | undefined {
    const stmt = this.db.prepare('SELECT * FROM analyses WHERE id = ?');
    return stmt.get(id) as Analysis | undefined;
  }

  updateAnalysis(id: string, updates: Partial<Analysis>): Analysis | undefined {
    const now = new Date().toISOString();
    const fields = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => `${key} = ?`)
      .join(', ');

    if (!fields) return this.getAnalysis(id);

    const values = Object.entries(updates)
      .filter(([key]) => key !== 'id' && key !== 'created_at')
      .map(([_, value]) => value);

    const stmt = this.db.prepare(`
      UPDATE analyses
      SET ${fields}, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(...values, now, id);
    return this.getAnalysis(id);
  }

  listAnalyses(limit = 50, offset = 0, status?: string): Analysis[] {
    let query = 'SELECT * FROM analyses';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Analysis[];
  }

  countAnalyses(status?: string): number {
    let query = 'SELECT COUNT(*) as count FROM analyses';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    const stmt = this.db.prepare(query);
    const result = stmt.get(...params) as { count: number };
    return result.count;
  }

  // API Key operations
  createApiKey(name: string): { apiKey: string; record: ApiKey } {
    const id = `key_${nanoid(16)}`;
    const apiKey = `bkrptr_live_${nanoid(32)}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 12) + '...';
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO api_keys (id, key_hash, key_prefix, name, created_at, is_active, usage_count)
      VALUES (?, ?, ?, ?, ?, 1, 0)
    `);

    stmt.run(id, keyHash, keyPrefix, name, now);

    const record = this.getApiKeyById(id)!;
    return { apiKey, record };
  }

  getApiKeyById(id: string): ApiKey | undefined {
    const stmt = this.db.prepare('SELECT * FROM api_keys WHERE id = ?');
    return stmt.get(id) as ApiKey | undefined;
  }

  validateApiKey(apiKey: string): ApiKey | null {
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const stmt = this.db.prepare('SELECT * FROM api_keys WHERE key_hash = ? AND is_active = 1');
    const key = stmt.get(keyHash) as ApiKey | undefined;

    if (key) {
      // Update last used and usage count
      this.db.prepare(`
        UPDATE api_keys
        SET last_used_at = ?, usage_count = usage_count + 1
        WHERE id = ?
      `).run(new Date().toISOString(), key.id);
    }

    return key || null;
  }

  listApiKeys(): ApiKey[] {
    const stmt = this.db.prepare('SELECT * FROM api_keys ORDER BY created_at DESC');
    return stmt.all() as ApiKey[];
  }

  // Webhook operations
  createWebhook(webhook: Omit<Webhook, 'id' | 'created_at'>): Webhook {
    const id = `wh_${nanoid(21)}`;
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO webhooks (id, analysis_id, url, event_type, status, attempts, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      webhook.analysis_id,
      webhook.url,
      webhook.event_type,
      webhook.status,
      webhook.attempts,
      now
    );

    return this.getWebhook(id)!;
  }

  getWebhook(id: string): Webhook | undefined {
    const stmt = this.db.prepare('SELECT * FROM webhooks WHERE id = ?');
    return stmt.get(id) as Webhook | undefined;
  }

  updateWebhook(id: string, updates: Partial<Webhook>): Webhook | undefined {
    const fields = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => `${key} = ?`)
      .join(', ');

    if (!fields) return this.getWebhook(id);

    const values = Object.entries(updates)
      .filter(([key]) => key !== 'id' && key !== 'created_at')
      .map(([_, value]) => value);

    const stmt = this.db.prepare(`UPDATE webhooks SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);

    return this.getWebhook(id);
  }

  getPendingWebhooks(): Webhook[] {
    const stmt = this.db.prepare(`
      SELECT * FROM webhooks
      WHERE status = 'pending' AND attempts < 5
      ORDER BY created_at ASC
    `);
    return stmt.all() as Webhook[];
  }

  close() {
    this.db.close();
  }
}
