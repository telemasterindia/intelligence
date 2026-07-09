# KPI and Decision Engine

TIP should operate as a management-level Operations Intelligence Platform. This document defines how TIP should turn agent activity, dispositions, files, vendors, recordings, and business outcomes into management decisions.

TIP is not a CRM and should not become an agent dialing workspace. TIP exists to help managers decide what needs attention, what should be changed, what should be paused, and where the business has opportunity or risk.

## Executive Command Center

Every management dashboard should begin with the same decision-first structure:

- Attention Required: urgent issues that need manager review today.
- Today's Decisions: concrete decisions that should be made before the day ends.
- TIP Recommendations: system-generated recommendations with evidence.
- Risks: operational, vendor, file, compliance, agent, and ROI concerns.
- Opportunities: places where more calling, more budget, better timing, or better coaching may improve results.

The command center should not open with vanity metrics. It should open with decisions.

Examples:

- Vendor A has a 41% invalid rate this week. Recommendation: pause new purchases until reviewed.
- Campaign B has a transfer rate 28% below team average. Recommendation: audit dispositions and call recordings.
- File C has exceeded attempt limits with low connect rate. Recommendation: retire file.
- Agent D is 32% below team qualified rate and overuses `Not Interested`. Recommendation: coaching review.

## Agent Performance Scoring

Agent scoring should compare each agent against the team average for the same campaign, daypart, and date range where possible. An agent should not be judged only against a global average when campaign mix or file quality is different.

### Core Metrics and Formulas

Calls per hour:

```text
calls_per_hour = total_calls / logged_in_hours
```

Connect rate:

```text
connect_rate = connected_calls / total_calls
```

Qualified rate:

```text
qualified_rate = qualified_calls / connected_calls
```

Transfer rate:

```text
transfer_rate = transferred_calls / connected_calls
```

Occupancy:

```text
occupancy = (talk_time + hold_time + wrap_up_time + acw_time) / logged_in_time
```

Idle percentage:

```text
idle_percent = idle_time / logged_in_time
```

Break percentage:

```text
break_percent = break_time / logged_in_time
```

Average wrap-up time:

```text
avg_wrap_up_time = total_wrap_up_time / completed_calls
```

Average ACW or disposition time:

```text
avg_acw_time = total_acw_time / completed_calls
```

Manual dialing percentage:

```text
manual_dialing_percent = manual_dialed_calls / total_calls
```

Disposition quality score:

```text
disposition_quality_score =
  weighted_valid_disposition_rate
  - suspicious_pattern_penalty
  - overused_generic_disposition_penalty
  - mismatch_penalty
```

Where:

- `weighted_valid_disposition_rate` rewards specific, believable outcomes.
- `suspicious_pattern_penalty` penalizes repeated patterns that are unlikely for the campaign.
- `overused_generic_disposition_penalty` penalizes excessive `Other`, `Callback`, or `Not Interested`.
- `mismatch_penalty` penalizes dispositions that conflict with call duration, recording quality, or downstream outcome.

### Team Average Comparison

For every metric, TIP should calculate:

```text
agent_vs_team_delta = agent_metric - team_average_metric
agent_vs_team_percent = (agent_metric - team_average_metric) / team_average_metric
```

Example:

```text
agent_transfer_rate = 12%
team_transfer_rate = 18%
agent_vs_team_percent = (12% - 18%) / 18% = -33.3%
```

TIP should label performance using practical bands:

- Strong: 10% or more above team average on positive metrics.
- Normal: within 10% of team average.
- Watch: 10% to 20% below team average.
- Coaching Needed: more than 20% below team average.
- Critical Review: more than 30% below team average or repeated severe variance.

For negative metrics such as idle percent, break percent, invalid dispositions, or excessive ACW, the direction is reversed.

### Underperformance and Coaching Flags

TIP should flag coaching needs when an agent shows one or more of these patterns:

- Connect rate is materially below team average on similar files.
- Qualified rate is below team average while connect rate is normal.
- Transfer rate is below team average while qualified rate is normal.
- Idle percent is high compared with team average.
- Break percent is high compared with schedule or team average.
- Wrap-up or ACW time is high without better quality outcomes.
- Manual dialing percent is high when automated dialing should dominate.
- Disposition quality score is below acceptable threshold.
- Agent overuses generic dispositions.
- Call recordings show short-call or low-quality outcome patterns.

