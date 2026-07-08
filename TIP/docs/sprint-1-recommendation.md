# Sprint 1 Recommendation

Recommended Sprint 1 goal: build the internal data ingestion foundation without scoring or analytics.

Scope:

- Define import file registration flow.
- Add CSV schema profiling without persisting leads yet.
- Add vendor and campaign management basics.
- Add import batch lifecycle states.
- Add validation result storage.
- Add audit logging service.
- Add repository tests for the initial schema.

Avoid in Sprint 1:

- Lead scoring.
- Dashboards.
- AI recommendations.
- ROI analytics.
- Calling logic.
- Duplicate detection beyond schema preparation.

Success criteria:

- An internal user can register a vendor, register a campaign, upload or select a local CSV, preview structural validation, and produce an auditable import batch record without loading production leads into the intelligence layer yet.
