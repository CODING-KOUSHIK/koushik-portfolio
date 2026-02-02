// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Estimate calculator
const rates = {
  transcription: 1,
  srt: 1.2,
  elan: 1.5,
  recording: 2,
  scraping: 5,
  automation: 6
};

const form = document.getElementById("estimateForm");
const estimateValue = document.getElementById("estimateValue");

form.addEventListener("input", () => {
  const service = serviceSelect.value;
  const qty = Number(quantity.value || 0);

  if (!qty) {
    estimateValue.textContent = "—";
    return;
  }

  const base = rates[service] * qty;
  estimateValue.textContent = `₹${base} – ₹${Math.round(base * 1.4)}`;
});

// Mailto submit
form.addEventListener("submit", e => {
  e.preventDefault();

  const body = `
Service: ${service.value}
Quantity: ${quantity.value} ${unit.value}
Output: ${output.value}
`;

  location.href =
    "mailto:koushik271999@gmail.com" +
    "?subject=Biswas Tech – Project Request" +
    "&body=" + encodeURIComponent(body);
});
