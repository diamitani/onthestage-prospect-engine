/* ==========================================================================
   Interactive Code Viewer & Clipboard Helper for OnTheStage GTM Engine
   ========================================================================== */

const CODE_SNIPPETS = {
  skill: `---
name: onthestage-prospect-trigger
description: Dispatches theatre rosters and school district CSVs to the OnTheStage n8n GTM Prospect Automation Engine.
---

# OnTheStage Prospect Automation Skill

## Trigger Pipeline
Execute batch ingestion of target performing arts organizations:
\`\`\`bash
python trigger_intake.py sample_theatre_leads.csv "Spring 2026 High School Drama Outbound"
\`\`\`

## What the Workflow Does (Node 01 -> 09):
1. Ingests CSV & standardizes schema (Company, Domain, Title, Production).
2. Calls n8n Webhook -> Clay Waterfall Enrichment.
3. Checks CRM deduplication (HubSpot / Salesforce).
4. Resolves Drama Directors & verifies work emails via NeverBounce.
5. Claude 3.5 Sonnet generates tailored Problem-Agitate-Solve copy referencing their specific show.
6. Upserts Contact to HubSpot/Salesforce & enrolls in automated sequence.`,

  python: `import csv, json, sys, urllib.request

WEBHOOK_URL = "https://n8n.onthestage-internal.com/webhook/prospect-automation-intake"

def run_intake(csv_file, campaign="OTS Spring 2026"):
    leads = []
    with open(csv_file, mode="r", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            leads.append({
                "company_name": row.get("Organization") or row.get("School"),
                "domain": row.get("Domain") or row.get("Website"),
                "state": row.get("State", "US"),
                "target_title": row.get("Title", "Theatre Director"),
                "production": row.get("Current_Show", ""),
                "campaign": campaign
            })
    
    payload = json.dumps({"leads": leads, "source": "claude_code_skill"}).encode("utf-8")
    req = urllib.request.Request(WEBHOOK_URL, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        print(f"✅ Dispatched {len(leads)} leads to OnTheStage GTM Engine. Status: {resp.status}")

if __name__ == "__main__":
    run_intake(sys.argv[1] if len(sys.argv) > 1 else "sample_theatre_leads.csv")`,

  curl: `curl -X POST https://n8n.onthestage-internal.com/webhook/prospect-automation-intake \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ots_gtm_sec_9942a1" \\
  -d '{
    "campaign_name": "High School Spring Musicals 2026",
    "batch_size": 1,
    "leads": [
      {
        "company_name": "Westlake High Performing Arts",
        "domain": "westlakearts.org",
        "state": "TX",
        "target_title": "Fine Arts Director & Drama Teacher",
        "upcoming_production": "Into the Woods (Spring 2026)"
      }
    ]
  }'`
};

document.addEventListener("DOMContentLoaded", () => {
  initCodeViewer();
});

function initCodeViewer() {
  const codeTabs = document.querySelectorAll(".code-tab-btn");
  const codeContent = document.getElementById("code-content");
  const copyBtn = document.getElementById("btn-copy-code");

  let activeCodeKey = "skill";
  if (codeContent) {
    codeContent.textContent = CODE_SNIPPETS[activeCodeKey];
  }

  codeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      codeTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCodeKey = tab.dataset.code;
      if (codeContent) {
        codeContent.textContent = CODE_SNIPPETS[activeCodeKey];
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeKey]);
      copyBtn.innerText = "✓ Copied!";
      setTimeout(() => {
        copyBtn.innerHTML = "&#128203; Copy Code";
      }, 2000);
    });
  }
}
