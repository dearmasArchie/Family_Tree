import { Link } from 'react-router-dom';
import { parseBorn } from '../data/dates';
import { people } from '../data/people';
import './Footer.css';

const SECTIONS = [
  { hash: 'timeline', label: 'Timeline' },
  { hash: 'birthdays', label: 'Birthdays' },
  { hash: 'family-tree', label: 'Family tree' },
  { hash: 'album', label: 'Album' },
];

const firstYear = Math.min(...Object.values(people).map((person) => parseBorn(person.born).year || Infinity));

export default function Footer() {
  return (
    <footer className="site-footer" data-reveal>
      <div className="site-footer-inner">
        <div className="site-footer-sign">
          <p className="site-footer-name">De Armas</p>
          <p className="site-footer-line">Made with love, for those who came before and those yet to come.</p>
        </div>

        <nav className="site-footer-links" aria-label="Sections">
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.hash}>
                <Link to={{ pathname: '/', hash: section.hash }}>{section.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-footer-bottom">
        <span>Bulacan · Since {firstYear}</span>
        <button type="button" className="site-footer-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span aria-hidden="true">↑</span> Back to top
        </button>
      </div>
    </footer>
  );
}
