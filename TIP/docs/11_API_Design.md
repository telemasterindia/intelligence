# API Design

TIP APIs should be boring, explicit, and easy to audit.

## API Principles

- Controllers handle HTTP concerns only.
- Services own business orchestration.
- Repositories own database access.
- Responses should be predictable and structured.
- Errors should be actionable.
- Mutations that affect business state should create audit events.

## Resource Areas

Likely API areas:

- Health.
- Vendors.
- Campaigns.
- Imports.
- Import validations.
- Leads.
- Lead identities.
- Outcomes.
- Intelligence profiles.
- Scores.
- Recommendations.
- Settings and rules.
- Audit events.

## Response Shape

Standard responses should include:

- `data` for successful payloads.
- `error` for failed requests.
- `meta` for pagination, filters, or request context when needed.

## Error Design

Errors should include:

- Stable code.
- Human-readable message.
- Field-level validation detail when relevant.
- Request identifier when available.

## Related Code

- `backend/src/routes`
- `backend/src/controllers`
- `backend/src/services`
- `backend/src/repositories`

