# Formulas and Scoring

## Purpose

This document defines the main scoring formulas TIP uses to convert operational data into management decisions. Scores should help TeleMaster India compare vendors, campaigns, files, agents, lead pools, geographies, and overall business health using consistent logic.

TIP is not a CRM, dialer, or agent workspace. These formulas are for management intelligence, review, prioritization, and decision support.

## Business Value

Scoring gives managers a common language for decisions:

- Which vendor should receive more budget?
- Which campaign needs attention today?
- Which file should be retired?
- Which agent needs coaching?
- Which ZIP, state, or lead group should be prioritized?
- Which risks need escalation before they become expensive?

Scores should never replace judgment. They should explain what is happening, why it matters, and where a manager should act.

## Inputs

- Lead records and lead identity history.
- Vendor and campaign metadata.
- Import batch and file quality data.
- Dispositions and call outcomes.
- Agent productivity and quality metrics.
- Recording and QA review results.
- ZIP, state, area-code, and time-window performance.
- Cost, revenue, sale, and cancellation data.
- Rule sets and thresholds.

## Outputs

- Vendor Score.
- Campaign Health Score.
- Agent Productivity Score.
- Agent Quality Score.
- File Quality Score.
- Lead Quality Score.
- Re-Churn Score.
- ZIP Score.
- State Score.
- Business Health Score.
- Management recommendation inputs.

## KPIs

- Connect rate.
- Qualified rate.
- Transfer rate.
- Sale rate.
- Cancellation rate.
- Duplicate percentage.
- Invalid percentage.
- DNC percentage.
- Wrong number percentage.
- Disconnected percentage.
- Cost per qualified lead.
- Cost per transfer.
- Revenue per lead.
- ROI.
- Agent occupancy.
- Idle percentage.
- Break percentage.
- Wrap-up and ACW time.
- Disposition quality score.
- QA pass rate.

## Rules

All scoring rules should follow these principles:

- Use a 0 to 100 scale unless a document states otherwise.
- Compare against fair baselines such as campaign average, vendor history, or same-day team average.
- Include sample-size warnings when volume is too low.
- Penalize compliance risk heavily.
- Separate data quality, operational performance, and financial performance.
- Store score version and rule version for auditability.
- Show component scores so managers can understand the result.

## Vendor Score

Purpose: decide whether to buy more, reduce spend, pause, or stop a vendor.

```text
vendor_score =
  (valid_record_rate * 20)
  + (unique_record_rate * 15)
  + (connect_rate * 20)
  + (qualified_rate * 15)
  + (transfer_rate * 10)
  + (low_cancellation_score * 10)
  + (roi_score * 10)
  - compliance_penalty
```

Score interpretation:

- 85 to 100: buy more if capacity exists.
- 70 to 84: continue and monitor.
- 55 to 69: reduce or review.
- 40 to 54: pause pending review.
- Below 40: stop unless management approves exception.

Example:

```text
Vendor A:
valid_record_rate = 82
unique_record_rate = 76
connect_rate = 61
qualified_rate = 44
transfer_rate = 31
low_cancellation_score = 78
roi_score = 70
compliance_penalty = 0
vendor_score = 65.75
Decision: reduce or review.
```

## Campaign Health Score

Purpose: identify campaigns that are healthy, declining, risky, or ready for more volume.

```text
campaign_health_score =
  (connect_rate_score * 20)
  + (qualified_rate_score * 20)
  + (transfer_rate_score * 15)
  + (sale_rate_score * 15)
  + (low_cancellation_score * 10)
  + (file_quality_score * 10)
  + (agent_execution_score * 10)
  - risk_penalty
```

Campaign health bands:

- 80 to 100: healthy.
- 65 to 79: stable.
- 50 to 64: watch.
- 35 to 49: management review.
- Below 35: critical.

Rules:

- A campaign with high DNC, complaint, or wrong-number risk cannot be marked healthy.
- A campaign with low sample size should be marked `insufficient data`.
- Campaigns should be compared to their own historical average and current business target.

## Agent Productivity Score

Purpose: compare agent activity against the team average for management coaching and staffing decisions.

```text
agent_productivity_score =
  (calls_per_hour_score * 20)
  + (occupancy_score * 20)
  + (connect_rate_score * 15)
  + (idle_score * 15)
  + (break_adherence_score * 10)
  + (wrap_up_efficiency_score * 10)
  + (manual_dialing_control_score * 10)
```

Key formulas:

```text
calls_per_hour = total_calls / logged_in_hours
occupancy = (talk_time + hold_time + wrap_up_time + acw_time) / logged_in_time
idle_percent = idle_time / logged_in_time
break_percent = break_time / logged_in_time
manual_dialing_percent = manual_dialed_calls / total_calls
```

Rules:

- Compare against same campaign or similar file quality when possible.
- High calls per hour should not compensate for poor quality.
- High occupancy with poor transfers may indicate inefficient conversations.
- High idle or break percentage should flag review, not automatic blame.

## Agent Quality Score

Purpose: evaluate whether an agent's outcomes and dispositions are reliable.

