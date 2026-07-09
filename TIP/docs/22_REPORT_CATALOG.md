# Report Catalog

## Purpose

This document defines the standard management reports TIP should provide for TeleMaster India.

TIP is not a CRM, dialer, or agent workspace. Reports should support internal office review, management decisions, vendor strategy, QA, and business planning.

## Business Value

Reports help management:

- Review performance by vendor, campaign, file, agent, geography, and outcome.
- Explain business results.
- Track risks and opportunities.
- Share consistent summaries across management.
- Make repeatable decisions using the same definitions.

## Inputs

- Lead and identity data.
- Vendor and campaign data.
- Import batch and file quality data.
- Dispositions and outcomes.
- Agent performance data.
- Recording and QA data.
- Scores, recommendations, and alerts.
- Cost, revenue, sale, and cancellation data.

## Outputs

- Standard reports.
- Exportable tables.
- Management summaries.
- KPI trend views.
- Decision-ready report sections.

## KPIs

- Report usage count.
- Export count.
- Scheduled report delivery.
- Recommendation generated from report.
- Management action taken from report.
- Data freshness.

## Rules

- Every report must show date range.
- Every report must show filters applied.
- Every report should show sample size.
- Every report should include management summary.
- Reports should use the same KPI definitions as dashboards.
- Reports should not include agent dialing workflow features.

## Vendor Performance Report

Purpose:

- Decide vendor purchase strategy.

KPIs:

- Vendor Score.
- Duplicate percentage.
- Invalid percentage.
- Connect percentage.
- Qualified percentage.
- Transfer percentage.
- Cancellation percentage.
- Cost per qualified lead.
- ROI.

Sections:

- Vendor ranking.
- Vendor trend.
- Vendor by campaign.
- File quality by vendor.
- Recommendation summary.

Example decision:

- Buy more, reduce, pause, or stop vendor.

## Campaign Performance Report

Purpose:

- Review campaign health and business outcome.

KPIs:

- Campaign Health Score.
- Connect rate.
- Qualified rate.
- Transfer rate.
- Sale rate.
- Cancellation rate.
- ROI.
- File Quality Score.

Sections:

- Campaign summary.
- Vendor mix.
- Agent performance contribution.
- Disposition breakdown.
- Geography performance.
- Risk and opportunity summary.

## Agent Scorecard Report

Purpose:

- Support coaching, recognition, and management review.

KPIs:

- Agent Productivity Score.
- Agent Quality Score.
- Calls per hour.
- Connect rate.
- Qualified rate.
- Transfer rate.
- Occupancy.
- Idle percentage.
- Break percentage.
- Wrap-up time.
- ACW time.
- Disposition Quality Score.
- QA pass rate.

Sections:

- Agent ranking.
- Team average comparison.
- Coaching flags.
- Disposition variance.
- QA findings.

## Disposition Quality Report

Purpose:

- Identify disposition misuse, anomalies, and file quality signals.

KPIs:

- Disposition Quality Score.
- Campaign disposition average.
- Agent disposition variance.
- Generic disposition percentage.
- DNC rate.
- Wrong-number rate.
- Disconnected rate.
- Callback completion rate.

Sections:

- Campaign disposition mix.
- Agent variance.
- Suspicious patterns.
- Generic overuse.
- Disposition trend.

## Re-Churn Candidates Report

Purpose:

- Identify leads and files eligible for re-run.

KPIs:

- Re-Churn Score.
- Eligible lead count.
- Suppressed lead count.
- Attempt count.
- Time since last attempt.
- Historical connect rate.
- Historical qualified rate.
- Best calling window.

Sections:

- Candidate list.
- File-level re-churn ranking.
- Disposition eligibility.
- Exclusion reasons.
- Expected impact.

## File Quality Report

Purpose:

- Decide whether files should continue, be delayed, re-churned, or retired.

KPIs:

- File Quality Score.
- Valid rate.
- Invalid rate.
- Duplicate rate.
- Connect rate.
- Qualified rate.
- Transfer rate.
- DNC rate.
- Wrong-number rate.
- Disconnected rate.
- Attempt exhaustion rate.
- ROI.

Sections:

- File summary.
- Validation issues.
- Performance trend.
- Vendor comparison.
- Retirement recommendation.

## ZIP and State Performance Report

Purpose:

- Identify geography-level performance and risk.

KPIs:

- ZIP Score.
- State Score.
- Connect rate.
- Qualified rate.
- Transfer rate.
- Sale rate.
- Cancellation rate.
- Best calling window.
- Revenue by geography.

Sections:

- State ranking.
- ZIP ranking.
- Campaign geography performance.
- Vendor geography performance.
- Calling window heatmap.

## QA Review Report

Purpose:

- Support recording review, coaching, and risk escalation.

KPIs:

- QA pass rate.
- QA fail rate.
- Escalation count.
- Complaint count.
- Short-call flag count.
- Long-call flag count.
- Transfer review count.
- Cancellation after transfer.

Sections:

- Flagged recordings.
- Agent QA summary.
- Campaign QA summary.
- Complaint trends.
- Escalation status.

## Business Summary Report

Purpose:

- Give executives a clear view of business health.

KPIs:

- Business Health Score.
- Revenue.
- Cost.
- ROI.
- Vendor Score average.
- Campaign Health Score average.
- File Quality Score average.
- Sale rate.
- Cancellation rate.
- High-priority alerts.
- Open recommendations.

Sections:

- Executive summary.
- Attention Required.
- Today's Decisions.
- Risks.
- Opportunities.
- Recommendation status.

## Examples

Example report summary:

```text
Report: Vendor Performance
Date range: Last 7 days
Finding: Vendor D has strong connect rate but high cancellation rate.
Decision: Continue only after QA review of transferred calls.
Owner: Operations Manager
```

## Related Modules

- Dashboard Specifications.
- Formulas and Scoring.
- Recommendation Rules.
- Alert Engine.
- Data Dictionary.

## Future Improvements

- Add scheduled email delivery.
- Add PDF export.
- Add CSV export.
- Add manager annotations.
- Add report templates by role.
- Add report subscription settings.

