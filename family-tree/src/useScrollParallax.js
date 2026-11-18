import { useEffect } from 'react';

// Drives all scroll parallax with two CSS variables, updated once per frame:
//   --sy on <html>: page scroll in px (used by the hero, which sits at the top).
//   --p on every [data-parallax] element: where its centre is on screen,
//       -1 (one screen above centre) .. 0 (centred) .. 1 (one screen below), clamped.
// CSS turns those numbers into small transforms, so nothing here touches layout.
// `rerunKey` (e.g. the current page) re-measures when different elements are on screen.
export default function useScrollParallax(rerunKey) {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      root.style.setProperty('--sy', window.scrollY);
      const viewH = window.innerHeight;
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const p = (rect.top + rect.height / 2 - viewH / 2) / viewH;
        el.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [rerunKey]);
}