```text
agent_quality_score =
  (qualified_rate_score * 20)
  + (transfer_rate_score * 20)
  + (disposition_quality_score * 20)
  + (qa_pass_rate_score * 20)
  + (low_complaint_score * 10)
  + (recording_review_score * 10)
```

Disposition quality:

```text
disposition_quality_score =
  (specific_disposition_rate * 35)
  + (duration_consistency_score * 20)
  + (peer_consistency_score * 20)
  + (downstream_alignment_score * 15)
  + (audit_pass_score * 10)
  - generic_overuse_penalty
  - anomaly_penalty
```

Rules:

- Low quality score should create coaching recommendation.
- Repeated suspicious dispositions should create QA review recommendation.
- Quality score should be reviewed with recordings and campaign context.

## File Quality Score

Purpose: decide whether a lead file should continue, be deprioritized, re-churned later, or retired.

```text
file_quality_score =
  (valid_rate * 20)
  + (unique_rate * 15)
  + (connect_rate * 20)
  + (qualified_rate * 20)
  + (transfer_rate * 10)
  + (low_dnc_wrong_number_score * 10)
  + (roi_score * 5)
```

Penalty conditions:

- High disconnected rate.
- High DNC rate.
- High wrong-number rate.
- Excessive attempts.
- Poor ROI.
- Low qualification after enough attempts.

Rules:

- Files with compliance risk should be escalated before normal scoring.
- Files should be compared against vendor average and campaign average.
- End-of-life decisions should include attempt count and time since import.

## Lead Quality Score

Purpose: prioritize individual leads or lead groups for management-approved calling plans.

```text
lead_quality_score =
  (identity_validity_score * 20)
  + (source_vendor_score * 15)
  + (campaign_fit_score * 15)
  + (geography_score * 15)
  + (historical_outcome_score * 15)
  + (recency_score * 10)
  + (best_calling_window_score * 10)
  - suppression_penalty
```

Rules:

- DNC, wrong number, complaint, disconnected, or suppression should force score to zero.
- Prior sale or cancellation should follow campaign-specific rules.
- Attempt limits must be respected before scoring.

Lead scoring belongs in this document. [Decision Engine](24_DECISION_ENGINE.md) decides how management should act on the score, while Data Intelligence owns source data quality and identity resolution.

## Re-Churn Score

Purpose: decide which older leads or files should be re-run.

```text
re_churn_score =
  (historical_connect_score * 25)
  + (historical_qualified_score * 20)
  + (disposition_eligibility_score * 15)
  + (time_gap_score * 15)
  + (best_calling_window_score * 10)
  + (vendor_score * 10)
  + (campaign_fit_score * 5)
  - attempt_penalty
  - risk_penalty
```

Bands:

- 80 to 100: high-priority re-churn.
- 60 to 79: normal re-churn.
- 40 to 59: manager review.
- Below 40: do not re-churn.

## ZIP Score

Purpose: identify geography-level lead performance.

```text
zip_score =
  (connect_rate_score * 20)
  + (qualified_rate_score * 20)
  + (transfer_rate_score * 15)
  + (sale_rate_score * 15)
  + (low_cancellation_score * 10)
  + (vendor_mix_score * 10)
  + (calling_window_score * 10)
```

Rules:

- Low-volume ZIPs should show a sample-size warning.
- ZIP performance should be campaign-specific where possible.
- ZIP score should not override DNC or compliance rules.

## State Score

Purpose: compare state-level performance for management planning.

```text
state_score =
  (connect_rate_score * 15)
  + (qualified_rate_score * 20)
  + (transfer_rate_score * 15)
  + (sale_rate_score * 15)
  + (revenue_score * 15)
  + (low_cancellation_score * 10)
  + (capacity_fit_score * 10)
```

Rules:

- State score should support budget, staffing, and campaign timing decisions.
- State score should include cancellation risk, not just front-end performance.

## Business Health Score

Purpose: summarize overall operating health for executives.

```text
business_health_score =
  (campaign_health_average * 20)
  + (vendor_score_average * 15)
  + (file_quality_average * 15)
  + (agent_productivity_average * 10)
  + (agent_quality_average * 10)
  + (revenue_score * 15)
  + (low_risk_score * 10)
  + (data_freshness_score * 5)
```

Business health bands:

- 85 to 100: strong.
- 70 to 84: stable.
- 55 to 69: watch.
- 40 to 54: management intervention needed.
- Below 40: critical review.

## Examples

Example management summary:

```text
Campaign Health Score: 58
Primary issue: qualified rate down 22% from campaign average.
Supporting signals: Vendor B invalid rate increased, Agent Group 2 transfer rate declined, ZIP 331xx underperforming.
Recommendation: pause Vendor B file intake, review Agent Group 2 dispositions, reduce priority for ZIP 331xx until next review.
```

## Related Modules

- Data Intelligence.
- Operations Intelligence.
- Business Intelligence.
- Recommendation Engine.
- Alert Engine.
- Report Catalog.
- QA Intelligence.

## Future Improvements

- Add score version history.
- Add manager override notes.
- Add confidence scoring per formula.
- Add segment-specific weighting by campaign type.
- Add anomaly detection after enough history exists.
- Add trend charts for each component score.
