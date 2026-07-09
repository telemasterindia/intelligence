# Dashboard Specifications

## Purpose

This document defines the management dashboards TIP should provide for TeleMaster India. Dashboards should help managers make decisions, not simply view charts.

TIP is not a CRM, dialer, or agent workspace. Dashboards are for internal management intelligence.

## Business Value

Dashboards should help management:

- See what needs attention today.
- Compare vendors, campaigns, files, agents, and geographies.
- Understand risks and opportunities.
- Review recommendations with supporting metrics.
- Decide where to spend, pause, coach, re-churn, or escalate.

## Inputs

- Vendor, campaign, file, lead, and import data.
- Agent activity and outcome data.
- Dispositions and recordings.
- QA review results.
- Scores and recommendations.
- Alerts.
- Revenue, cost, sale, and cancellation data.

## Outputs

- Management dashboards.
- KPI panels.
- Decision queues.
- Alerts and recommendations.
- Drill-down tables.
- Exportable report views.

## KPIs

- Business Health Score.
- Vendor Score.
- Campaign Health Score.
- File Quality Score.
- Agent Productivity Score.
- Agent Quality Score.
- Re-Churn Score.
- Connect rate.
- Qualified rate.
- Transfer rate.
- Sale rate.
- Cancellation rate.
- ROI.
- QA pass rate.
- Alert count by severity.

## Rules

- Every dashboard should begin with decision-first information.
- Show comparison against baseline.
- Show date range and sample size.
- Use plain management language.
- Avoid agent-facing workflow controls.
- Include drill-down only where it supports decisions.

## Executive Command Center

Purpose:

- Give leadership a daily view of business health and required decisions.

Top sections:

- Attention Required.
- Today's Decisions.
- TIP Recommendations.
- Risks.
- Opportunities.

Primary KPIs:

- Business Health Score.
- Revenue and ROI.
- Campaign Health Score average.
- Vendor Score average.
- High-severity alerts.
- Open recommendations.
- Cancellation risk.

Example cards:

- `Pause Vendor A`: invalid rate doubled this week.
- `Review Campaign B`: transfer rate below target.
- `Retire File C`: attempts exhausted and low connect rate.
- `Coach Agent D`: quality score below team average.

## Data Intelligence Dashboard

Purpose:

- Monitor import quality and data reliability.

Primary KPIs:

- Total files imported.
- Valid rows.
- Invalid rows.
- Duplicate percentage.
- Missing phone percentage.
- Invalid ZIP/state percentage.
- Rejected row count.
- File Quality Score.

Views:

- Import batch table.
- File validation summary.
- Vendor data quality comparison.
- Field mapping issues.
- Rejected row reasons.

Management decisions:

- Accept file.
- Request vendor correction.
- Pause vendor file intake.
- Retire poor file.

## Operations Intelligence Dashboard

Purpose:

- Track daily operating performance and bottlenecks.

Primary KPIs:

- Calls per hour.
- Connect rate.
- Qualified rate.
- Transfer rate.
- Occupancy.
- Idle percentage.
- Break percentage.
- Wrap-up time.
- ACW time.

Views:

- Team performance trend.
- Campaign operating status.
- Agent variance table.
- Disposition anomaly table.
- Attempt exhaustion view.

Management decisions:

- Adjust campaign priority.
- Review agent coaching needs.
- Review files with poor operational outcomes.
- Escalate workflow bottlenecks.

## Business Intelligence Dashboard

Purpose:

- Connect operational performance to financial outcomes.

Primary KPIs:

- Revenue.
- Cost.
- ROI.
- Cost per qualified lead.
- Cost per transfer.
- Sale rate.
- Cancellation rate.
- Net performance by vendor and campaign.

Views:

- Vendor ROI table.
- Campaign profitability.
- State and ZIP performance.
- Cancellation trend.
- Revenue by file source.

Management decisions:

- Buy more from a vendor.
- Reduce campaign budget.
- Shift focus to better geographies.
- Investigate cancellation source.

## Team Performance Dashboard

Purpose:

- Compare agent productivity and quality for coaching decisions.

Primary KPIs:

- Agent Productivity Score.
- Agent Quality Score.
- Calls per hour.
- Connect rate.
- Qualified rate.
- Transfer rate.
- Idle percentage.
- Break percentage.
- Disposition Quality Score.
- QA pass rate.

Views:

- Agent scorecard table.
- Team average comparison.
- Coaching flags.
- Disposition variance.
- QA review queue.

Management decisions:

- Coach agent.
- Review recordings.
- Investigate disposition misuse.
- Recognize high performers.

## Vendor Performance Dashboard

Purpose:

- Decide vendor purchase strategy.

Primary KPIs:

- Vendor Score.
- Duplicate percentage.
- Invalid percentage.
- Connect percentage.
- Qualified percentage.
- Transfer percentage.
- Cancellation percentage.
- Cost per qualified lead.
- ROI.

Views:

- Vendor ranking.
- Vendor trend.
- Vendor file quality.
- Vendor campaign comparison.
- Vendor recommendation queue.

Management decisions:

- Buy more.
- Reduce.
- Pause.
- Stop.
- Request replacement file.

## Campaign Health Dashboard

Purpose:

- Monitor campaign performance and health.

Primary KPIs:

- Campaign Health Score.
- Connect rate.
- Qualified rate.
- Transfer rate.
- Sale rate.
- Cancellation rate.
- File Quality Score.
- Agent execution score.

Views:

- Campaign status table.
- Campaign trend.
- Vendor mix.
- Geography performance.
- Disposition breakdown.

Management decisions:

- Increase campaign priority.
- Pause campaign.
- Change vendor mix.
- Review agent performance.
- Adjust re-churn rules.

## Re-Churn Center

Purpose:

- Decide which leads and files should be re-run.

Primary KPIs:

- Re-Churn Score.
- Eligible lead count.
- Suppressed lead count.
- Attempt exhaustion rate.
- Re-churn connect rate.
- Re-churn qualified rate.
- Best calling window.

Views:

- Re-churn candidate list.
- File re-churn ranking.
- Disposition eligibility table.
- Attempt-limit exceptions.
- Best time-window heatmap.

Management decisions:

- Approve re-churn.
- Delay re-churn.
- Exclude file.
- Retire file.
- Adjust attempt rules.

## Examples

Example dashboard summary:

```text
Attention Required:
Vendor B invalid rate is 33%, above the 15% threshold.

Today's Decision:
Pause Vendor B intake or request replacement file.

Expected Impact:
Reduce wasted calling time and improve campaign connect rate.
```

## Related Modules

- Formulas and Scoring.
- Recommendation Rules.
- Alert Engine.
- Report Catalog.
- UI Component Library.

## Future Improvements

- Add manager-specific saved views.
- Add benchmark comparison by month.
- Add dashboard annotations.
- Add scheduled email summaries.
- Add executive PDF export.

