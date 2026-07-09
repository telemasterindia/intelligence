# Decision Engine

## Purpose

This document explains how TIP thinks. The Decision Engine converts evidence, KPIs, formulas, thresholds, confidence, risk, and business impact into management decisions for TeleMaster India.

TIP is not a CRM, dialer, or agent workspace. It is an internal Operations Intelligence Platform for management decisions.

## Decision Standard

Every TIP decision should include:

- Business Problem.
- Evidence.
- KPIs Used.
- Formula.
- Thresholds.
- Decision Logic.
- Confidence.
- Risk.
- Business Impact.
- Escalation.
- Example.

The Decision Engine uses [Formulas and Scoring](16_FORMULAS_AND_SCORING.md), [Business Rules](17_BUSINESS_RULES.md), [Recommendation Rules](20_RECOMMENDATION_RULES.md), [Alert Engine](23_ALERT_ENGINE.md), and [Predictive Intelligence](08_Predictive_Intelligence.md). It does not replace those documents; it explains how their outputs become management decisions.

## Confidence Model

```text
decision_confidence =
  sample_size_score
  + consistency_score
  + data_quality_score
  + baseline_fit_score
  + rule_maturity_score
  - volatility_penalty
  - missing_data_penalty
```

Confidence bands:

- 85 to 100: strong evidence.
- 70 to 84: reliable evidence.
- 55 to 69: usable but review context.
- 40 to 54: manager review required.
- Below 40: insufficient confidence.

## Vendor Decisions

Business Problem:

- Management needs to decide whether to buy more leads, reduce spend, pause intake, or stop a vendor.

Evidence:

- Vendor Score, invalid percentage, duplicate percentage, connect percentage, qualified percentage, transfer percentage, cancellation percentage, ROI, DNC and wrong-number rates.

KPIs Used:

- Vendor Score.
- Cost per qualified lead.
- Cost per transfer.
- ROI.
- Invalid rate.
- Duplicate rate.
- DNC/wrong-number rate.

Formula:

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

Thresholds:

- 85 to 100: buy more.
- 70 to 84: continue.
- 55 to 69: reduce or review.
- 40 to 54: pause.
- Below 40: stop unless approved exception.

Decision Logic:

```text
IF vendor_score >= 85 AND ROI positive AND compliance risk low
THEN recommend Buy More.

IF vendor_score < 55 OR invalid/DNC/wrong-number risk is high
THEN recommend Pause or Stop.
```

Confidence:

- Higher when multiple files and campaigns show the same trend.
- Lower when sample size is small or campaign mix changed.

Risk:

- Poor vendor decisions waste agent time, increase compliance risk, and reduce campaign quality.

Business Impact:

- Better purchasing, lower invalid inventory, fewer wasted calls, better ROI.

Escalation:

- Critical vendor risk goes to Operations Head and CEO.

Example:

```text
Vendor A has vendor_score 43, invalid rate 31%, wrong-number rate 14%.
Decision: Pause vendor intake and request source review.
```

## Campaign Decisions

Business Problem:

- Management needs to decide whether a campaign should receive more focus, continue, pause, or be reviewed.

Evidence:

- Campaign Health Score, connect rate, qualified rate, transfer rate, sale rate, cancellation rate, file quality, agent execution, alerts.

KPIs Used:

- Campaign Health Score.
- Qualified rate.
- Transfer rate.
- Sale rate.
- Cancellation rate.
- Campaign ROI.

Formula:

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

Thresholds:

- 80 to 100: increase or maintain priority.
- 65 to 79: stable.
- 50 to 64: watch.
- 35 to 49: management review.
- Below 35: critical review.

Decision Logic:

```text
IF campaign_health_score >= 80 AND inventory/capacity available
THEN increase priority.

IF campaign_health_score < 50 OR cancellation risk rises
THEN require campaign review.
```

Confidence:

- Higher with stable file quality and enough daily volume.
- Lower when vendor mix changed recently.

Risk:

