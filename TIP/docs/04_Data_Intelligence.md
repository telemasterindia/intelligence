# Data Intelligence

Data Intelligence is the first useful layer of TIP. Its job is to turn messy vendor files into trusted operational data.

## Goals

- Identify vendors and campaigns.
- Profile imported files before data is committed.
- Validate rows and preserve rejection reasons.
- Normalize phone, ZIP, state, county, area code, and timezone signals.
- Distinguish durable lead identity from lead occurrences.
- Build a reliable history of where each lead came from.

## Core Concepts

- `lead_identities`: one durable identity per normalized phone number.
- `leads`: one occurrence of an identity inside an import, vendor, and campaign.
- `import_batches`: the auditable lifecycle of an imported file.
- `import_validations`: rejected or suspicious rows with structured reasons.

## Data Quality Signals

TIP should track:

- Missing fields.
- Invalid phone numbers.
- Invalid ZIP or state values.
- Duplicate rows.
- Repeated identities across vendors.
- Vendor-specific formatting problems.
- Campaign mismatch patterns.

## Duplicate Engine

The Duplicate Engine belongs inside Data Intelligence because duplication is a data-quality and identity-resolution problem before it becomes a scoring or recommendation problem.

Duplicate detection should evaluate:

- Exact phone matches after normalization.
- Phone hash matches.
- Repeated identities across vendors.
- Repeated rows inside the same import batch.
- Repeated identities across campaigns.
- Same identity with different names, ZIPs, states, or payload values.

Decision outputs:

- `unique`: identity has not appeared before.
- `same_file_duplicate`: repeated inside the same import batch.
- `cross_file_duplicate`: repeated across files from the same vendor.
- `cross_vendor_duplicate`: repeated across different vendors.
- `identity_conflict`: same phone identity with conflicting supporting fields.

Duplicate signals should feed [Formulas and Scoring](16_FORMULAS_AND_SCORING.md), [Business Rules](17_BUSINESS_RULES.md), [Recommendation Rules](20_RECOMMENDATION_RULES.md), and [Decision Engine](24_DECISION_ENGINE.md).

## Success Criteria

Data Intelligence succeeds when an internal user can answer:

- Can this file be imported?
- What is wrong with rejected rows?
- Which vendor sends cleaner data?
- Which identities are recurring across files?
- Can we audit exactly how this data entered the system?
