# Development Rules

These rules keep TIP maintainable as it grows.

## Code Ownership Rules

- React components render UI and handle user interaction.
- Frontend services call APIs.
- Backend routes map endpoints.
- Controllers parse requests and shape responses.
- Services coordinate business use cases.
- Repositories contain SQL.
- Engines contain independent intelligence logic.
- Database migrations define durable schema changes.

## Business Logic Rules

- Do not hardcode scoring thresholds inside UI components.
- Do not put SQL inside controllers.
- Do not let engines read Express request objects.
- Do not overwrite historical outcomes when an append-only record is more accurate.
- Do not add recommendation logic before the evidence and audit path exist.

## Documentation Rules

- Update the relevant knowledge-base document when adding a new module.
- Update API documentation when adding or changing endpoints.
- Update database documentation when adding migrations.
- Record new business rules in Markdown before burying them in code.

## Testing Rules

Test coverage should grow with risk:

- Repository tests for schema and query behavior.
- Service tests for business flows.
- Engine tests for scoring or recommendation logic.
- UI tests for critical import and review flows.