- Campaigns can look strong on transfers but fail through cancellations.

Business Impact:

- Better staffing, budget, file selection, and revenue focus.

Escalation:

- Campaigns below 35 or with complaint risk go to Operations Head.

Example:

```text
Campaign B score is 46 with transfer rate down 28% and cancellation rate up 12%.
Decision: review campaign, vendor mix, and QA results before adding more leads.
```

## File Decisions

Business Problem:

- Management needs to decide whether a lead file should continue, be deprioritized, re-churned, or retired.

Evidence:

- File Quality Score, invalid rate, duplicate rate, DNC/wrong-number rate, disconnected rate, attempts, connect rate, qualified rate, ROI.

KPIs Used:

- File Quality Score.
- Attempt exhaustion rate.
- Connect rate.
- Qualified rate.
- ROI.

Formula:

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

Thresholds:

- 70 and above: continue.
- 55 to 69: reduce priority.
- 40 to 54: manager review.
- Below 40: retire or vendor review.

Decision Logic:

```text
IF file_quality_score < 40 AND attempts sufficient
THEN retire file.

IF file has eligible dispositions and strong historical connect rate
THEN evaluate re-churn.
```

Confidence:

- Higher after enough attempts and complete disposition history.

Risk:

- Premature retirement wastes inventory; late retirement wastes calling capacity.

Business Impact:

- Less time spent on exhausted or poor-quality files.

Escalation:

- Files with DNC, complaint, or wrong-number spikes go to Operations Head.

Example:

```text
File C score is 34, attempts exhausted, and disconnected rate is 22%.
Decision: retire file and count result against vendor review.
```

## Lead Decisions

Business Problem:

- Management needs to prioritize callable lead groups while suppressing unsafe or low-value leads.

Evidence:

- Lead Quality Score, identity validity, source vendor score, campaign fit, geography, disposition history, attempt count, suppression status.

KPIs Used:

- Lead Quality Score.
- Re-Churn Score.
- Attempt count.
- Suppression status.
- Best calling window score.

Formula:

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

Thresholds:

- Suppressed leads: score forced to zero.
- 80 to 100: high priority.
- 60 to 79: normal priority.
- 40 to 59: review or hold.
- Below 40: low priority.

Decision Logic:

```text
IF suppression exists
THEN do not call or re-churn.

IF lead_quality_score >= 80 AND within best calling window
THEN prioritize lead group.
```

Confidence:

- Higher with complete history and verified identity.

Risk:

- Incorrect lead decisions create compliance risk and wasted effort.

Business Impact:

- Better use of active inventory and campaign time.

Escalation:

- Suppression conflicts go to Operations Head and Data Team.

Example:

```text
Lead group has score 84, strong ZIP performance, no suppression, and eligible dispositions.
Decision: prioritize in next approved calling window.
```

## Re-Churn Decisions

Business Problem:

- Management needs to decide which older leads or files deserve another attempt.

Evidence:

- Re-Churn Score, disposition eligibility, attempt count, time gap, historical connect/qualified performance, vendor score, campaign fit.

KPIs Used:

- Re-Churn Score.
- Eligible lead count.
- Attempt exhaustion.
- Historical connect rate.
- Historical qualified rate.

Formula:

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

Thresholds:

- 80 to 100: high-priority re-churn.
- 60 to 79: normal re-churn.
- 40 to 59: manager review.
- Below 40: do not re-churn.

Decision Logic:

```text
IF re_churn_score >= 80 AND no suppression exists
THEN approve high-priority re-churn.

IF attempt limit exceeded OR disposition disqualified
THEN block re-churn.
```

Confidence:

- Higher when historical outcomes are consistent by campaign and time window.

Risk:

- Bad re-churn decisions repeat poor inventory and increase complaint risk.

Business Impact:

- Better use of aged inventory without buying unnecessary new leads.

Escalation:

- Re-churn pools containing suppressed leads go to Data Team immediately.

Example:

```text
8,400 leads score above 80 with no suppression and best window 5 PM to 8 PM.
Decision: approve re-churn batch for Operations Head review.
```

