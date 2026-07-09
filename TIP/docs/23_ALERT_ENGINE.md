# Alert Engine

## Purpose

This document defines TIP alert types, triggers, severity levels, owners, escalation, auto-close rules, and examples.

TIP is not a CRM, dialer, or agent workspace. Alerts should guide management attention toward operational risk, business risk, quality issues, and decision needs.

## Business Value

The Alert Engine helps TeleMaster India:

- Detect problems early.
- Reduce wasted spend.
- Protect compliance.
- Improve vendor and file quality.
- Escalate QA issues.
- Keep managers focused on the highest-value actions.

## Inputs

- KPI thresholds.
- Scores.
- Dispositions.
- Import and validation results.
- Vendor, campaign, and file performance.
- Agent performance.
- Recording and QA flags.
- Business outcomes.
- Rule sets.

## Outputs

- Alert records.
- Severity labels.
- Owners.
- Escalation status.
- Linked recommendations.
- Auto-close events.
- Audit records.

## KPIs

- Open alerts.
- Critical alerts.
- Average acknowledgement time.
- Average close time.
- Repeat alert count.
- Alerts by owner.
- Alerts by module.
- Alerts converted to recommendations.

## Rules

- Alerts must have a clear owner.
- Alerts must show the trigger condition.
- Alerts must include supporting metrics.
- Critical alerts should appear in Attention Required.
- Repeated alerts should escalate.
- Alerts should auto-close only when the underlying condition is resolved.

## Alert Types

### Vendor Alerts

Triggers:

- Invalid rate exceeds threshold.
- Duplicate rate exceeds threshold.
- DNC, wrong-number, or disconnected spike.
- Vendor Score drops below threshold.
- ROI turns negative.

Owner:

- Operations Manager.

Examples:

```text
Alert: Vendor B invalid rate high.
Trigger: invalid_rate 31% > threshold 15%.
Severity: High.
Owner: Operations Manager.
```

### Campaign Alerts

Triggers:

- Campaign Health Score drops.
- Transfer rate declines.
- Cancellation rate increases.
- Complaint rate exceeds threshold.
- Active inventory falls below required level.

Owner:

- Operations Manager or Executive.

### File Alerts

Triggers:

- File Quality Score below threshold.
- Attempt exhaustion.
- High invalid/disconnected rate.
- High DNC/wrong-number rate.
- Poor ROI.
- Retirement criteria met.

Owner:

- Data Admin or Operations Manager.

### Agent Alerts

Triggers:

- Agent Productivity Score below team average.
- Agent Quality Score below team average.
- High idle or break percentage.
- High generic disposition usage.
- Suspicious short-call outcomes.
- QA fail pattern.

Owner:

- Team Manager or QA Manager.

### Disposition Alerts

Triggers:

- `Not Interested` overuse.
- `Callback` overuse.
- `Other` overuse.
- DNC spike.
- Wrong-number spike.
- Disconnected spike.
- Agent disposition variance.

Owner:

- Operations Manager or QA Manager.

### QA Alerts

Triggers:

- Repeat complaints.
- Short high-value calls.
- Long low-quality calls.
- Cancellation after transfer.
- Recording review fail.
- Agent anomaly pattern.

Owner:

- QA Manager.

### Re-Churn Alerts

Triggers:

- High-priority re-churn candidates available.
- Attempt limits exceeded.
- Re-churn inventory blocked by missing rule.
- Suppressed leads found in candidate pool.

Owner:

- Operations Manager.

### Business Risk Alerts

Triggers:

- Business Health Score below threshold.
- ROI decline.
- Cancellation spike.
- Revenue drop.
- High-severity recommendations remain open.
- Critical compliance risk.

Owner:

- Executive.

## Severity

Info:

- Useful information, no immediate action required.

Low:

- Monitor condition; action may be needed later.

Medium:

- Management review needed during normal operating rhythm.

High:

- Action needed today.

Critical:

- Immediate escalation required.

## Escalation Rules

```text
IF alert severity = Critical
THEN show in Attention Required
AND notify action owner
AND create audit event
```

```text
IF High alert remains open beyond SLA
THEN escalate to next owner
```

```text
IF same alert repeats 3 times in review period
THEN increase severity by one level
```

```text
IF compliance-related alert occurs
THEN escalate immediately regardless of normal severity
```

## Owners

Common owners:

- Executive.
- Operations Manager.
- Team Manager.
- QA Manager.
- Data Admin.
- Finance or Business Review Owner.

Owner rules:

- Vendor and file alerts go to Operations Manager or Data Admin.
- Agent alerts go to Team Manager.
- QA alerts go to QA Manager.
- Business risk alerts go to Executive.
- Compliance alerts go to Executive and Operations Manager.

## Auto-Close Rules

Alerts may auto-close when:

- Metric returns below threshold for required review period.
- File is retired.
- Vendor is paused or stopped.
- Recommendation is accepted and completed.
- QA escalation is reviewed and closed.
- Duplicate alert is merged into parent alert.

Alerts should not auto-close when:

- Condition is unresolved.
- Owner has not acknowledged a critical alert.
- Compliance risk remains.
- Data is missing.

## Examples

Example 1:

```text
type: Vendor Alert
trigger: invalid_rate 29% > 15% threshold
severity: High
owner: Operations Manager
recommendation: Pause vendor intake pending review
auto_close: invalid_rate below threshold for 3 consecutive review periods
```

Example 2:

```text
type: QA Alert
trigger: Agent has 14 short-call transfers in one day
severity: Critical
owner: QA Manager
recommendation: Review recordings and agent disposition pattern
auto_close: QA review completed and finding resolved
```

Example 3:

```text
type: Re-Churn Alert
trigger: 8,400 eligible leads available with score above 80
severity: Medium
owner: Operations Manager
recommendation: Approve re-churn window for top campaigns
auto_close: re-churn batch approved or candidate pool expires
```

## Related Modules

- Recommendation Rules.
- Dashboard Specifications.
- Report Catalog.
- Business Rules.
- Formulas and Scoring.
- Data Dictionary.

## Future Improvements

- Add alert notification preferences.
- Add SLA tracking by owner.
- Add alert grouping.
- Add alert suppression windows.
- Add manager comments.
- Add alert-to-recommendation impact tracking.

