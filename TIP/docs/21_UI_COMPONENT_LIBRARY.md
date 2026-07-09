# UI Component Library

## Purpose

This document defines the standard UI components TIP should use for management intelligence screens. The goal is consistent, practical, internal-office-focused interfaces.

TIP is not a CRM, dialer, or agent workspace. UI components should support management review, decisions, reporting, alerts, and recommendations.

## Business Value

A consistent component library helps:

- Managers scan information quickly.
- Teams interpret KPIs consistently.
- Developers build dashboards faster.
- Reports, alerts, and recommendations feel connected.
- Important risks stand out without visual clutter.

## Inputs

- Dashboard specifications.
- Report catalog.
- Recommendation records.
- Alert records.
- KPI and scoring outputs.
- Data tables and filters.

## Outputs

- Standard cards.
- KPI cards.
- Tables.
- Filters.
- Charts.
- Badges.
- Alerts.
- Drawers.
- Modals.
- Empty states.
- Loading states.
- Dark and light theme rules.

## KPIs

- Dashboard load clarity.
- Time to identify top issue.
- Recommendation review completion.
- Alert acknowledgement rate.
- Report usage.
- Filter usage.
- Export usage.

## Rules

- Use plain management language.
- Prioritize decisions over decoration.
- Keep dense information readable.
- Show sample size, date range, and baseline where needed.
- Use severity colors consistently.
- Avoid agent-facing dialing controls.
- Avoid marketing-style layouts.

## Standard Cards

Purpose:

- Group related management information.

Use for:

- Recommendation summary.
- Alert summary.
- File review.
- Vendor status.
- Campaign status.

Rules:

- Card title should describe the business object.
- Card body should show current status, key metric, and decision need.
- Card footer may include owner, priority, or last updated.

Example:

```text
Vendor A Review
Status: Pause Recommended
Reason: Invalid rate 33%, above 15% threshold.
Owner: Operations Manager
```

## KPI Cards

Purpose:

- Show one metric with context.

Required content:

- KPI name.
- Current value.
- Baseline or target.
- Change from previous period.
- Status.

Examples:

- Vendor Score.
- Campaign Health Score.
- Connect Rate.
- Qualified Rate.
- Transfer Rate.
- Cancellation Rate.
- File Quality Score.

Rules:

- Positive and negative direction must be clear.
- Low sample size should be visible.
- KPI cards should link to detail where useful.

## Tables

Purpose:

- Support comparison and operational review.

Common tables:

- Vendor ranking.
- Campaign health.
- Agent scorecard.
- File quality.
- Re-churn candidates.
- Alert queue.
- Recommendation queue.

Rules:

- Include sortable columns.
- Include date range.
- Include owner and status where relevant.
- Use sticky headers for long tables.
- Use row status badges.

## Filters

Standard filters:

- Date range.
- Vendor.
- Campaign.
- File/import batch.
- Agent.
- Team.
- State.
- ZIP.
- Disposition.
- Severity.
- Recommendation status.
- Alert owner.

Rules:

- Filters should be visible on management dashboards.
- Applied filters should be clear.
- Reset should be available.
- Saved views may be added later.

## Charts

Chart types:

- Line chart for trends.
- Bar chart for ranking.
- Stacked bar for disposition mix.
- Heatmap for calling window and geography.
- Donut chart only for simple composition.

Rules:

- Charts must include readable labels.
- Avoid decorative charts that do not support decisions.
- Show baseline or target where helpful.

## Badges

Badge types:

- Status: active, paused, review, stopped, retired.
- Severity: info, low, medium, high, critical.
- Recommendation: buy more, reduce, pause, stop, retire, coach, review.
- Confidence: low, medium, high.

Rules:

- Badge text should be short.
- Colors must be consistent.
- Badge should not be the only source of meaning.

## Alerts

Purpose:

- Surface risks requiring management attention.

Alert content:

- Severity.
- Title.
- Trigger reason.
- Supporting metric.
- Owner.
- Action.

Rules:

- Critical alerts should appear in Attention Required.
- Alerts should not be hidden inside charts.
- Alerts should have acknowledge and close states in future workflows.

## Drawers

Purpose:

- Show detail without leaving the dashboard.

Use for:

- Recommendation detail.
- Alert detail.
- Vendor summary.
- Campaign summary.
- File validation detail.
- Agent scorecard detail.

Rules:

- Drawer should show reason, metrics, history, and related records.
- Drawer should not contain agent dialing controls.

## Modals

Purpose:

- Confirm important management actions.

Use for:

- Accept recommendation.
- Reject recommendation with reason.
- Pause vendor.
- Retire file.
- Escalate QA issue.

Rules:

- Modal should explain impact.
- Require note for rejection or override.
- Avoid using modals for normal browsing.

## Empty States

Purpose:

- Explain why no data appears.

Examples:

- No alerts for selected date range.
- No re-churn candidates meet current rules.
- No QA recordings are flagged.
- No vendor files imported this period.

Rules:

- Empty state should state the reason.
- Empty state may suggest next management step.

## Loading States

Purpose:

- Show that data is being prepared.

Rules:

- Use skeleton rows for tables.
- Use simple loading state for KPI cards.
- Avoid shifting layout after load.

## Dark and Light Theme Usage

Light theme:

- Default for office use and reporting.
- Best for long table review and printed reports.

Dark theme:

- Optional for command center display.
- Useful for wall screens or low-light operations rooms.

Rules:

- Both themes must preserve contrast.
- Severity colors must remain recognizable.
- Charts must be readable in both themes.

## Examples

Example recommendation card:

```text
Pause Vendor B
Priority: High
Confidence: 88
Reason: Invalid rate 29% vs 12% campaign average.
Owner: Operations Manager
```

## Related Modules

- Dashboard Specifications.
- Report Catalog.
- Alert Engine.
- Recommendation Rules.

## Future Improvements

- Add exact component props.
- Add accessibility standards.
- Add responsive layout rules.
- Add print-friendly report components.
- Add saved dashboard views.

