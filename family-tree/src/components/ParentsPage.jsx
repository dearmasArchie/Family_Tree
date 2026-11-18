import { Link } from 'react-router-dom';
import { formatDate, lifeDates } from '../data/dates';
import PersonCard from './PersonCard';

export default function ParentsPage({ people, parentGeneration, childGeneration, onBack }) {
  return (
    <div className="parents-page">
      <div className="page-header-row" onClick={onBack} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && onBack()}>
        <h1>{parentGeneration.label}</h1>
        <p className="page-description">
          Ernesto and Jovita's eight children, from eldest to youngest. Open any of them for their full story and family.
        </p>
      </div>

      <section className="parent-details">
        {parentGeneration.members.map((id) => {
          const person = people[id];
          return (
            <article key={id} className="parent-detail-card">
              <div className="parent-detail-head">
                <div className="parent-detail-photo">
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} />
                  ) : (
                    <span className="initials">{person.initials}</span>
                  )}
                </div>
                <div className="parent-detail-info">
                  <h2>{person.name}</h2>
                  <p className="detail-role">{person.role}</p>
                  <p className="detail-dates">
                    {lifeDates(person)}
                  </p>
                </div>
              </div>

              <div className="parent-detail-grid">
                {person.birthplace && (
                  <div>
                    <strong>Birthplace</strong>
                    <span>{person.birthplace}</span>
                  </div>
                )}
                {person.occupation && (
                  <div>
                    <strong>Occupation</strong>
                    <span>{person.occupation}</span>
                  </div>
                )}
                {person.spouse && (
                  <div>
                    <strong>Spouse</strong>
                    <span>{person.spouse}</span>
                  </div>
                )}
                {person.died && (
                  <div>
                    <strong>Passed</strong>
                    <span>{formatDate(person.died)}</span>
                  </div>
                )}
              </div>

              {person.bio ? <p className="parent-detail-bio">{person.bio}</p> : null}
              <Link to={`/person/${id}`} className="detail-button">
                View details
              </Link>
            </article>
          );
        })}
      </section>

      {childGeneration ? (
        <section className="children-section">
          <h2>Children of this generation</h2>
          <div className="cards-row children-row">
            {childGeneration.members.map((id) => (
              <PersonCard key={id} id={id} person={people[id]} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
