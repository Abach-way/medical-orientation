// Lightweight animation helpers (restored as optional).
// This file is safe to include but not required; most UI logic is in index.html.

(function () {
  const prefersReducedMotion = (() => {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch {
      return false;
    }
  })();

  function observeElements() {
    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll('.card, .test-card, .stat-card');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    for (const el of elements) observer.observe(el);
  }

  function shakeElement(el) {
    if (!el || prefersReducedMotion) return;
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 320, easing: 'ease-in-out' }
    );
  }

  document.addEventListener('DOMContentLoaded', observeElements);

  window.AnimationUtils = {
    observeElements,
    shakeElement,
  };
})();