## Agent Performance Decisions

Business Problem:

- Management needs to identify coaching needs and performance variance.

Evidence:

- Agent Productivity Score, Agent Quality Score, calls per hour, connect rate, qualified rate, transfer rate, occupancy, idle percentage, break percentage, ACW, disposition quality, QA pass rate.

KPIs Used:

- Agent Productivity Score.
- Agent Quality Score.
- Disposition Quality Score.
- QA pass rate.

Formula:

```text
agent_vs_team_percent =
  (agent_metric - team_average_metric) / team_average_metric
```

Thresholds:

- Within 10% of team average: normal.
- 10% to 20% below: watch.
- More than 20% below: coaching needed.
- More than 30% below: critical review.

Decision Logic:

```text
IF agent_quality_score is more than 20% below team average
THEN recommend coaching.

IF disposition variance is abnormal
THEN recommend QA or disposition review.
```

Confidence:

- Higher when compared against same campaign, daypart, and file quality.

Risk:

- Poor comparison groups can unfairly flag agents.

Business Impact:

- Better coaching focus and fewer low-quality outcomes.

Escalation:

- Repeated QA failures go to QA Manager and Operations Head.

Example:

```text
Agent D is 27% below team qualified rate and overuses Callback.
Decision: coaching review plus disposition audit.
```

## QA Decisions

Business Problem:

- Management needs to decide which recordings and outcomes require quality review.

Evidence:

- Recording duration, high-value transfers, unusual dispositions, complaints, cancellation after transfer, QA score, agent anomalies.

KPIs Used:

- QA Review Priority.
- QA pass rate.
- Complaint count.
- Short-call high-value rate.
- Cancellation after transfer.

Formula:

```text
qa_review_priority =
  (business_value_score * 25)
  + (risk_score * 25)
  + (agent_anomaly_score * 20)
  + (disposition_anomaly_score * 15)
  + (vendor_or_file_review_score * 15)
```

Thresholds:

- 80 to 100: immediate QA review.
- 60 to 79: review queue.
- 40 to 59: sample review.
- Below 40: no immediate QA action.

Decision Logic:

```text
IF complaint repeats OR short-call transfer pattern appears
THEN escalate QA.
```

Confidence:

- Higher when recording, disposition, and downstream outcome agree.

Risk:

- QA misses can hide compliance or revenue quality issues.

Business Impact:

- Better coaching, fewer complaints, better transfer quality.

Escalation:

- Complaint or compliance patterns go to QA Manager and Operations Head.

Example:

```text
Agent has 14 short-call transfers in one day.
Decision: immediate QA review of recordings.
```

## Capacity Decisions

Business Problem:

- Management needs to align agent capacity with the best available inventory and campaigns.

Evidence:

- Available hours, occupancy, active inventory, campaign health, re-churn pool, file quality, vendor pipeline.

KPIs Used:

- Occupancy.
- Idle percentage.
- Active callable inventory.
- Campaign Health Score.
- File Quality Score.

Formula:

```text
capacity_fit_score =
  (available_agent_hours_score * 30)
  + (callable_inventory_score * 30)
  + (campaign_priority_score * 25)
  + (risk_control_score * 15)
```

Thresholds:

- 80 and above: increase activity on best campaigns.
- 60 to 79: maintain.
- 40 to 59: rebalance.
- Below 40: management review.

Decision Logic:

```text
IF capacity available AND high-score inventory exists
THEN increase priority on best campaign.

IF capacity limited AND low-quality files active
THEN deprioritize weak files.
```

Confidence:

- Higher with current-day staffing and fresh inventory data.

Risk:

- Poor capacity planning wastes strong inventory or overworks poor files.

Business Impact:

- Better use of team time and campaign opportunity.

Escalation:

- Capacity shortages affecting revenue go to Operations Head.

Example:

```text
Capacity is available and Campaign A has high-quality inventory.
Decision: increase Campaign A priority today.
```

