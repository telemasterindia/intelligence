# Business Rules

## Purpose

This document defines operational rules TIP should use to protect data quality, compliance, calling efficiency, vendor review, file retirement, re-churn decisions, and QA escalation.

TIP is not a CRM, dialer, or agent workspace. These rules are for internal management intelligence and decision support.

## Business Value

Clear business rules help TeleMaster India:

- Avoid calling leads that should not be called.
- Reduce wasted calling effort.
- Identify poor vendor files early.
- Coach agents with evidence.
- Escalate QA risks quickly.
- Keep management decisions consistent.

## Inputs

- Lead identity and lead occurrence data.
- Disposition history.
- Call outcome history.
- Vendor and campaign rules.
- Attempt history.
- Recording and QA data.
- Revenue, sale, cancellation, and ROI data.
- Compliance and suppression indicators.

## Outputs

- Suppression decisions.
- Re-churn eligibility.
- Attempt-limit decisions.
- File retirement recommendations.
- Vendor pause recommendations.
- QA escalation recommendations.
- Management alerts.
- Audit events.

## KPIs

- DNC rate.
- Wrong-number rate.
- Disconnected rate.
- Complaint rate.
- Attempt count per lead.
- Callback completion rate.
- Re-churn conversion rate.
- File retirement rate.
- Vendor pause rate.
- QA escalation rate.
- Disposition quality score.

## Rules

### DNC

Rule:

```text
IF disposition = DNC
THEN suppress lead identity from future calling
AND block re-churn
AND create compliance audit event
```

Management action:

- Review DNC spikes by vendor, file, campaign, and agent.
- Escalate if DNC appears after previous contact history.

### Wrong Number

Rule:

```text
IF disposition = Wrong Number
THEN mark phone identity as invalid for calling
AND exclude from re-churn
AND include in vendor quality calculation
```

Management action:

- Review vendor if wrong-number rate exceeds campaign baseline.

### Disconnected

Rule:

```text
IF disposition = Disconnected
THEN mark lead as non-callable
AND exclude from re-churn
AND count against file and vendor quality
```

Management action:

- Flag file if disconnected rate rises sharply above baseline.

### Voicemail

Rule:

```text
IF disposition = Voicemail
THEN allow future attempt
IF attempt_count < campaign_voicemail_attempt_limit
AND minimum_time_gap has passed
```

Management action:

- Review voicemail-heavy files if connect and qualified rates remain low.

### Callback

Rule:

```text
IF disposition = Callback
THEN schedule for callback review
AND prevent normal re-churn before callback time
```

Management action:

- Monitor callback completion and conversion.
- Flag agents with excessive callback usage and low follow-through.

### Not Interested

Rule:

```text
IF disposition = Not Interested
THEN pause lead from short-term re-churn
AND allow future re-churn only if campaign rule permits
AND required aging period has passed
```

Management action:

- Review overuse by agent, campaign, file, or vendor.

### Qualified

Rule:

```text
IF disposition = Qualified
THEN mark as high-value outcome
AND include in campaign, agent, file, vendor, ZIP, and state scoring
```

Management action:

- Compare qualified rate against team and campaign average.
- Audit suspicious short-call qualified outcomes.

### Transferred

Rule:

```text
IF disposition = Transferred
THEN mark as high-value operational outcome
AND connect downstream sale or cancellation where available
```

Management action:

- Prioritize QA review for high-value transfers.
- Compare transfer rate by agent and campaign.

### Sale

Rule:

```text
IF outcome = Sale
THEN attribute sale to lead identity, campaign, vendor, agent, file, ZIP, and state
AND update ROI calculations
```

Management action:

- Track sale rate and revenue by source.
- Review sale quality after cancellation window.

### Cancellation

Rule:

```text
IF outcome = Cancellation
THEN reduce net performance score
AND flag source, campaign, agent, and QA path for review
```

Management action:

- High cancellation rate should reduce vendor and campaign confidence.

### Re-Churn

Rule:

```text
IF lead has eligible disposition
AND attempt_count is below limit
AND required time gap has passed
AND no suppression exists
THEN calculate re_churn_score
```

Eligible dispositions may include:

- No Answer.
- Busy.
- Voicemail.
- Callback after callback window.
- Not Reached.
- Interested Later.

Ineligible dispositions:

- DNC.
- Wrong Number.
- Disconnected.
- Complaint.
- Suppressed.
- Attempt limit exceeded.

### Attempt Limits

Rule:

```text
IF attempt_count >= campaign_attempt_limit
THEN remove lead from active calling pool
AND mark for file exhaustion calculation
```

Suggested default limits:

- No Answer: 3 to 6 attempts.
- Busy: 3 to 5 attempts.
- Voicemail: 2 to 4 attempts.
- Callback: governed by callback rule.
- Not Interested: 0 to 1 future attempts only if allowed.
- DNC, Wrong Number, Disconnected, Complaint: 0 future attempts.

### File Retirement

Rule:

```text
IF file has low connect rate
OR high invalid rate
OR high DNC/wrong-number rate
OR low qualified rate
OR poor ROI
OR attempt exhaustion
THEN evaluate file retirement
```

Management decisions:

- Continue.
- Reduce priority.
- Re-churn later.
- Retire.
- Escalate vendor review.

### Vendor Pause

Rule:

```text
IF vendor has repeated poor file quality
OR high invalid percentage
OR high duplicate percentage
OR high DNC/wrong-number percentage
OR poor ROI
OR unresolved compliance risk
THEN recommend vendor pause
```

Management action:

- Pause new purchases.
- Review contract or source.
- Request replacement file.
- Stop vendor if performance does not recover.

### QA Escalation

Rule:

```text
IF call recording, disposition, complaint, transfer, or cancellation pattern indicates risk
THEN create QA escalation
```

Escalation triggers:

- Very short high-value calls.
- Very long low-quality calls.
- Repeated complaint patterns.
- High cancellation after transfers.
- Suspicious disposition mix.
- Agent outcome variance.

## Examples

Example 1:

```text
Lead has disposition DNC.
Decision: suppress permanently from re-churn.
Owner: Operations Manager.
Audit: compliance suppression event required.
```

Example 2:

```text
Vendor file has 28% disconnected rate and 19% wrong-number rate.
Decision: pause vendor intake and review source quality.
Owner: Operations Manager.
```

## Related Modules

- Data Intelligence.
- Operations Intelligence.
- Recommendation Rules.
- Alert Engine.
- QA Intelligence.
- Report Catalog.

## Future Improvements

- Add configurable rule UI.
- Add rule version history.
- Add automatic threshold tuning by campaign.
- Add manager override workflow.
- Add compliance review queue.

