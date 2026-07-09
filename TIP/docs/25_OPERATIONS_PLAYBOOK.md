# Operations Playbook

## Purpose

This document defines how TeleMaster India management should use TIP during daily, weekly, monthly, and quarterly operations.

TIP is not a CRM, dialer, or agent workspace. It is a management intelligence system for decisions, review, escalation, and business control.

## Operating Rhythm

TIP should be reviewed in a consistent rhythm:

- Morning Review: decide what needs attention today.
- Operations Review: monitor active performance and bottlenecks.
- Campaign Review: decide campaign priority and risk.
- Vendor Review: decide purchase, pause, reduce, or stop.
- Lead Review: decide inventory, file, and re-churn actions.
- QA Review: decide which calls, agents, and outcomes require review.
- End of Day Review: close the day with decisions and unresolved risks.
- Weekly Review: inspect trends and recurring issues.
- Monthly Review: evaluate ROI, vendor strategy, campaign performance, and rule changes.
- Quarterly Review: assess platform direction, score thresholds, and business strategy.

## Morning Review

Objective:

- Start the day with clear management priorities.

Primary screens:

- [Executive Command Center](19_DASHBOARD_SPECIFICATIONS.md).
- [Alert Engine](23_ALERT_ENGINE.md).
- [Decision Engine](24_DECISION_ENGINE.md).

Checklist:

- Review Attention Required.
- Review Critical and High alerts.
- Review Today's Decisions.
- Review open recommendations.
- Check active callable inventory.
- Check campaign health.
- Check vendor/file quality risks.
- Assign owners for urgent actions.

Expected outputs:

- Daily priority list.
- Owners assigned.
- Escalations identified.
- Campaign/file/vendor actions approved or held.

## Operations Review

Objective:

- Understand whether current operations are on track.

Checklist:

- Compare current connect, qualified, and transfer rates against baseline.
- Review agent productivity and quality variance.
- Check idle, break, wrap-up, and ACW patterns.
- Check active file performance.
- Review disposition anomalies.
- Confirm that high-risk alerts have owners.

Decision questions:

- Which campaign should receive more focus today?
- Which file should be deprioritized?
- Which agent needs coaching review?
- Which operational issue should be escalated?

## Campaign Review

Objective:

- Decide whether each active campaign is healthy, stable, risky, or ready for more volume.

Checklist:

- Review Campaign Health Score.
- Review connect, qualified, transfer, sale, and cancellation rates.
- Review vendor mix.
- Review file quality.
- Review QA concerns.
- Review geography performance.
- Review open recommendations.

Decision outcomes:

- Increase priority.
- Maintain.
- Watch.
- Pause.
- Review campaign setup or vendor mix.

## Vendor Review

Objective:

- Decide whether to buy more, reduce, pause, or stop vendor intake.

Checklist:

- Review Vendor Score.
- Review invalid, duplicate, disconnected, DNC, and wrong-number percentages.
- Review connect, qualified, transfer, sale, cancellation, and ROI.
- Review file-level performance.
- Compare vendor against prior period and campaign average.
- Review unresolved vendor alerts.

Decision outcomes:

- Buy more.
- Continue.
- Reduce.
- Pause.
- Stop.
- Request replacement file.

Escalation:

- Compliance risk or severe quality decline goes to Operations Head.
- Large purchase decisions go to CEO or approved executive owner.

## Lead Review

Objective:

- Decide how to use lead inventory effectively.

Checklist:

- Review active callable inventory.
- Review suppressed, exhausted, and retired inventory.
- Review file quality.
- Review Lead Quality Score by group.
- Review re-churn candidates.
- Review best calling windows.
- Review inventory shortage or surplus.

Decision outcomes:

- Prioritize lead group.
- Hold lead group.
- Retire file.
- Approve re-churn.
- Buy new leads.
- Pause purchase until current inventory is cleaned.

## QA Review

Objective:

- Identify recordings, agents, dispositions, and outcomes requiring management attention.

Checklist:

- Review QA alerts.
- Review short-call and long-call flags.
- Review high-value transfers.
- Review complaint patterns.
- Review cancellation after transfer.
- Review agent disposition variance.
- Review QA pass/fail trend.

Decision outcomes:

- Review recordings.
- Coach agent.
- Escalate complaint.
- Audit disposition usage.
- Review campaign or vendor quality.

## End of Day Review

Objective:

- Close the operating day with clear status and unresolved decisions.

Checklist:

- Review actions taken from morning decisions.
- Review unresolved high-priority alerts.
- Review campaign and vendor changes made.
- Review files retired, paused, or approved for re-churn.
- Review agent coaching or QA issues opened.
- Record management notes where required.

Expected outputs:

- End-of-day summary.
- Open risks.
- Next-day priority items.
- Owner follow-ups.

