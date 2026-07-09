# Database Design

TIP uses PostgreSQL as the durable system of record.

## Design Principles

- Preserve history instead of overwriting it.
- Separate identity from occurrences.
- Store rejected data when it creates audit or vendor-quality value.
- Use configurable rule tables for business logic.
- Keep intelligence aggregates separate from raw history.
- Design indexes around import, identity, geography, vendor, campaign, outcome, and time.

## Core Entity Groups

- Users and internal access.
- Vendors and campaigns.
- Import batches and validations.
- Lead identities and lead occurrences.
- Lead outcome history.
- Intelligence profiles and scores.
- Geography reference data.
- Vendor, ZIP, area-code, and calling-window intelligence.
- Rule sets and rule versions.
- Audit log and application settings.

## Important Distinction

`lead_identities` represents the durable person or phone identity. `leads` represents a specific appearance of that identity in an import, vendor, and campaign. This distinction protects TIP from treating repeated vendor rows as brand-new intelligence.

## Related Files

- [Database Schema](database-schema.md)
- [Sprint 0.5 Database Refinement](sprint-0-5-database-refinement.md)
- [Initial Migration](../database/migrations/001_initial_schema.sql)
- [Refinement Migration](../database/migrations/002_database_refinement.sql)

