# Predictive Intelligence

Predictive Intelligence is a later-stage TIP capability. It should come after the platform has enough clean historical data to support credible predictions.

## Goals

- Forecast campaign performance.
- Estimate vendor quality trends.
- Predict contact, qualification, sale, or cancellation likelihood.
- Identify emerging operational risk.
- Improve prioritization without replacing manager judgment.

## Possible Predictions

- Lead likelihood to convert.
- Campaign-level sale rate trend.
- Vendor quality decline.
- ZIP or area-code performance shift.
- Best calling window by geography.
- Import quality risk before full processing.

## Data Requirements

Prediction should wait until TIP has:

- Reliable import history.
- Clean identity matching.
- Sufficient outcome history.
- Stable definitions for outcomes and business metrics.
- Configurable rule versions.
- Auditability for model or scoring decisions.

## Product Principle

Prediction should be humble. TIP should clearly distinguish known historical facts, rule-based scores, and statistical predictions.

## Prediction Logic

Prediction logic belongs in Predictive Intelligence, not in the Recommendation Engine. Recommendations decide what management should do; predictions estimate what is likely to happen.

Prediction outputs should include:

- Predicted connect likelihood.
- Predicted qualified likelihood.
- Predicted transfer likelihood.
- Predicted sale likelihood.
- Predicted cancellation risk.
- Predicted vendor quality trend.
- Predicted campaign health trend.
- Predicted file exhaustion risk.

Every prediction should include:

- Input period.
- Compared baseline.
- Confidence level.
- Data-quality warning when needed.
- Explanation of strongest signals.
- Link to the related recommendation when one exists.

Prediction should not create direct management action by itself. It should feed [Formulas and Scoring](16_FORMULAS_AND_SCORING.md), [Recommendation Rules](20_RECOMMENDATION_RULES.md), and [Decision Engine](24_DECISION_ENGINE.md).