The coaching flag should include the exact reason, supporting metrics, comparison group, and recommended manager action.

## Disposition Intelligence

Disposition Intelligence evaluates whether outcomes are believable, useful, and consistent with campaign behavior.

### Campaign Disposition Average

For each campaign, TIP should calculate the average distribution of dispositions:

```text
campaign_disposition_average =
  disposition_count_for_campaign / total_dispositions_for_campaign
```

Example:

```text
Not Interested = 22%
Callback = 8%
Disconnected = 11%
DNC = 3%
Wrong Number = 5%
Qualified = 14%
Transferred = 9%
```

This becomes the baseline for agent variance, file quality review, and suspicious pattern detection.

### Agent Disposition Variance

TIP should compare each agent against the campaign disposition average:

```text
agent_disposition_variance =
  agent_disposition_percent - campaign_disposition_average
```

High variance should be flagged when:

- The agent is consistently outside expected range.
- The variance affects business outcomes.
- The variance repeats across multiple days or files.
- The variance is concentrated in vague or low-value dispositions.

### Suspicious Disposition Patterns

TIP should flag patterns such as:

- Same disposition repeated unusually often in a short period.
- Very short calls marked with high-value or complex dispositions.
- Long calls marked with vague dispositions.
- Large number of `Other` outcomes.
- Callback rate much higher than campaign average.
- Not Interested rate much higher than campaign average.
- Disconnected, DNC, or Wrong Number spikes tied to one file or vendor.
- Agent disposition mix sharply different from peers on the same campaign.

### Disconnected, DNC, and Wrong Number Spikes

TIP should monitor spikes by vendor, file, campaign, and agent:

```text
spike_delta = current_rate - baseline_rate
spike_percent = (current_rate - baseline_rate) / baseline_rate
```

Flag severity:

- Watch: 25% above baseline.
- Review: 50% above baseline.
- Critical: 100% above baseline or high business impact.

### Overuse of Generic Dispositions

Generic dispositions should be monitored carefully:

- `Not Interested`
- `Callback`
- `Other`
- `No Answer`
- `Unable to Reach`

Overuse should be flagged when an agent, file, or campaign exceeds the normal range without supporting evidence.

### Disposition Quality Score

Disposition quality should combine specificity, consistency, and downstream usefulness:

```text
disposition_quality_score =
  (specific_disposition_rate * 0.35)
  + (duration_consistency_score * 0.20)
  + (peer_consistency_score * 0.20)
  + (downstream_outcome_alignment * 0.15)
  + (manager_audit_pass_rate * 0.10)
  - generic_overuse_penalty
  - anomaly_penalty
```

The score should help managers decide whether to coach an agent, audit recordings, adjust disposition options, or review a vendor file.

## Re-Churn Intelligence

Re-churn Intelligence decides which historical leads or files deserve another calling attempt and which should be left alone.

### Files That Should Be Re-Run

A file may qualify for re-churn when:

- It has acceptable historical connect rate.
- It has acceptable qualified or transfer rate.
- It contains dispositions that are still actionable.
- Enough time has passed since the last attempt.
- It did not exceed attempt limits.
- It has positive ROI or strong downstream indicators.
- It performs better in specific calling windows.

### Dispositions That Qualify for Re-Churn

Potential re-churn dispositions:

- No Answer.
- Busy.
- Callback.
- Voicemail.
- Not Reached.
- Interested Later.
- Incomplete Contact.
- Transfer Failed, if not disqualified by later outcome.

These should be configurable by campaign and business rule.

### Leads That Should Never Be Called Again

TIP should exclude leads from re-churn when they have:

- DNC.
- Wrong Number.
- Disconnected.
- Complaint.
- Compliance block.
- Explicit refusal requiring suppression.
- Sale already completed, unless a separate approved campaign allows follow-up.
- Cancellation outcome that business rules exclude.
- Attempt limit exceeded.

### Attempt Limits

