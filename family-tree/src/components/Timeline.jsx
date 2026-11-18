import { Link } from 'react-router-dom';
import { getToday, upcomingBirthdays } from '../data/birthdays';
import { parseBorn } from '../data/dates';
import { people } from '../data/people';
import './Timeline.css';

const entries = Object.entries(people)
  .map(([id, person]) => ({ id, name: person.name, ...parseBorn(person.born) }))
  .filter((entry) => entry.year)
  .sort((a, b) => a.sortKey - b.sortKey);

// The next living person to have a birthday gets a softly pulsing dot.
const nextBirthdayId = upcomingBirthdays(getToday(), 20).find((b) => !b.passed)?.id;

function TimelineRow({ hidden }) {
  return (
    <ol className="timeline-row" aria-hidden={hidden || undefined}>
      {entries.map((entry) => (
        <li key={entry.id} className="timeline-item">
          <Link
            to={`/person/${entry.id}`}
            className={`timeline-entry${entry.id === nextBirthdayId ? ' is-next' : ''}`}
            tabIndex={hidden ? -1 : undefined}
            title={entry.id === nextBirthdayId ? 'Next birthday' : undefined}
          >
            <span className="timeline-year">{entry.year}</span>
            <span className="timeline-dot" aria-hidden="true" />
            <span className="timeline-name">{entry.name}</span>
            <span className="timeline-date">{entry.dayMonth}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function Timeline() {
  return (
    <section id="timeline" className="timeline" aria-labelledby="timeline-title" data-reveal>
      <div className="timeline-head">
        <h2 id="timeline-title" className="timeline-title">
          Born into the family
        </h2>
      </div>

      <div className="timeline-viewport" data-parallax>
        {/* Two copies side by side; the track slides by one copy's width and loops seamlessly. */}
        <div className="timeline-track">
          <TimelineRow />
          <TimelineRow hidden />
        </div>
      </div>
    </section>
  );
}
