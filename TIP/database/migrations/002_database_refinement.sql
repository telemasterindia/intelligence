CREATE TABLE lead_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_normalized TEXT NOT NULL UNIQUE,
  phone_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  confidence NUMERIC(5, 4) NOT NULL DEFAULT 1.0000,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_lead_identities_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

ALTER TABLE leads
  ADD COLUMN lead_identity_id UUID REFERENCES lead_identities(id),
  ADD COLUMN source_row_number BIGINT;

CREATE TABLE lead_outcome_history (
  id BIGSERIAL PRIMARY KEY,
  lead_identity_id UUID NOT NULL REFERENCES lead_identities(id),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id),
  agent_user_id UUID REFERENCES users(id),
  outcome_at TIMESTAMPTZ NOT NULL,
  outcome TEXT NOT NULL,
  duration_seconds INTEGER,
  reason TEXT,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_lead_outcome_duration CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
);

CREATE TABLE import_validations (
  id BIGSERIAL PRIMARY KEY,
  import_batch_id UUID NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  row_number BIGINT NOT NULL,
  reason TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'error',
  original_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_intelligence_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_identity_id UUID NOT NULL UNIQUE REFERENCES lead_identities(id) ON DELETE CASCADE,
  confidence_score NUMERIC(8, 3),
  availability_score NUMERIC(8, 3),
  geography_score NUMERIC(8, 3),
  financial_score NUMERIC(8, 3),
  historical_score NUMERIC(8, 3),
  vendor_score NUMERIC(8, 3),
  gold_score NUMERIC(8, 3),
  recommended_campaign_id UUID REFERENCES campaigns(id),
  recommended_calling_window JSONB,
  risk_level TEXT,
  reason_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE zip_intelligence (
  id BIGSERIAL PRIMARY KEY,
  zip_id BIGINT NOT NULL UNIQUE REFERENCES zip_master(id) ON DELETE CASCADE,
  median_income NUMERIC(12, 2),
  median_age NUMERIC(5, 2),
  population BIGINT,
  senior_percentage NUMERIC(6, 3),
  homeowner_percentage NUMERIC(6, 3),
  debt_index NUMERIC(8, 3),
  historical_connect_rate NUMERIC(8, 5),
  historical_qualification_rate NUMERIC(8, 5),
  historical_cancellation_rate NUMERIC(8, 5),
  financial_stress_index NUMERIC(8, 3),
  enrichment JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE area_code_intelligence (
  id BIGSERIAL PRIMARY KEY,
  area_code_id BIGINT NOT NULL UNIQUE REFERENCES area_code_master(id) ON DELETE CASCADE,
  historical_connect_rate NUMERIC(8, 5),
  historical_qualification_rate NUMERIC(8, 5),
  historical_revenue NUMERIC(14, 2),
  historical_cancellation_rate NUMERIC(8, 5),
  calling_performance JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vendor_performance (
  id BIGSERIAL PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  total_leads BIGINT NOT NULL DEFAULT 0,
  total_calls BIGINT NOT NULL DEFAULT 0,
  connect_rate NUMERIC(8, 5),
  qualification_rate NUMERIC(8, 5),
  cancellation_rate NUMERIC(8, 5),
  revenue NUMERIC(14, 2),
  roi NUMERIC(12, 4),
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vendor_id, campaign_id, period_start, period_end)
);

CREATE TABLE calling_intelligence (
  id BIGSERIAL PRIMARY KEY,
  zip_id BIGINT REFERENCES zip_master(id) ON DELETE CASCADE,
  state_id BIGINT REFERENCES state_master(id) ON DELETE CASCADE,
  timezone_id BIGINT REFERENCES timezone_master(id),
  hour_of_day SMALLINT NOT NULL,
  day_of_week SMALLINT NOT NULL,
  connect_rate NUMERIC(8, 5),
  qualification_rate NUMERIC(8, 5),
  revenue NUMERIC(14, 2),
  sample_size BIGINT NOT NULL DEFAULT 0,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_calling_intelligence_hour CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  CONSTRAINT chk_calling_intelligence_day CHECK (day_of_week >= 0 AND day_of_week <= 6),
  CONSTRAINT uq_calling_intelligence_scope UNIQUE (zip_id, state_id, timezone_id, hour_of_day, day_of_week)
);

CREATE TABLE rule_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rule_set_key TEXT NOT NULL UNIQUE,
  rule_type TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  configuration JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rule_set_versions (
  id BIGSERIAL PRIMARY KEY,
  rule_set_id UUID NOT NULL REFERENCES rule_sets(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  configuration JSONB NOT NULL,
  change_reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (rule_set_id, version)
);

CREATE INDEX idx_lead_identities_phone_normalized ON lead_identities(phone_normalized);
CREATE INDEX idx_lead_identities_phone_hash ON lead_identities(phone_hash);
CREATE INDEX idx_lead_identities_status_updated ON lead_identities(status, updated_at DESC);

CREATE INDEX idx_leads_identity_created ON leads(lead_identity_id, created_at DESC);
CREATE INDEX idx_leads_import_batch ON leads(import_batch_id, source_row_number);
CREATE INDEX idx_leads_campaign_created ON leads(campaign_id, created_at DESC);
CREATE INDEX idx_leads_state_created ON leads(state_id, created_at DESC);
CREATE INDEX idx_leads_zip_created ON leads(zip_id, created_at DESC);

CREATE INDEX idx_lead_outcome_identity_time ON lead_outcome_history(lead_identity_id, outcome_at DESC);
CREATE INDEX idx_lead_outcome_campaign_time ON lead_outcome_history(campaign_id, outcome_at DESC);
CREATE INDEX idx_lead_outcome_outcome_time ON lead_outcome_history(outcome, outcome_at DESC);
CREATE INDEX idx_lead_outcome_agent_time ON lead_outcome_history(agent_user_id, outcome_at DESC);

CREATE INDEX idx_import_validations_batch_row ON import_validations(import_batch_id, row_number);
CREATE INDEX idx_import_validations_reason ON import_validations(reason);
CREATE INDEX idx_import_validations_severity ON import_validations(severity);
CREATE INDEX idx_import_validations_original_json_gin ON import_validations USING GIN(original_json);

CREATE INDEX idx_lead_intelligence_gold_score ON lead_intelligence_profiles(gold_score DESC);
CREATE INDEX idx_lead_intelligence_risk_level ON lead_intelligence_profiles(risk_level);
CREATE INDEX idx_lead_intelligence_recommended_campaign ON lead_intelligence_profiles(recommended_campaign_id);
CREATE INDEX idx_lead_intelligence_reasons_gin ON lead_intelligence_profiles USING GIN(reason_json);

CREATE INDEX idx_zip_intelligence_connect_rate ON zip_intelligence(historical_connect_rate DESC);
CREATE INDEX idx_zip_intelligence_qualification_rate ON zip_intelligence(historical_qualification_rate DESC);
CREATE INDEX idx_zip_intelligence_financial_stress ON zip_intelligence(financial_stress_index DESC);

CREATE INDEX idx_area_code_intelligence_connect_rate ON area_code_intelligence(historical_connect_rate DESC);
CREATE INDEX idx_area_code_intelligence_revenue ON area_code_intelligence(historical_revenue DESC);

CREATE INDEX idx_vendor_performance_vendor_updated ON vendor_performance(vendor_id, updated_at DESC);
CREATE INDEX idx_vendor_performance_campaign_updated ON vendor_performance(campaign_id, updated_at DESC);
CREATE INDEX idx_vendor_performance_period ON vendor_performance(period_start, period_end);
CREATE INDEX idx_vendor_performance_roi ON vendor_performance(roi DESC);

CREATE INDEX idx_calling_intelligence_zip_window ON calling_intelligence(zip_id, day_of_week, hour_of_day);
CREATE INDEX idx_calling_intelligence_state_window ON calling_intelligence(state_id, day_of_week, hour_of_day);
CREATE INDEX idx_calling_intelligence_connect_rate ON calling_intelligence(connect_rate DESC);
CREATE INDEX idx_calling_intelligence_sample_size ON calling_intelligence(sample_size DESC);

CREATE INDEX idx_rule_sets_type_status ON rule_sets(rule_type, status);
CREATE INDEX idx_rule_sets_effective_window ON rule_sets(effective_from, effective_to);
CREATE INDEX idx_rule_sets_configuration_gin ON rule_sets USING GIN(configuration);
CREATE INDEX idx_rule_set_versions_rule_set_created ON rule_set_versions(rule_set_id, created_at DESC);
