# TIP Product Bible

Version 1.0 freeze documentation for TIP, the TeleMaster Intelligence Platform.

TIP is an internal Operations Intelligence Platform for TeleMaster India. Its purpose is to turn lead data, vendor data, campaign data, agent performance data, QA data, disposition data, recording data, and business KPIs into management decisions.

TIP is not a CRM, dialer, public SaaS product, or agent workspace.

## Documentation Structure

Product foundation:

- [01 Vision and Product Philosophy](01_Vision_and_Product_Philosophy.md)
- [02 User Personas](02_User_Personas.md)
- [03 System Architecture](03_System_Architecture.md)
- [13 Roadmap](13_Roadmap.md)

Intelligence modules:

- [04 Data Intelligence](04_Data_Intelligence.md)
- [05 Operations Intelligence](05_Operations_Intelligence.md)
- [06 Business Intelligence](06_Business_Intelligence.md)
- [07 Recommendation Engine](07_Recommendation_Engine.md)
- [08 Predictive Intelligence](08_Predictive_Intelligence.md)

Technical and product rules:

- [09 Database Design](09_Database_Design.md)
- [10 UI UX Standards](10_UI_UX_Standards.md)
- [11 API Design](11_API_Design.md)
- [12 Development Rules](12_Development_Rules.md)
- [17 Business Rules](17_BUSINESS_RULES.md)
- [18 Data Dictionary](18_DATA_DICTIONARY.md)

Management intelligence:

- [16 Formulas and Scoring](16_FORMULAS_AND_SCORING.md)
- [16 KPI and Decision Engine](16_KPI_AND_DECISION_ENGINE.md)
- [19 Dashboard Specifications](19_DASHBOARD_SPECIFICATIONS.md)
- [20 Recommendation Rules](20_RECOMMENDATION_RULES.md)
- [22 Report Catalog](22_REPORT_CATALOG.md)
- [23 Alert Engine](23_ALERT_ENGINE.md)
- [24 Decision Engine](24_DECISION_ENGINE.md)
- [25 Operations Playbook](25_OPERATIONS_PLAYBOOK.md)

Interface standards:

- [21 UI Component Library](21_UI_COMPONENT_LIBRARY.md)

Sprint and implementation notes:

- [Folder Structure](folder-structure.md)
- [Architecture Diagram](architecture.md)
- [Database Schema](database-schema.md)
- [Sprint 0.5 Database Refinement](sprint-0-5-database-refinement.md)
- [Sprint 1 Recommendation](sprint-1-recommendation.md)
- [Installation Guide](installation-guide.md)
- [Local Development](local-development.md)

Change control:

- [Changelog](CHANGELOG.md)

## Reading Order

Recommended full reading order:

1. [Vision and Product Philosophy](01_Vision_and_Product_Philosophy.md)
2. [User Personas](02_User_Personas.md)
3. [Data Intelligence](04_Data_Intelligence.md)
4. [Operations Intelligence](05_Operations_Intelligence.md)
5. [Business Intelligence](06_Business_Intelligence.md)
6. [Formulas and Scoring](16_FORMULAS_AND_SCORING.md)
7. [Business Rules](17_BUSINESS_RULES.md)
8. [Data Dictionary](18_DATA_DICTIONARY.md)
9. [Dashboard Specifications](19_DASHBOARD_SPECIFICATIONS.md)
10. [Recommendation Rules](20_RECOMMENDATION_RULES.md)
11. [Alert Engine](23_ALERT_ENGINE.md)
12. [Decision Engine](24_DECISION_ENGINE.md)
13. [Operations Playbook](25_OPERATIONS_PLAYBOOK.md)
14. [System Architecture](03_System_Architecture.md)
15. [Database Design](09_Database_Design.md)
16. [API Design](11_API_Design.md)
17. [Development Rules](12_Development_Rules.md)

## Document Dependency Map

```text
Vision and Product Philosophy
  -> User Personas
  -> Data Intelligence
  -> Operations Intelligence
  -> Business Intelligence

Data Intelligence
  -> Data Dictionary
  -> Database Design
  -> Formulas and Scoring

Formulas and Scoring
  -> Business Rules
  -> Recommendation Rules
  -> Alert Engine
  -> Decision Engine

Dashboard Specifications
  -> UI Component Library
  -> Report Catalog
  -> Operations Playbook

Recommendation Rules
  -> Decision Engine
  -> Alert Engine

Predictive Intelligence
  -> Formulas and Scoring
  -> Decision Engine

Decision Engine
  -> Operations Playbook
```

## Recommended Reading by Role

CEO:

- [Vision and Product Philosophy](01_Vision_and_Product_Philosophy.md)
- [Business Intelligence](06_Business_Intelligence.md)
- [Dashboard Specifications](19_DASHBOARD_SPECIFICATIONS.md)
- [Report Catalog](22_REPORT_CATALOG.md)
- [Decision Engine](24_DECISION_ENGINE.md)
- [Operations Playbook](25_OPERATIONS_PLAYBOOK.md)

Operations Head:

- [Operations Intelligence](05_Operations_Intelligence.md)
- [Formulas and Scoring](16_FORMULAS_AND_SCORING.md)
- [Business Rules](17_BUSINESS_RULES.md)
- [Recommendation Rules](20_RECOMMENDATION_RULES.md)
- [Alert Engine](23_ALERT_ENGINE.md)
- [Decision Engine](24_DECISION_ENGINE.md)
- [Operations Playbook](25_OPERATIONS_PLAYBOOK.md)

Data Team:

- [Data Intelligence](04_Data_Intelligence.md)
- [Data Dictionary](18_DATA_DICTIONARY.md)
- [Database Design](09_Database_Design.md)
- [Business Rules](17_BUSINESS_RULES.md)
- [Report Catalog](22_REPORT_CATALOG.md)

Developer:

- [System Architecture](03_System_Architecture.md)
- [Database Design](09_Database_Design.md)
- [API Design](11_API_Design.md)
- [Development Rules](12_Development_Rules.md)
- [UI Component Library](21_UI_COMPONENT_LIBRARY.md)
- [Data Dictionary](18_DATA_DICTIONARY.md)

AI Assistant:

- [Vision and Product Philosophy](01_Vision_and_Product_Philosophy.md)
- [Data Dictionary](18_DATA_DICTIONARY.md)
- [Development Rules](12_Development_Rules.md)
- [Business Rules](17_BUSINESS_RULES.md)
- [Recommendation Rules](20_RECOMMENDATION_RULES.md)
- [Decision Engine](24_DECISION_ENGINE.md)

## Terminology Standard

Use these terms consistently:

- TIP: TeleMaster Intelligence Platform.
- Operations Intelligence Platform: the product category.
- Management decision: the primary output of TIP.
- Lead identity: durable normalized phone identity.
- Lead occurrence: one appearance of an identity in a vendor file, campaign, and import batch.
- Vendor Score: vendor quality and business value score.
- Campaign Health Score: campaign operating health score.
- File Quality Score: lead file quality and usefulness score.
- Re-Churn Score: score for deciding whether aged leads or files should be re-run.
- Business Health Score: executive-level operating health score.

Avoid:

- Calling TIP a CRM.
- Describing TIP as a dialer.
- Creating agent workspace features.
- Using generic SaaS language.

