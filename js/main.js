// ===== Scroll reveal animation =====
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.1 }
);

reveals.forEach((el) => observer.observe(el));

// ===== Dynamic footer year =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
