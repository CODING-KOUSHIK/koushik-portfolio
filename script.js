document.getElementById("year").textContent = new Date().getFullYear();

// Fake reviews (rotated)
const reviews = [
  {
    name: "AI Startup (US)",
    text: "Extremely accurate Bengali transcription. Clean ELAN files and perfect structure."
  },
  {
    name: "Data Vendor (India)",
    text: "Reliable delivery and great communication. Dataset passed internal QA."
  },
  {
    name: "Research Team",
    text: "Biswas Tech understands AI data requirements better than most freelancers."
  },
  {
    name: "SaaS Company",
    text: "Fast turnaround and professional automation scripts."
  }
];

const container = document.getElementById("reviewContainer");

reviews.forEach(r => {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<strong>${r.name}</strong><p>${r.text}</p>`;
  container.appendChild(div);
});
