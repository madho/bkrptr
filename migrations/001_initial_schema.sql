-- bkrptr PostgreSQL Schema Migration
-- From: SQLite (ephemeral on Railway)
-- To: Supabase PostgreSQL (persistent)
-- Date: 2025-10-21

-- ============================================================================
-- ANALYSES TABLE
-- ============================================================================
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
  cost DECIMAL(10, 4) NOT NULL,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for analyses
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_idempotency_key ON analyses(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- ============================================================================
-- API_KEYS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER NOT NULL DEFAULT 0
);

-- Index for API key lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash) WHERE is_active = true;

-- ============================================================================
-- WEBHOOKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_webhooks_analysis FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
);

-- Indexes for webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_status ON webhooks(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_webhooks_analysis_id ON webhooks(analysis_id);

-- ============================================================================
-- TRIGGERS (for updated_at auto-update)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- NOTES
-- ============================================================================
-- Key differences from SQLite:
-- 1. REAL → DECIMAL(10, 4) for precise cost tracking
-- 2. TEXT dates → TIMESTAMP WITH TIME ZONE for proper timezone handling
-- 3. INTEGER boolean (0/1) → BOOLEAN (true/false)
-- 4. Added trigger for automatic updated_at timestamp
-- 5. Added ON DELETE CASCADE for webhooks to maintain referential integrity
-- 6. Optimized indexes with partial indexes for active records
-- 7. Used DEFAULT NOW() instead of application-level timestamp generation
