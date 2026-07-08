# Database Schema

The PostgreSQL schema is defined through migrations:

- `database/migrations/001_initial_schema.sql`: Sprint 0 foundation.
- `database/migrations/002_database_refinement.sql`: Sprint 0.5 identity and intelligence refinement.

Core entities:

- `users`: Internal users only.
- `vendors`: Lead data vendors.
- `campaigns`: Vendor-linked campaigns.
- `import_batches`: Future import tracking and auditing.
- `lead_identities`: One durable identity per normalized phone number.
- `leads`: One occurrence of an identity inside one import batch, vendor, and campaign.
- `lead_history`: Append-oriented lead event history.
- `lead_outcome_history`: Append-only call and business outcome history by identity.
- `import_validations`: Rejected import rows and validation reasons.
- `lead_intelligence_profiles`: Current knowledge profile for each identity.
- `lead_scores`: Future scoring outputs.
- `scoring_rules`: Versioned JSONB configuration for future scoring engines.
- `rule_sets`: General configurable rule architecture for future business rules.
- `rule_set_versions`: Historical versions of configurable rule sets.
- `exports`: Future export request tracking.
- `audit_log`: Prepared audit trail for imports, exports, config changes, scoring runs, and user actions.
- `application_settings`: Configurable platform settings.

Reference data:

- `state_master`
- `county_master`
- `zip_master`
- `area_code_master`
- `timezone_master`

Intelligence tables:

- `zip_intelligence`: Enriched ZIP-level demographic, financial, and historical performance knowledge.
- `area_code_intelligence`: Area-code-level calling and revenue performance knowledge.
- `vendor_performance`: Pre-aggregated vendor and campaign performance statistics.
- `calling_intelligence`: Learned calling-window performance by geography, hour, and day.

Performance posture:

- UUID primary keys for business entities.
- BIGSERIAL primary keys for high-volume event and score records.
- Foreign keys for relational integrity.
- Composite indexes for vendor/campaign, geography, status, and time-based filtering.
- Identity indexes on normalized phone and phone hash.
- Outcome indexes by identity, campaign, agent, outcome, and time.
- Import validation indexes by batch, row, reason, severity, and original JSON.
- GIN index on `leads.raw_payload` for controlled raw-field investigation.
- GIN indexes on JSONB rule/configuration/reason fields where future search is likely.
- JSONB configuration fields for future configurable rules without code changes.

No sample data is included.
