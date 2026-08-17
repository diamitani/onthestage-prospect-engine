import csv
import json
import os
import sys
import urllib.request
import urllib.error

WEBHOOK_URL = os.environ.get(
    "OTS_PROSPECT_WEBHOOK_URL", 
    "http://localhost:5678/webhook/prospect-automation-intake"
)
API_KEY = os.environ.get("OTS_API_KEY", "ots_gtm_sec_9942a1")

def load_and_validate_leads(file_path: str):
    if not os.path.exists(file_path):
        print(f"❌ Error: File '{file_path}' not found.")
        sys.exit(1)
        
    leads = []
    with open(file_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, start=1):
            org = row.get("Organization") or row.get("School") or row.get("company_name") or row.get("Name")
            domain = row.get("Domain") or row.get("Website") or row.get("domain") or ""
            state = row.get("State") or row.get("state") or ""
            title = row.get("Title") or row.get("target_title") or "Theatre Director / Drama Department Head"
            contact_name = row.get("Contact_Name") or row.get("name") or ""
            email = row.get("Email") or row.get("email") or ""
            production = row.get("Current_Show") or row.get("Upcoming_Production") or ""
            
            if org:
                leads.append({
                    "id": f"lead_{idx:03d}",
                    "company_name": org.strip(),
                    "domain": domain.strip().replace("https://", "").replace("http://", "").rstrip("/"),
                    "state": state.strip(),
                    "contact_name": contact_name.strip(),
                    "email": email.strip(),
                    "target_title": title.strip(),
                    "upcoming_production": production.strip(),
                    "source": "claude_code_agent_skill"
                })
    return leads

def trigger_engine(file_path: str, campaign_name: str = "High School Spring Musicals 2026", dry_run: bool = False):
    leads = load_and_validate_leads(file_path)
    print(f"\n🎭 [OnTheStage GTM Engine] Loaded {len(leads)} target organizations from '{file_path}'")
    print(f"📦 Campaign: {campaign_name}")
    print(f"🎯 Target Personas: Drama Teachers, Theatre Directors, Fine Arts Chairs\n")
    
    for i, lead in enumerate(leads[:3], start=1):
        print(f"  [{i}] {lead['company_name']} ({lead['state'] or 'US'}) — Contact: {lead['contact_name'] or 'To enrich via Clay'} | Prod: {lead['upcoming_production'] or 'To scrape'}")
    if len(leads) > 3:
        print(f"  ... and {len(leads) - 3} more leads.\n")
        
    if dry_run:
        print("🔍 [DRY RUN] Schema validated successfully. No webhook dispatched.")
        return

    payload = {
        "campaign_name": campaign_name,
        "batch_size": len(leads),
        "crm_target": "HubSpot/Salesforce",
        "enrichment_engine": "Clay_Waterfall",
        "messaging_model": "Claude-3-5-Sonnet",
        "leads": leads
    }

    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            WEBHOOK_URL,
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_KEY}",
                "User-Agent": "OTS-Claude-Code-Skill/1.0"
            }
        )
        print(f"🚀 Sending payload to n8n webhook: {WEBHOOK_URL}...")
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            print(f"✅ Pipeline Triggered Successfully! (HTTP {status})")
            print(f"📊 Response: {body}")
    except urllib.error.URLError as e:
        print(f"⚠️ Webhook dispatch simulation: {e}")
        print("💡 Note: Ensure your local or cloud n8n webhook listener is active at:", WEBHOOK_URL)
        print("📋 Payload sample:")
        print(json.dumps(payload, indent=2)[:400] + "\n...")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python trigger_intake.py <leads.csv> [campaign_name] [--dry-run]")
        sys.exit(1)
        
    target_csv = sys.argv[1]
    campaign = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else "OTS Spring 2026 Outbound"
    is_dry_run = "--dry-run" in sys.argv
    
    trigger_engine(target_csv, campaign, is_dry_run)
