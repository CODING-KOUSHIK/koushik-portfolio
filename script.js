const EMAIL_TO = "koushik271999@gmail.com";

function moneyINR(min, max) {
  const fmt = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

// You can tune these base rates later.
const baseRates = {
  transcription: { perMinute: [10, 20] },
  srt: { perMinute: [12, 24] },
  elan: { perMinute: [14, 28] },
  recording: { perMinute: [8, 16] },
  scraping: { perTask: [800, 2500] },
  automation: { perTask: [700, 2200] }
};

function turnaroundMultiplier(t) {
  if (t === "fast") return 1.25;
  if (t === "urgent") return 1.6;
  return 1.0;
}

function estimate(service, qty, unit, turnaround) {
  const mult = turnaroundMultiplier(turnaround);

  // Convert to a comparable basis
  if (["transcription", "srt", "elan", "recording"].includes(service)) {
    let minutes = qty;
    if (unit === "hours") minutes = qty * 60;
    if (unit === "pages") minutes = qty * 4; // rough fallback
    if (unit === "tasks") minutes = qty * 10;

    const [lo, hi] = baseRates[service].perMinute;
    return [minutes * lo * mult, minutes * hi * mult];
  }

  // Task-based
  const [lo, hi] = baseRates[service].perTask;
  const tasks = unit === "tasks" ? qty : qty; // keep simple
  return [tasks * lo * mult, tasks * hi * mult];
}

function serviceLabel(value) {
  const map = {
    transcription: "Bengali Transcription + QA",
    srt: "SRT Subtitles (Create + Sync)",
    elan: "ELAN Segmentation & Labeling",
    recording: "Conversation Recordings (2-person)",
    scraping: "Web Scraping (Static/Dynamic)",
    automation: "Python Automation + Data Cleaning"
  };
  return map[value] || value;
}

function outputLabel(value) {
  const map = {
    doc: "Google Doc / Word",
    srt: "SRT",
    elan: "ELAN (EAF + exports)",
    excel: "Excel / CSV / JSON",
    script: "Python script + outputs"
  };
  return map[value] || value;
}

function updateEstimateUI() {
  const service = document.getElementById("service").value;
  const qty = Number(document.getElementById("quantity").value || 0);
  const unit = document.getElementById("unit").value;
  const turnaround = document.getElementById("turnaround").value;

  const out = document.getElementById("estimateValue");
  if (!qty || qty < 1) { out.textContent = "—"; return; }

  const [min, max] = estimate(service, qty, unit, turnaround);
  out.textContent = moneyINR(min, max);
}

function openEmail(subject, body) {
  const url =
    `mailto:${encodeURIComponent(EMAIL_TO)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

// Theme toggle (stored)
(function initTheme(){
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
})();

document.getElementById("themeToggle").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

document.getElementById("year").textContent = new Date().getFullYear();

["service","quantity","unit","turnaround"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateEstimateUI);
});
updateEstimateUI();

// Estimate form submit -> prefilled email
document.getElementById("estimateForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const service = document.getElementById("service").value;
  const qty = document.getElementById("quantity").value;
  const unit = document.getElementById("unit").value;
  const turnaround = document.getElementById("turnaround").value;
  const output = document.getElementById("output").value;

  const [min, max] = estimate(service, Number(qty), unit, turnaround);

  const subject = `Project Request: ${serviceLabel(service)}`;
  const body =
`Hello Koushik,

I need: ${serviceLabel(service)}
Quantity: ${qty} ${unit}
Turnaround: ${turnaround}
Output: ${outputLabel(output)}

Estimated range shown on site: ${moneyINR(min, max)}

Additional details:
- Source/link/files:
- Guidelines (if any):
- Deadline date/time:
- Any special requirements:

Thanks,
`;

  openEmail(subject, body);
});

// Intake form submit -> prefilled email
document.getElementById("intakeForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("clientName").value.trim();
  const email = document.getElementById("clientEmail").value.trim();
  const msg = document.getElementById("clientMsg").value.trim();

  const subject = `New Inquiry from ${name}`;
  const body =
`Hello Koushik,

Name: ${name}
Email: ${email}

Project details:
${msg}

Best regards,
${name}
`;
  openEmail(subject, body);
});