Attempt limits should be configurable by campaign, vendor, disposition, and time window.

Example defaults:

- No Answer: 3 to 6 attempts.
- Busy: 3 to 5 attempts.
- Callback: based on callback date plus campaign rules.
- Voicemail: 2 to 4 attempts.
- Not Interested: 0 to 1 future attempts depending on campaign rules.
- DNC, Wrong Number, Complaint, Disconnected: 0 future attempts.

### Time Gap Before Re-Churn

TIP should enforce a minimum time gap before a lead returns to a calling pool:

- No Answer: 24 to 72 hours.
- Busy: 4 to 24 hours.
- Callback: scheduled callback time.
- Voicemail: 48 to 96 hours.
- Not Interested: 30 to 90 days only if allowed.
- Old qualified but unsold lead: campaign-specific review.

### Best Calling Window

Best calling window should be calculated from historical connect and qualified rates:

```text
calling_window_score =
  (connect_rate * 0.35)
  + (qualified_rate * 0.30)
  + (transfer_rate * 0.20)
  + (low_complaint_rate_score * 0.10)
  + (agent_availability_score * 0.05)
```

TIP should calculate best windows by:

- State.
- ZIP.
- Area code.
- Campaign.
- Vendor.
- Disposition history.
- Day of week.
- Hour of day.

### Rechurn Priority Score

```text
rechurn_priority_score =
  (historical_connect_score * 0.25)
  + (historical_qualified_score * 0.25)
  + (recency_score * 0.15)
  + (best_calling_window_score * 0.15)
  + (vendor_quality_score * 0.10)
  + (campaign_fit_score * 0.10)
  - attempt_penalty
  - risk_penalty
```

Priority bands:

- 80 to 100: high priority re-churn.
- 60 to 79: normal re-churn.
- 40 to 59: manager review.
- Below 40: do not re-churn unless approved.

## File End-of-Life Rules

TIP should recommend retiring a file when the file no longer produces enough value to justify continued calling.

### Retirement Signals

Low connect rate:

```text
file_connect_rate < campaign_connect_rate_threshold
```

High invalid or disconnected rate:

```text
invalid_disconnected_rate = (invalid_count + disconnected_count) / total_records
```

High DNC or wrong number rate:

```text
dnc_wrong_number_rate = (dnc_count + wrong_number_count) / total_records
```

Too many attempts:

```text
avg_attempts_per_callable_lead > campaign_attempt_limit
```

Low qualification rate:

```text
file_qualified_rate < campaign_qualified_rate_threshold
```

Poor ROI:

```text
file_roi = revenue_attributed_to_file - file_cost - operating_cost
```

### File Retirement Recommendation

TIP should recommend:

- Continue: file is still performing.
- Reduce Priority: file is usable but lower value.
- Re-Churn Later: file may perform after a time gap or better window.
- Manager Review: mixed signals require human decision.
- Retire: file should stop receiving calling effort.

Retirement should be based on business rules, not one bad metric alone, unless the metric is compliance-related.

## Vendor Intelligence

Vendor Intelligence helps management decide whether to buy more, reduce spend, pause, or stop purchasing from a vendor.

### Vendor Quality Score

```text
vendor_quality_score =
  (valid_record_rate * 0.20)
  + (unique_record_rate * 0.15)
  + (connect_rate * 0.20)
  + (qualified_rate * 0.20)
  + (transfer_rate * 0.10)
  + (low_cancellation_rate_score * 0.10)
  + (roi_score * 0.05)
```

### Vendor Metrics

Duplicate percentage:

```text
duplicate_percent = duplicate_records / total_records_received
```

Invalid percentage:

```text
invalid_percent = invalid_records / total_records_received
```

Connect percentage:

```text
connect_percent = connected_calls / callable_records
```

Qualified percentage:

```text
qualified_percent = qualified_calls / connected_calls
```

Transfer percentage:

```text
transfer_percent = transferred_calls / connected_calls
```

Cancellation percentage:

```text
cancellation_percent = cancelled_sales / total_sales
```

Cost per qualified lead:

```text
cost_per_qualified_lead = vendor_spend / qualified_leads
```

### Vendor Recommendation

