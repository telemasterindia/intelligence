# Recommendation Rules

## Purpose

This document defines IF/THEN logic for TIP recommendations. Recommendations should help TeleMaster India managers decide what to buy, pause, retire, coach, review, re-churn, or escalate.

TIP is not a CRM, dialer, or agent workspace. Recommendations should remain management-decision focused.

## Business Value

Recommendation rules help management:

- Act faster on risk.
- Standardize decisions.
- Explain why TIP recommends an action.
- Reduce wasted spend and calling effort.
- Improve data quality, campaign health, QA, and ROI.

## Inputs

- Scores and KPIs.
- Vendor, campaign, file, agent, disposition, and QA data.
- Lead inventory and re-churn eligibility.
- Alerts and audit history.
- Capacity and staffing metrics.
- Business rules and thresholds.

## Outputs

- Recommendation records.
- Supporting metrics.
- Confidence score.
- Expected impact.
- Priority.
- Action owner.

## KPIs

- Recommendation acceptance rate.
- Recommendation closure time.
- Expected impact versus actual impact.
- Open high-priority recommendations.
- Repeat recommendation count.
- Confidence score accuracy.

## Rules

Every recommendation must include:

- Recommendation.
- Reason.
- Supporting metrics.
- Confidence score.
- Expected impact.
- Priority.
- Action owner.

### Vendor Recommendations

```text
IF vendor_score >= 85
AND ROI is positive
AND invalid_rate is below threshold
THEN recommend Buy More
```

```text
IF vendor_score between 55 and 69
OR quality trend declines for 3 review periods
THEN recommend Reduce
```

```text
IF invalid_rate exceeds threshold
OR disconnected_rate exceeds threshold
OR DNC/wrong-number rate spikes
THEN recommend Pause Vendor
```

```text
IF vendor_score < 40
AND poor ROI repeats across campaigns
THEN recommend Stop Vendor
```

### Campaign Recommendations

```text
IF campaign_health_score >= 80
AND capacity is available
THEN recommend Increase Priority
```

```text
IF campaign_health_score between 50 and 64
THEN recommend Management Review
```

```text
IF cancellation_rate exceeds baseline
OR complaint_rate exceeds threshold
THEN recommend QA and Business Review
```

```text
IF transfer_rate declines
AND connect_rate remains stable
THEN recommend agent coaching or disposition audit
```

### File Recommendations

```text
IF file_quality_score < 40
AND attempts are sufficient
THEN recommend Retire File
```

```text
IF file has high invalid_rate
OR high disconnected_rate
THEN recommend Vendor File Review
```

```text
IF file connect_rate is acceptable
AND qualified_rate is acceptable
AND eligible dispositions remain
THEN recommend Re-Churn File
```

```text
IF attempt_limit reached
AND ROI is poor
THEN recommend End File Calling Effort
```

### Agent Recommendations

```text
IF agent_productivity_score is 20% below team average
THEN recommend Productivity Coaching
```

```text
IF agent_quality_score is 20% below team average
THEN recommend Quality Coaching
```

```text
IF agent disposition variance is abnormal
AND generic disposition overuse is high
THEN recommend Disposition Audit
```

```text
IF short-call high-value outcomes repeat
THEN recommend Recording QA Review
```

### Disposition Recommendations

```text
IF Not Interested rate is 50% above campaign average
THEN recommend disposition review
```

```text
IF Callback rate is high
AND callback completion is low
THEN recommend callback process review
```

```text
IF Other usage is high
THEN recommend disposition list cleanup or agent coaching
```

```text
IF DNC, Wrong Number, or Disconnected spikes by file
THEN recommend file and vendor review
```

### QA Recommendations

```text
IF recording has high-value transfer
AND agent pattern is unusual
THEN recommend QA review
```

```text
IF complaint repeats by agent, campaign, or vendor
THEN recommend QA escalation
```

```text
IF cancellation follows high-value transfer repeatedly
THEN recommend QA and business outcome review
```

### Re-Churn Recommendations

```text
IF re_churn_score >= 80
AND no suppression exists
AND best calling window is available
THEN recommend High-Priority Re-Churn
```

```text
IF re_churn_score between 40 and 59
THEN recommend Manager Review
```

```text
IF attempt_limit exceeded
OR suppression exists
THEN recommend Do Not Re-Churn
```

### Lead Inventory Recommendations

```text
IF active callable inventory is below operating threshold
THEN recommend new file intake or re-churn review
```

```text
IF inventory is high
AND file quality is declining
THEN recommend prioritize best files and retire weak files
```

### Capacity Recommendations

```text
IF agent capacity is available
AND high-scoring campaign inventory exists
THEN recommend increase campaign priority
```

```text
IF agent capacity is limited
AND low-quality files are active
THEN recommend deprioritize low-quality files
```

### Business Risk Recommendations

```text
IF complaint_rate exceeds threshold
OR DNC handling anomaly exists
THEN recommend immediate management escalation
```

```text
IF cancellation_rate increases after sales
THEN recommend source and QA review
```

```text
IF ROI is negative across vendor and campaign
THEN recommend pause spend and review business assumptions
```

## Examples

Example:

```text
recommendation: Pause Vendor C.
reason: Invalid rate is 31% and wrong-number rate is 18%, both above campaign thresholds.
supporting_metrics: vendor_score 42; file_quality_score 38; campaign wrong-number average 7%.
confidence_score: 91.
expected_impact: Reduce wasted calling effort and prevent poor-quality inventory from entering active campaigns.
priority: High.
action_owner: Operations Manager.
```

## Related Modules

- Formulas and Scoring.
- Business Rules.
- Alert Engine.
- Dashboard Specifications.
- Report Catalog.

## Future Improvements

- Add recommendation simulation.
- Add manager feedback loop.
- Add impact tracking after recommendation closure.
- Add rule version comparison.
- Add seasonal or campaign-specific thresholds.

