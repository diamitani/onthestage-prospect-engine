/* ==========================================================================
   Interactive Engine Simulator & State Machine for OnTheStage GTM Engine
   ========================================================================== */

// Sample Mock Lead Data representing OnTheStage ICP targets
const PRESET_LEADS = [
  {
    organization: "Westlake High Performing Arts",
    domain: "westlakearts.org",
    state: "TX",
    contact_name: "Sarah Jenkins",
    title: "Fine Arts Director & Drama Teacher",
    email: "sjenkins@westlakearts.org",
    current_show: "Into the Woods (Spring 2026)",
    detected_tool: "Cash & Paper Envelopes",
    venue_type: "750-Seat High School Auditorium",
    pain_point: "Lost 25+ hours last year assigning paper tickets and tracking envelope cash; zero online reserved seating for parents and alumni.",
    email_copy: {
      subject: "Quick question regarding Into the Woods at Westlake High",
      body: "Hi Sarah,\n\nI noticed Westlake High's theatre department is gearing up for Into the Woods this coming spring in your 750-seat auditorium.\n\nMost high school drama directors we speak with lose 20+ hours managing envelope cash and manual seat assignments instead of working with their student cast.\n\nOn The Stage gives Westlake High a complete Broadway-grade ticketing & reserved seating portal with $0 upfront software fees (passed directly to ticket buyers). Would you be open to a 10-minute peek before rehearsals start?",
      linkedin: "Hi Sarah — saw Westlake High is producing Into the Woods! We help high school drama directors eliminate envelope cash & manual ticketing with a $0-cost reserved seating platform. Open to connecting?",
      sdr_battlecard: "HOOK: Mention 'Into the Woods' & the 750-seat auditorium.\nPAIN: Manual envelope cash & zero donor capture.\nOFFER: 100% free software to the school with automated reserved seating and digital program books."
    }
  },
  {
    organization: "Riverside Community Playhouse",
    domain: "riversideplayhouse.com",
    state: "CA",
    contact_name: "Marcus Vance",
    title: "Artistic Director",
    email: "marcus@riversideplayhouse.com",
    current_show: "The Crucible (March 2026)",
    detected_tool: "Eventbrite (High Transaction Fees)",
    venue_type: "220-Seat Black Box Theatre",
    pain_point: "Paying 8%+ in generic Eventbrite fees with no cast-member ticket attribution or integrated donation checkout.",
    email_copy: {
      subject: "Eventbrite fees on The Crucible at Riverside Playhouse",
      body: "Hi Marcus,\n\nSaw that Riverside Community Playhouse has The Crucible opening this March.\n\nWe frequently hear from community theatre artistic directors that generic ticketing platforms like Eventbrite eat 8-10% of gross ticket sales while offering zero theatre-specific features like cast sales tracking or patron donation upsells.\n\nOn The Stage provides an all-in-one ticketing, fundraising, and merchandise suite purpose-built for theatres, saving you thousands in unnecessary platform overhead. Worth a quick 10-min intro?",
      linkedin: "Marcus, congrats on The Crucible! We help community playhouses transition off expensive Eventbrite fees into a dedicated theatre ticketing & fundraising hub. Would love to share how.",
      sdr_battlecard: "HOOK: The Crucible in March.\nPAIN: Losing 8-10% in Eventbrite fees + lack of patron donor capture.\nOFFER: All-in-one theatre box office with integrated donation prompts at checkout."
    }
  },
  {
    organization: "Lincoln Park High School Theatre",
    domain: "lincolnparkhs.edu",
    state: "IL",
    contact_name: "Emily Chen",
    title: "Drama Club Sponsor & Director",
    email: "echen@lincolnparkhs.edu",
    current_show: "Mamma Mia! (April 2026)",
    detected_tool: "SeatYourself / Legacy Web System",
    venue_type: "900-Seat Regional Auditorium",
    pain_point: "Clunky 2005-era checkout UI leading to parent complaints and zero automated email reminders for show weekend.",
    email_copy: {
      subject: "Mamma Mia! ticketing & reserved seating for Lincoln Park High",
      body: "Hi Emily,\n\nSaw Lincoln Park High is preparing for Mamma Mia! this April.\n\nMany educators using legacy platforms like SeatYourself struggle with outdated mobile checkout flows and zero automated email promotion to past alumni and patrons.\n\nOn The Stage equips your drama department with a modern mobile box office, tiered reserved seating, and built-in marketing automation—at zero budget cost to Lincoln Park High. Open to seeing a 5-minute interactive preview?",
      linkedin: "Emily, loved seeing the announcement for Mamma Mia! at Lincoln Park High. We help drama directors modernize legacy ticketing into a seamless mobile box office with $0 upfront cost. Let's connect!",
      sdr_battlecard: "HOOK: Mamma Mia! in April.\nPAIN: Outdated legacy checkout UI & no automated marketing to alumni.\nOFFER: Modern mobile ticketing + automated email sequences to boost opening night turnout."
    }
  }
];

