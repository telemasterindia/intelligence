# TIP Module Contracts

Every future intelligence module must be independent from UI components and route handlers.

Modules should expose:

- `inputSchema`: Required data shape.
- `configurationSchema`: Runtime configuration shape.
- `execute(input, configuration, context)`: Pure business operation.
- `version`: Semantic version for auditability.

Modules must not:

- Read request objects directly.
- Depend on React.
- Hardcode scoring rules or business thresholds.
- Write audit records directly; return events for the audit pipeline.
