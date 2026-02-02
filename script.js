// Loader
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
});

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
});

// Counters
document.querySelectorAll("[data-counter]").forEach(el => {
  const target = +el.dataset.counter;
  let count = 0;
  const interval = setInterval(() => {
    count += Math.ceil(target / 80);
    if (count >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = count;
    }
  }, 30);
});

// Fake reviews
const reviews = [
  "Outstanding Bengali transcription quality.",
  "Perfect ELAN datasets for our AI training.",
  "Clean automation scripts. Production ready.",
  "Very professional communication and delivery.",
  "Accurate subtitles delivered ahead of time."
];

const track = document.getElementById("reviewsTrack");

reviews.forEach((text, i) => {
  const div = document.createElement("div");
  div.className = "review";
  div.innerHTML = `<strong>Client ${i+1}</strong><p>${text}</p>`;
  track.appendChild(div);
});

// Auto-scroll reviews
let offset = 0;
setInterval(() => {
  offset -= 1;
  track.style.transform = `translateX(${offset}px)`;
  if (Math.abs(offset) > track.scrollWidth / 2) offset = 0;
}, 30);
