# Data Dictionary

## Purpose

This document defines the major TIP business entities and fields used across management intelligence, reporting, scoring, alerts, and recommendations.

TIP is not a CRM, dialer, or agent workspace. Data definitions should support internal office decisions for TeleMaster India.

## Business Value

A clear data dictionary helps teams:

- Use consistent business language.
- Avoid duplicate meanings for the same metric.
- Connect reports to source data.
- Support auditability.
- Make recommendation logic explainable.

## Inputs

- Database entities.
- Import files.
- Vendor and campaign definitions.
- Call outcomes and dispositions.
- Agent performance data.
- QA and recording data.
- Recommendation and alert records.
- Rule and audit history.

## Outputs

- Shared field definitions.
- Reporting glossary.
- KPI inputs.
- Scoring inputs.
- Alert and recommendation references.

## KPIs

- Data completeness.
- Field validity rate.
- Duplicate rate.
- Missing required field rate.
- Unknown disposition rate.
- Unmapped vendor field rate.
- Audit coverage rate.

## Rules

- Business fields must have one meaning across reports.
- Source fields should be preserved where useful.
- Normalized fields should be used for scoring and recommendations.
- PII-sensitive fields must be handled with access control and masking where required.
- Every major business event should be auditable.

## Entities and Fields

### Leads

Represents one occurrence of a lead identity in a vendor file, campaign, and import batch.

Key fields:

- `lead_id`: unique lead occurrence identifier.
- `lead_identity_id`: link to durable identity.
- `vendor_id`: source vendor.
- `campaign_id`: campaign connected to the lead.
- `import_batch_id`: file/import source.
- `source_row_number`: row number in original file.
- `raw_payload`: original row data where retained.
- `status`: current operational state.
- `created_at`: record creation timestamp.

Examples:

- Same phone number appears in two vendor files, creating two lead records but one identity.

### Lead Identities

Represents a durable phone/person identity across imports and campaigns.

Key fields:

- `lead_identity_id`: unique identity identifier.
- `phone_normalized`: standardized phone number.
- `phone_hash`: protected lookup value.
- `state`: normalized state.
- `zip`: normalized ZIP code.
- `county`: normalized county where available.
- `area_code`: phone area code.
- `timezone`: inferred timezone.
- `suppression_status`: callable, suppressed, DNC, wrong number, disconnected, complaint.
- `last_outcome`: latest known business outcome.

### Import Batches

Represents an uploaded or registered file.

Key fields:

- `import_batch_id`: unique batch identifier.
- `vendor_id`: vendor source.
- `campaign_id`: related campaign.
- `file_name`: file name.
- `file_hash`: duplicate detection value.
- `row_count`: total rows.
- `valid_count`: valid rows.
- `invalid_count`: rejected rows.
- `duplicate_count`: duplicate rows.
- `status`: registered, profiled, validated, committed, failed, retired.
- `created_by`: user who registered import.
- `created_at`: timestamp.

### Vendors

Represents lead data suppliers.

Key fields:

- `vendor_id`: unique vendor identifier.
- `vendor_name`: business name.
- `status`: active, review, paused, stopped.
- `cost_model`: per lead, per file, fixed, other.
- `default_campaign_id`: optional default campaign.
- `quality_score`: latest vendor score.
- `notes`: management notes.

### Campaigns

Represents business calling or sales initiatives.

Key fields:

- `campaign_id`: unique campaign identifier.
- `campaign_name`: business name.
- `status`: active, paused, closed, review.
- `target_states`: eligible states.
- `target_dispositions`: allowed outcomes.
- `attempt_limit`: maximum attempts.
- `re_churn_rules`: rules for re-running leads.
- `health_score`: latest campaign health score.

### Outcomes

Represents business results after call activity.

Key fields:

- `outcome_id`: unique outcome identifier.
- `lead_identity_id`: related identity.
- `campaign_id`: related campaign.
- `agent_id`: related agent if available.
- `outcome_type`: qualified, transferred, sale, cancellation, complaint, other.
- `outcome_time`: timestamp.
- `source`: call system, manual import, QA review, downstream business system.

