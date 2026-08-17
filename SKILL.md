# OnTheStage (OTS) Prospect Automation Skill

This skill allows Claude Code, Antigravity, or Codex agents to intake school district lists, state theatre festival registries, or raw CSV spreadsheets and trigger the automated OnTheStage GTM prospect engine.

## Capabilities
1. Parse CSV lists of K-12 schools, colleges, and community theatres.
2. Normalize domain names, director titles, and upcoming production info.
3. Post the validated lead batch to the OnTheStage n8n webhook (`/webhook/prospect-automation-intake`).
4. Trigger automated Clay waterfall enrichment, Claude 3.5 Sonnet PAS messaging, and CRM sync.

## Usage in Claude Code / Terminal
```bash
# Upload and run a batch
python trigger_intake.py sample_theatre_leads.csv "Spring 2026 High School Drama Outbound"

# Dry-run validation only
python trigger_intake.py sample_theatre_leads.csv --dry-run
```