// Code snippets for the Skill Section
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

## What Happens:
1. Ingests CSV & standardizes schema (Company, Domain, Title, Production).
2. Calls n8n Webhook -> Clay Waterfall Enrichment.
3. Resolves Drama Directors & emails via NeverBounce.
4. Claude 3.5 Sonnet generates tailored Problem-Agitate-Solve copy.
5. Upserts Contact to HubSpot/Salesforce & enrolls in sequence.`,

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

// Application State
let currentLeadIndex = 0;
let currentTab = "email";
let isRunning = false;

document.addEventListener("DOMContentLoaded", () => {
  initPresets();
  initTabs();
  initSimulator();
  initCodeViewer();
  initRoiCalculator();
  initCsvDrop();
  renderOutput();
});

// Initialize Presets
function initPresets() {
  const buttons = document.querySelectorAll(".preset-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isRunning) return;
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLeadIndex = parseInt(btn.dataset.preset, 10);
      resetPipelineSteps();
      renderOutput();
    });
  });
}

// Initialize Result Tabs
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentTab = btn.dataset.tab;
      renderOutput();
    });
  });
}

// Render the Output Box
function renderOutput() {
  const lead = PRESET_LEADS[currentLeadIndex];
  const container = document.getElementById("output-display");

  if (currentTab === "email") {
    container.innerHTML = `
      <div class="copy-preview-header">
        <div><strong>To:</strong> ${lead.contact_name} &lt;${lead.email}&gt; &bull; <em>${lead.title}</em></div>
        <div><span class="tag-pill" style="color: #34d399;">PAS Framework</span></div>
      </div>
      <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 12px; color: #fff;">
        Subject: <span class="highlight">${lead.email_copy.subject}</span>
      </div>
      <div class="email-box" style="white-space: pre-wrap;">${lead.email_copy.body}</div>
    `;
  } else if (currentTab === "linkedin") {
    container.innerHTML = `
      <div class="copy-preview-header">
        <div><strong>LinkedIn Direct Message / InMail Connection Note</strong></div>
        <div><span class="tag-pill" style="color: #38bdf8;">Character Count: ${lead.email_copy.linkedin.length}/300</span></div>
      </div>
      <div class="email-box" style="white-space: pre-wrap; background: rgba(255,255,255,0.02); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle);">
${lead.email_copy.linkedin}
      </div>
    `;
  } else if (currentTab === "sdr") {
    container.innerHTML = `
      <div class="copy-preview-header">
        <div><strong>SDR Live Call Battlecard &amp; Phone Script Hook</strong></div>
        <div><span class="tag-pill" style="color: #c084fc;">Rep Assistant</span></div>
      </div>
      <div class="email-box" style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 0.88rem; background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; border-left: 3px solid var(--accent-purple);">
