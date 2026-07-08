CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'analyst',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE state_master (
  id BIGSERIAL PRIMARY KEY,
  state_code CHAR(2) NOT NULL UNIQUE,
  state_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE county_master (
  id BIGSERIAL PRIMARY KEY,
  state_id BIGINT NOT NULL REFERENCES state_master(id),
  county_name TEXT NOT NULL,
  fips_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (state_id, county_name)
);

CREATE TABLE timezone_master (
  id BIGSERIAL PRIMARY KEY,
  timezone_name TEXT NOT NULL UNIQUE,
  utc_offset_minutes SMALLINT NOT NULL,
  observes_dst BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE zip_master (
  id BIGSERIAL PRIMARY KEY,
  zip_code VARCHAR(10) NOT NULL UNIQUE,
  state_id BIGINT REFERENCES state_master(id),
  county_id BIGINT REFERENCES county_master(id),
  timezone_id BIGINT REFERENCES timezone_master(id),
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE area_code_master (
  id BIGSERIAL PRIMARY KEY,
  area_code CHAR(3) NOT NULL UNIQUE,
  state_id BIGINT REFERENCES state_master(id),
  timezone_id BIGINT REFERENCES timezone_master(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  campaign_id UUID REFERENCES campaigns(id),
  original_file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  total_rows BIGINT NOT NULL DEFAULT 0,
  accepted_rows BIGINT NOT NULL DEFAULT 0,
  rejected_rows BIGINT NOT NULL DEFAULT 0,
  imported_by UUID REFERENCES users(id),
  imported_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_batch_id UUID REFERENCES import_batches(id),
  vendor_id UUID REFERENCES vendors(id),
  campaign_id UUID REFERENCES campaigns(id),
  first_name TEXT,
  last_name TEXT,
  phone_e164 TEXT NOT NULL,
  email CITEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_id BIGINT REFERENCES state_master(id),
  county_id BIGINT REFERENCES county_master(id),
  zip_id BIGINT REFERENCES zip_master(id),
  area_code_id BIGINT REFERENCES area_code_master(id),
  timezone_id BIGINT REFERENCES timezone_master(id),
  status TEXT NOT NULL DEFAULT 'new',
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_history (
  id BIGSERIAL PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_source TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rule_key TEXT NOT NULL UNIQUE,
  module_name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  configuration JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_scores (
  id BIGSERIAL PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  scoring_rule_id UUID REFERENCES scoring_rules(id),
  score NUMERIC(8, 3) NOT NULL,
  score_band TEXT,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  requested_by UUID REFERENCES users(id),
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  row_count BIGINT NOT NULL DEFAULT 0,
  file_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_state JSONB,
  after_state JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE application_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_vendor_status ON campaigns(vendor_id, status);
CREATE INDEX idx_import_batches_vendor_campaign ON import_batches(vendor_id, campaign_id);
CREATE INDEX idx_leads_phone_e164 ON leads(phone_e164);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_vendor_campaign ON leads(vendor_id, campaign_id);
CREATE INDEX idx_leads_geo ON leads(state_id, zip_id, area_code_id);
CREATE INDEX idx_leads_status_created ON leads(status, created_at DESC);
CREATE INDEX idx_leads_raw_payload_gin ON leads USING GIN(raw_payload);
CREATE INDEX idx_lead_history_lead_created ON lead_history(lead_id, created_at DESC);
CREATE INDEX idx_lead_history_event_type ON lead_history(event_type);
CREATE INDEX idx_lead_scores_lead_scored ON lead_scores(lead_id, scored_at DESC);
CREATE INDEX idx_lead_scores_score ON lead_scores(score DESC);
CREATE INDEX idx_exports_requested_by ON exports(requested_by, created_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_action_created ON audit_log(action, created_at DESC);
CREATE INDEX idx_application_settings_key ON application_settings(setting_key);