## Lead Purchasing Decisions

Business Problem:

- Management needs to decide when to purchase new leads and from whom.

Evidence:

- Inventory, vendor score, campaign demand, capacity, cost per qualified lead, ROI, file exhaustion.

KPIs Used:

- Vendor Score.
- Active callable inventory.
- Cost per qualified lead.
- Campaign Health Score.
- ROI.

Formula:

```text
lead_purchase_score =
  (vendor_score * 25)
  + (campaign_need_score * 25)
  + (capacity_fit_score * 20)
  + (roi_score * 20)
  + (risk_control_score * 10)
```

Thresholds:

- 80 to 100: buy.
- 60 to 79: buy limited volume.
- 40 to 59: review.
- Below 40: do not buy.

Decision Logic:

```text
IF inventory low AND vendor_score high AND ROI positive
THEN recommend lead purchase.

IF vendor quality weak OR campaign unhealthy
THEN do not purchase more.
```

Confidence:

- Higher when recent vendor files match historical performance.

Risk:

- Buying too early creates unused inventory; buying poor data wastes spend.

Business Impact:

- Better spend timing and vendor allocation.

Escalation:

- Large purchases require CEO or Operations Head approval.

Example:

```text
Inventory is low, Vendor A score is 88, Campaign B health is 84.
Decision: buy limited batch from Vendor A.
```

## Inventory Decisions

Business Problem:

- Management needs to know whether current lead inventory is usable, exhausted, risky, or insufficient.

Evidence:

- Callable inventory, suppressed inventory, expired files, re-churn candidates, file quality, campaign needs.

KPIs Used:

- Active callable inventory.
- Suppressed count.
- Attempt exhaustion rate.
- Re-Churn Score.
- File Quality Score.

Formula:

```text
inventory_health_score =
  (callable_inventory_score * 30)
  + (file_quality_average * 25)
  + (re_churn_availability_score * 20)
  + (low_suppression_risk_score * 15)
  + (campaign_fit_score * 10)
```

Thresholds:

- 80 and above: healthy.
- 60 to 79: adequate.
- 40 to 59: watch.
- Below 40: shortage or quality problem.

Decision Logic:

```text
IF inventory low AND re-churn candidates high
THEN review re-churn before new purchase.

IF inventory high but low quality
THEN retire weak files and prioritize best files.
```

Confidence:

- Higher when import, disposition, and attempt data are current.

Risk:

- Inventory can look large while usable inventory is actually low.

Business Impact:

- Better purchase timing and campaign planning.

Escalation:

- Inventory shortages that affect revenue go to Operations Head.

Example:

```text
Active inventory is high but 61% is exhausted or low quality.
Decision: retire weak files and review re-churn before buying.
```

## Revenue Decisions

Business Problem:

- Management needs to understand whether operational activity is producing profitable business.

Evidence:

- Revenue, cost, ROI, sale rate, cancellation rate, vendor cost, campaign performance, QA outcomes.

KPIs Used:

- Revenue.
- ROI.
- Sale rate.
- Cancellation rate.
- Cost per qualified lead.
- Cost per transfer.
- Business Health Score.

Formula:

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

Thresholds:

- 85 to 100: strong.
- 70 to 84: stable.
- 55 to 69: watch.
- 40 to 54: intervention needed.
- Below 40: critical review.

Decision Logic:

```text
IF ROI negative AND cancellation rate rising
THEN pause spend and review source quality, campaign, and QA.

IF ROI positive AND campaign/vendor health strong
THEN consider increasing volume.
```

Confidence:

- Higher after cancellation window closes and revenue attribution is complete.

Risk:

- Front-end sales can hide later cancellation losses.

Business Impact:

- Better budget allocation, vendor decisions, and executive planning.

Escalation:

- Revenue decline or negative ROI goes to CEO and Operations Head.

Example:

```text
Revenue is stable but cancellations rose 19% from Vendor B campaign files.
Decision: pause Vendor B expansion and review QA outcomes.
```

