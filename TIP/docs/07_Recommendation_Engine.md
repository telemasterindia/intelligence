# Recommendation Engine

The Recommendation Engine should suggest what the business should do next.

## Goals

- Prioritize leads, campaigns, vendors, and calling windows.
- Explain why a recommendation was made.
- Use configurable rules and historical evidence.
- Avoid opaque decisions that users cannot inspect.

## Recommendation Types

Future recommendations may include:

- Call this campaign first.
- Prioritize these ZIPs or area codes.
- Reduce spend on this vendor.
- Investigate this import batch.
- Avoid this lead segment.
- Re-run a scoring job after rule changes.
- Increase attention to a profitable state or county.

## Required Inputs

The engine may use:

- Lead identity history.
- Lead outcome history.
- Vendor performance.
- Campaign performance.
- ZIP intelligence.
- Area-code intelligence.
- Calling-window intelligence.
- Business rules and thresholds.

## Explainability Standard

Every recommendation should return:

- Recommendation type.
- Target entity.
- Confidence level.
- Supporting evidence.
- Rule version.
- Human-readable explanation.
- Audit event metadata.

## Boundary

The Recommendation Engine should not directly update UI state, send calls, or mutate business records without going through services and audit flows.

