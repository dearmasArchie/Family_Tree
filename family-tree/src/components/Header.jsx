import { useEffect, useState } from 'react';
import './Header.css';

export default function Header({ onHome }) {
  const [scrolled, setScrolled] = useState(false);

  // Collapse the subtitle once the page has scrolled a little.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
      <button type="button" className="site-nav-brand" onClick={onHome}>
        <span className="site-nav-name">De Armas</span>
        <span className="site-nav-sub-wrap" aria-hidden={scrolled}>
          <span className="site-nav-sub">A living record of our family</span>
        </span>
      </button>
    </header>
  );
}