TIP should recommend:

- Buy More: high quality, strong ROI, stable cancellation rate, low invalid and duplicate rates.
- Reduce: acceptable performance but declining quality, rising costs, or limited capacity.
- Pause: sharp decline, suspicious file quality, or unresolved operational concern.
- Stop: consistently poor ROI, high invalid rates, high DNC or wrong number rates, or compliance risk.

Every vendor recommendation should include date range, compared campaigns, sample size, and confidence score.

## Recording and QA Intelligence

TIP should flag recordings for management review. The goal is not to monitor every call manually; the goal is to identify calls that likely explain risk, coaching needs, or high-value outcomes.

### Recordings to Flag

Very short calls:

- Connected call is too short for the selected disposition.
- High-value disposition on a very short call.
- Repeated short connected calls by one agent.

Very long calls:

- Long call with no qualified or transfer outcome.
- Long wrap-up or ACW after long call.
- Long call followed by complaint, cancellation, or poor outcome.

High-value transfers:

- Transfers tied to strong revenue.
- Transfers from agents with unusual success.
- Transfers from files or vendors under review.

Unusual dispositions:

- Disposition does not match call duration.
- Rare disposition appears repeatedly.
- High `Other` usage.
- High `Callback` usage without follow-through.

Agent pattern anomalies:

- Agent differs sharply from peers on the same campaign.
- Agent has repeated low-quality outcomes.
- Agent has high idle or ACW with low transfer rate.
- Agent has abnormal manual dialing percentage.

Repeat complaints:

- Multiple complaints tied to one agent, campaign, file, vendor, or geography.
- Complaint following prior DNC or refusal history.

Low-quality outcomes:

- Transfer cancelled quickly.
- Qualified lead rejected downstream.
- Sale cancelled.
- Manager audit fails disposition accuracy.

### QA Review Priority

```text
qa_review_priority =
  (business_value_score * 0.25)
  + (risk_score * 0.25)
  + (agent_anomaly_score * 0.20)
  + (disposition_anomaly_score * 0.15)
  + (vendor_or_file_review_score * 0.15)
```

QA flags should help managers choose which recordings to review first.

## Recommendation Format

Every TIP recommendation must follow a consistent format.

```text
recommendation: Clear action TIP recommends.
reason: Plain-English explanation.
supporting_metrics: Specific metrics and comparison baselines.
confidence_score: 0 to 100 score based on sample size, consistency, and data quality.
expected_impact: Practical expected business effect.
priority: Low, Medium, High, or Critical.
action_owner: Manager, Operations, QA, Data Admin, or Executive.
```

Example:

```text
recommendation: Pause Vendor A for new purchases.
reason: Vendor A's invalid rate and disconnected rate both doubled over the last 7 days.
supporting_metrics: invalid 38% vs vendor baseline 17%; disconnected 21% vs campaign average 9%; qualified rate 6% vs campaign average 14%.
confidence_score: 86
expected_impact: Reduce wasted calling time and prevent low-quality files from entering active campaigns.
priority: High
action_owner: Operations Manager
```

## Management Decision Rules

TIP should prioritize recommendations that are:

- Actionable today.
- Supported by clear metrics.
- Compared against fair baselines.
- Tied to business cost, quality, risk, or opportunity.
- Explainable to a manager without technical investigation.

TIP should avoid recommendations that are:

- Based on tiny sample sizes without warning.
- Based on one metric without context.
- Written like generic analytics commentary.
- Dependent on agent-facing workflow changes.
- Impossible for a manager to act on.

## Decision Engine Confidence

Confidence should increase when:

- Sample size is large.
- Pattern repeats across multiple days.
- Pattern appears across multiple files or campaigns.
- Data quality is strong.
- Supporting metrics agree with each other.

Confidence should decrease when:

- Sample size is small.
- Data is missing or inconsistent.
- Pattern appears only once.
- Campaign mix changed.
- Vendor file quality changed suddenly.
- Business rules are newly configured or untested.

```text
confidence_score =
  sample_size_score
  + consistency_score
  + data_quality_score
  + baseline_fit_score
  - volatility_penalty
  - missing_data_penalty
```

