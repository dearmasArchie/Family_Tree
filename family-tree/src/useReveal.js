import { useEffect } from 'react';

// Adds "is-visible" to every [data-reveal] element the first time it scrolls into view.
// CSS decides what that means: a fade-up for sections, a staggered start for tree cards,
// lines drawing themselves for the tree. `rerunKey` (the page) re-scans after navigation.
export default function useReveal(rerunKey) {
  useEffect(() => {
    const targets = [...document.querySelectorAll('[data-reveal]:not(.is-visible)')];
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rerunKey]);
}
