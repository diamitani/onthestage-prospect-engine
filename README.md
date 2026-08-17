# OnTheStage — GTM Prospect Automation Engine

An autonomous AI outbound infrastructure and lead enrichment engine built for **OnTheStage.com** performing arts revenue operations.

## Features
- **6-Step Autonomous Pipeline:** Ingestion, Clay Waterfall, Theatre ICP Contact Discovery, AI Production Scraping, Claude 3.5 Sonnet PAS Copywriting, and CRM Sync.
- **Tech Stack Governance:** Pre-configured adapters for HubSpot, Salesforce, Clay, RB2B, Qualified, and Amplemarket/Smartlead.
- **Interactive Live Simulator:** Test real performing arts ICP targets and inspect personalized emails, LinkedIn DMs, SDR phone scripts, and JSON payloads.
- **Turnkey Agent Skill:** Integrated Claude Code / Codex skill (`SKILL.md`) and Python trigger client (`trigger_intake.py`).
- **Production n8n Workflow:** Complete downloadable workflow template (`prospect-automation-engine-master.n8n.json`).

## Local Development
```bash
npx serve .
```

## Trigger via CLI Skill
```bash
python3 trigger_intake.py sample_theatre_leads.csv "Spring 2026 High School Drama Outbound"
```
