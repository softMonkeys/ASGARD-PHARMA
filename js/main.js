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
  { threshold: 0.2 }
);

reveals.forEach((el) => observer.observe(el));

// ===== Dynamic footer year =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

document.querySelectorAll('.flip-card').forEach(card => {

  // Remove wiggle-hint when card is flipped
  card.addEventListener('mouseenter', function () {
    card.classList.add('flipped');
  });
  card.addEventListener('mouseleave', function () {
    card.classList.remove('flipped');
  });
});

(function () {
  const section = document.getElementById("problemsAndSolution");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".flip-card"));
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // add class to enable styles
        section.classList.add("hint-flip");

        // staggered animation: set per-card animation-delay inline
        cards.forEach((card, i) => {
          const inner = card.querySelector(".flip-card-inner");
          if (!inner) return;
          const delay = i * 120; // ms stagger
          inner.style.animationDelay = `${delay}ms`;
          // Ensure animation runs by forcing reflow (safe)
          void inner.offsetWidth;

          // cleanup: remove any inline animation/transform left behind
          const cleanup = () => {
            inner.style.animationDelay = "";
            inner.style.animationName = "";
            inner.style.animationDuration = "";
            inner.style.animationTimingFunction = "";
            inner.style.animationFillMode = "";
            inner.style.transform = ""; // clear any inline transform
          };

          // remove hint styles when animation ends or is cancelled
          const onEnd = () => {
            cleanup();
            inner.removeEventListener("animationend", onEnd);
            inner.removeEventListener("animationcancel", onEnd);
            // if this was the last card, remove the section hint class so CSS rules no longer apply
            if (i === cards.length - 1) {
              // small delay to ensure browser has applied final cleanup
              setTimeout(() => section.classList.remove("hint-flip"), 40);
            }
            // clear fallback if it exists
            if (fallbackId) clearTimeout(fallbackId);
          };
          inner.addEventListener("animationend", onEnd);
          inner.addEventListener("animationcancel", onEnd);

          // Fallback: compute timeout from the element's actual CSS animation-duration + delay
          const style = getComputedStyle(inner);
          const cssDur = parseFloat(style.animationDuration || "0") * 1000;
          const cssDelay = parseFloat(style.animationDelay || "0") * 1000;
          const fallbackMs = Math.max(cssDur + cssDelay, 800) + 80; // small buffer
          const fallbackId = setTimeout(() => {
            cleanup();
            if (i === cards.length - 1) section.classList.remove("hint-flip");
            inner.removeEventListener("animationend", onEnd);
            inner.removeEventListener("animationcancel", onEnd);
          }, fallbackMs);
        });

        // Only trigger once
        obs.unobserve(section);
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
})();

// Smooth scroll nav links with sticky header offset
(function () {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav__list a[href^="#"]');

  if (!navLinks.length) return;

  function getHeaderOffset() {
    return header ? header.offsetHeight : 0;
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const offset = getHeaderOffset() + 12; // small extra spacing
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });

      // update URL hash without jump
      history.pushState(null, '', href);
    });
  });
})();