${lead.email_copy.sdr_battlecard}
      </div>
    `;
  } else if (currentTab === "crm") {
    const crmPayload = {
      event: "prospect_pipeline_synced",
      crm_target: "HubSpot / Salesforce",
      status: "QUALIFIED_ENROLLED",
      organization: {
        name: lead.organization,
        domain: lead.domain,
        state: lead.state,
        venue: lead.venue_type,
        current_ticketing_tool: lead.detected_tool
      },
      contact: {
        name: lead.contact_name,
        title: lead.title,
        email: lead.email,
        deliverability: "100% (NeverBounce Validated)"
      },
      ai_intelligence: {
        upcoming_show: lead.current_show,
        identified_pain_point: lead.pain_point,
        copywriting_engine: "Claude-3.5-Sonnet-PAS"
      },
      sequence: {
        platform: "HubSpot Sales Hub",
        sequence_name: "High School Spring 2026 Drama Director Cadence",
        first_touch_scheduled: "Tomorrow at 8:45 AM Local Time"
      }
    };
    container.innerHTML = `
      <div class="copy-preview-header">
        <div><strong>HubSpot / Salesforce API Payload</strong></div>
        <div><span class="tag-pill" style="color: #34d399;">HTTP 200 OK</span></div>
      </div>
      <pre style="font-family: var(--font-mono); font-size: 0.8rem; color: #a5f3fc; overflow-x: auto; max-height: 240px;">${JSON.stringify(crmPayload, null, 2)}</pre>
    `;
  }
}

// Reset Pipeline Progress UI
function resetPipelineSteps() {
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`p-step-${i}`);
    el.className = "progress-step-item";
    if (i === 1) el.classList.add("active");
  }
  document.getElementById("status-indicator").style.background = "#10b981";
  document.getElementById("status-text").innerText = "Ready for Pipeline Execution";
  document.getElementById("timer-text").innerText = "Latency: 0.0s";
}

// Execute Pipeline Simulation
function initSimulator() {
  const runBtn = document.getElementById("btn-run-all");
  runBtn.addEventListener("click", () => {
    if (isRunning) return;
    runPipelineSimulation();
  });
}

function runPipelineSimulation() {
  isRunning = true;
  const lead = PRESET_LEADS[currentLeadIndex];
  const steps = [
    { num: 1, text: `Intaking '${lead.organization}' payload via Webhook...`, delay: 600 },
    { num: 2, text: `Checking HubSpot deduplication & querying Clay waterfall...`, delay: 700 },
    { num: 3, text: `Resolved ICP Persona: ${lead.contact_name} (${lead.title})...`, delay: 700 },
    { num: 4, text: `Scraping arts page: Detected '${lead.current_show}'...`, delay: 900 },
    { num: 5, text: `Claude 3.5 Sonnet synthesized PAS pain points and generated copy...`, delay: 800 },
    { num: 6, text: `Upserted to CRM & enrolled in HubSpot Sales sequence!`, delay: 600 }
  ];

  let currentStep = 0;
  const startTime = Date.now();
  const timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById("timer-text").innerText = `Latency: ${elapsed}s`;
  }, 100);

  function executeNextStep() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      document.getElementById("status-text").innerText = step.text;
      
      // Update breadcrumbs
      for (let i = 1; i <= 6; i++) {
        const el = document.getElementById(`p-step-${i}`);
        if (i < step.num) {
          el.className = "progress-step-item done";
        } else if (i === step.num) {
          el.className = "progress-step-item active";
        } else {
          el.className = "progress-step-item";
        }
      }

      currentStep++;
      setTimeout(executeNextStep, step.delay);
    } else {
      clearInterval(timerInterval);
      for (let i = 1; i <= 6; i++) {
        document.getElementById(`p-step-${i}`).className = "progress-step-item done";
      }
      document.getElementById("status-text").innerText = `Pipeline Complete: ${lead.contact_name} enrolled in sequence!`;
      isRunning = false;
      renderOutput();
    }
  }

  executeNextStep();
}

// Code Viewer Tabs
function initCodeViewer() {
  const codeTabs = document.querySelectorAll(".code-tab-btn");
  const codeContent = document.getElementById("code-content");
  const copyBtn = document.getElementById("btn-copy-code");

  let activeCodeKey = "skill";
  codeContent.textContent = CODE_SNIPPETS[activeCodeKey];

  codeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      codeTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCodeKey = tab.dataset.code;
      codeContent.textContent = CODE_SNIPPETS[activeCodeKey];
    });
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeKey]);
    copyBtn.innerText = "✓ Copied!";
    setTimeout(() => {
      copyBtn.innerHTML = "&#128203; Copy Code";
    }, 2000);
  });
}

// ROI & Pipeline Calculator
function initRoiCalculator() {
  const repSlider = document.getElementById("rep-slider");
  const leadsSlider = document.getElementById("leads-slider");
  const repVal = document.getElementById("rep-val");
  const leadsVal = document.getElementById("leads-val");
  const pipelineResult = document.getElementById("pipeline-result");
  const hoursSaved = document.getElementById("hours-saved");

  function updateRoi() {
    const reps = parseInt(repSlider.value, 10);
    const leads = parseInt(leadsSlider.value, 10);

    repVal.innerText = `${reps} ${reps === 1 ? 'Rep' : 'Reps'}`;
    leadsVal.innerText = `${leads.toLocaleString()} Leads`;

    // Calculation model:
    // Avg 15 minutes saved per lead research = leads * 0.25 hrs
    const totalHours = Math.round(leads * 0.25);
    hoursSaved.innerText = `${totalHours.toLocaleString()} hours`;

    // Qualified pipeline generated:
    // 3.4% qualified booking rate * $8,000 average ACV + rep scaling factor
    const pipeline = Math.round(leads * 0.035 * 8000);
    pipelineResult.innerText = `$${pipeline.toLocaleString()}`;
  }

  repSlider.addEventListener("input", updateRoi);
  leadsSlider.addEventListener("input", updateRoi);
  updateRoi();
}

// CSV Drag and Drop Handler
function initCsvDrop() {
  const dropZone = document.getElementById("csv-drop-zone");
  const fileInput = document.getElementById("csv-file-input");

  dropZone.addEventListener("click", () => fileInput.click());

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#a78bfa";
    dropZone.style.background = "rgba(139, 92, 246, 0.1)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "rgba(255, 255, 255, 0.12)";
    dropZone.style.background = "rgba(255, 255, 255, 0.02)";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(255, 255, 255, 0.12)";
    dropZone.style.background = "rgba(255, 255, 255, 0.02)";
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      alert(`Loaded '${file.name}' with ${lines.length - 1} target leads! Running intake simulation...`);
      runPipelineSimulation();
    };
    reader.readAsText(file);
  }
}