### Dispositions

Represents call result labels.

Key fields:

- `disposition_id`: unique disposition identifier.
- `disposition_name`: business label.
- `category`: contact, no contact, suppression, quality, sale path.
- `callable_future`: whether future attempts are allowed.
- `re_churn_eligible`: whether it can be re-run.
- `risk_level`: low, medium, high, critical.

Common dispositions:

- No Answer.
- Busy.
- Voicemail.
- Callback.
- Not Interested.
- Qualified.
- Transferred.
- DNC.
- Wrong Number.
- Disconnected.
- Complaint.
- Other.

### Agents

Represents calling staff for management performance analysis.

Key fields:

- `agent_id`: unique agent identifier.
- `agent_name`: display name.
- `team`: team or group.
- `status`: active, inactive.
- `manager_id`: manager reference.
- `productivity_score`: latest productivity score.
- `quality_score`: latest quality score.

### Recordings

Represents call recording metadata for QA and management review.

Key fields:

- `recording_id`: unique recording identifier.
- `call_id`: related call.
- `agent_id`: related agent.
- `lead_identity_id`: related identity.
- `duration_seconds`: call duration.
- `recording_url` or `storage_reference`: location reference.
- `qa_status`: not reviewed, flagged, reviewed, escalated.
- `risk_flags`: short call, long call, complaint, transfer review, disposition mismatch.

### QA

Represents quality assurance review.

Key fields:

- `qa_review_id`: unique review identifier.
- `recording_id`: related recording.
- `agent_id`: related agent.
- `reviewer_id`: QA reviewer.
- `qa_score`: review score.
- `pass_fail`: pass or fail.
- `findings`: review notes.
- `escalation_required`: yes or no.
- `reviewed_at`: timestamp.

### Recommendations

Represents TIP decision recommendations.

Key fields:

- `recommendation_id`: unique recommendation identifier.
- `recommendation_type`: vendor, campaign, file, agent, QA, re-churn, risk, capacity.
- `recommendation`: action text.
- `reason`: explanation.
- `supporting_metrics`: evidence.
- `confidence_score`: 0 to 100.
- `expected_impact`: expected business effect.
- `priority`: low, medium, high, critical.
- `action_owner`: manager, operations, QA, data admin, executive.
- `status`: open, accepted, rejected, closed.

### Alerts

Represents triggered management warnings.

Key fields:

- `alert_id`: unique alert identifier.
- `alert_type`: vendor, campaign, file, agent, disposition, QA, business risk.
- `severity`: info, low, medium, high, critical.
- `trigger`: rule that created alert.
- `owner`: person or role responsible.
- `status`: open, acknowledged, escalated, closed.
- `created_at`: timestamp.
- `closed_at`: timestamp.

### Rule Sets

Represents configurable business logic.

Key fields:

- `rule_set_id`: unique rule set identifier.
- `rule_type`: scoring, recommendation, alert, re-churn, suppression.
- `name`: business name.
- `status`: draft, active, retired.
- `version`: current version.
- `configuration`: structured rule values.
- `effective_from`: start date.
- `effective_to`: optional end date.

### Audit Logs

Represents traceable business events.

Key fields:

- `audit_log_id`: unique audit event identifier.
- `event_type`: import, update, rule change, recommendation, alert, suppression, QA.
- `entity_type`: affected entity.
- `entity_id`: affected record.
- `actor_id`: user or system.
- `details`: structured event details.
- `created_at`: timestamp.

## Examples

Example recommendation record:

```text
recommendation_type: vendor
recommendation: Pause Vendor A
reason: Invalid and disconnected rates exceeded campaign baseline for 3 consecutive days.
confidence_score: 88
priority: High
action_owner: Operations Manager
```

## Related Modules

- Database Design.
- API Design.
- Formulas and Scoring.
- Recommendation Rules.
- Alert Engine.
- Report Catalog.

## Future Improvements

- Add exact database column mapping.
- Add field-level ownership.
- Add PII classification.
- Add retention rules.
- Add data lineage from file import to dashboard metric.

