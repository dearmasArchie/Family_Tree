import { Link } from 'react-router-dom';
import PersonCard from './PersonCard';

export default function GenerationSection({ label, memberIds, people, actionTo, isCouple = false }) {

  return (
    <section className="generation" data-reveal="cards">
      <div className="gen-label">
        <span>{label}</span>
        {actionTo ? (
          <Link to={actionTo} className="generation-action">
            See all eight
          </Link>
        ) : null}
      </div>
      <div className={`cards-row ${isCouple ? 'couple-row' : 'is-grid'}`}>
        {isCouple ? (
          <>
            <PersonCard key={memberIds[0]} id={memberIds[0]} person={people[memberIds[0]]} index={0} />
            <div className="couple-joiner" role="img" aria-label="married">
              <svg viewBox="0 0 28 18" width="28" height="18" aria-hidden="true">
                <circle cx="10" cy="9" r="6.5" />
                <circle cx="18" cy="9" r="6.5" />
              </svg>
            </div>
            <PersonCard key={memberIds[1]} id={memberIds[1]} person={people[memberIds[1]]} index={1} />
          </>
        ) : (
          memberIds.map((id, index) => (
            <PersonCard key={id} id={id} person={people[id]} index={index} />
          ))
        )}
      </div>
    </section>
  );
}