## Weekly Review

Objective:

- Identify recurring patterns and decide structural changes.

Checklist:

- Review vendor ranking.
- Review campaign performance trend.
- Review file quality trend.
- Review disposition quality.
- Review agent scorecards.
- Review QA findings.
- Review re-churn performance.
- Review open and closed recommendations.

Decision outcomes:

- Adjust vendor purchases.
- Change campaign priority.
- Update business rules.
- Plan coaching.
- Retire repeated poor files.
- Review thresholds.

## Monthly Review

Objective:

- Evaluate business performance and management strategy.

Checklist:

- Review Business Health Score.
- Review revenue, cost, ROI, sale rate, and cancellation rate.
- Review vendor spend and output.
- Review campaign profitability.
- Review geography performance.
- Review QA and complaint trends.
- Review rule changes and overrides.

Decision outcomes:

- Approve vendor strategy.
- Approve campaign strategy.
- Change purchase volume.
- Update scoring thresholds.
- Review staffing or capacity planning.

## Quarterly Review

Objective:

- Review long-term business direction and TIP rule maturity.

Checklist:

- Review quarter-over-quarter business health.
- Review vendor portfolio.
- Review campaign portfolio.
- Review state and ZIP performance.
- Review scoring accuracy.
- Review recommendation impact.
- Review alert volume and escalation performance.
- Review future improvements backlog.

Decision outcomes:

- Keep, reduce, or expand vendor relationships.
- Retire stale campaigns.
- Update operating rules.
- Approve new intelligence modules.
- Freeze or revise Product Bible updates through the change policy.

## Decision Checklists

Vendor decision:

- Is the Vendor Score reliable?
- Is sample size sufficient?
- Are invalid, duplicate, DNC, wrong-number, and disconnected rates acceptable?
- Is ROI positive?
- Are cancellations acceptable?
- Is there unresolved QA or compliance risk?

Campaign decision:

- Is Campaign Health Score stable?
- Are outcomes improving or declining?
- Is vendor mix helping or hurting?
- Are agents performing normally?
- Are cancellations or complaints rising?

File decision:

- Is File Quality Score acceptable?
- Are attempts exhausted?
- Are invalid/disconnected/DNC/wrong-number rates high?
- Is qualified rate below threshold?
- Should the file continue, re-churn later, or retire?

Re-churn decision:

- Are dispositions eligible?
- Has enough time passed?
- Are attempt limits respected?
- Are suppressed leads excluded?
- Is Re-Churn Score high enough?
- Is there a best calling window?

QA decision:

- Is the recording high value or high risk?
- Is the disposition believable?
- Is there agent variance?
- Are complaints or cancellations connected?
- Does this require coaching or escalation?

## Escalation Procedures

Critical escalation:

- Triggered by compliance risk, complaint pattern, DNC issue, severe vendor quality issue, critical campaign decline, or negative revenue risk.
- Owner must acknowledge same day.
- Executive owner should be notified when business or compliance impact is high.

High escalation:

- Triggered by vendor pause, file retirement, agent quality issue, campaign review, or high-priority QA issue.
- Owner should respond within the operating day.

Medium escalation:

- Triggered by watch-level trends or recurring operational issues.
- Owner should review during daily or weekly rhythm.

Escalation record should include:

- Issue.
- Evidence.
- Owner.
- Required action.
- Due date.
- Status.
- Close reason.

## Operational SOPs

Import SOP:

- Register file.
- Profile structure.
- Review validation summary.
- Confirm vendor and campaign.
- Review duplicate and invalid rates.
- Approve or reject import.
- Record decision.

Vendor pause SOP:

- Confirm threshold breach.
- Review recent files and campaigns.
- Check ROI and compliance risk.
- Notify owner.
- Pause new intake.
- Record reason.
- Define review date.

File retirement SOP:

- Confirm file quality and attempt exhaustion.
- Check compliance and ROI.
- Confirm no valuable re-churn pool remains.
- Mark file as retired in management decision record.
- Include file in vendor review.

Re-churn approval SOP:

- Review eligible pool.
- Confirm exclusions.
- Check attempt limits.
- Confirm best calling window.
- Approve batch or hold.
- Track re-churn result after completion.

QA escalation SOP:

- Review trigger.
- Open recording set.
- Assign QA owner.
- Record finding.
- Decide coaching, campaign review, vendor review, or closure.

## Related Documents

- [Decision Engine](24_DECISION_ENGINE.md).
- [Dashboard Specifications](19_DASHBOARD_SPECIFICATIONS.md).
- [Alert Engine](23_ALERT_ENGINE.md).
- [Report Catalog](22_REPORT_CATALOG.md).
- [Business Rules](17_BUSINESS_RULES.md).
- [Formulas and Scoring](16_FORMULAS_AND_SCORING.md).

