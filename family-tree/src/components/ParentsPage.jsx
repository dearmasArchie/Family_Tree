import PersonCard from './PersonCard';

export default function ParentsPage({ people, parentGeneration, childGeneration, onBack, onSelect }) {
  return (
    <div className="parents-page">
      <div className="page-header-row" onClick={onBack} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && onBack()}>
        <h1>{parentGeneration.label}</h1>
        <p className="page-description">
          This page shows the parents' generation using the information from the data source, and also lists their children.
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
                    {person.died ? `${person.born} – ${person.died}` : `b. ${person.born}`}
                  </p>
                </div>
              </div>

              <div className="parent-detail-grid">
                <div>
                  <strong>Birthplace</strong>
                  <span>{person.birthplace}</span>
                </div>
                <div>
                  <strong>Occupation</strong>
                  <span>{person.occupation}</span>
                </div>
                {person.spouse && (
                  <div>
                    <strong>Spouse</strong>
                    <span>{person.spouse}</span>
                  </div>
                )}
                {person.died && (
                  <div>
                    <strong>Passed</strong>
                    <span>{person.died}</span>
                  </div>
                )}
              </div>

              {person.bio ? <p className="parent-detail-bio">{person.bio}</p> : null}
              <button type="button" className="detail-button" onClick={() => onSelect(id)}>
                View details
              </button>
            </article>
          );
        })}
      </section>

      <section className="children-section">
        <h2>Children of this generation</h2>
        <div className="cards-row children-row">
          {childGeneration.members.map((id) => (
            <PersonCard key={id} person={people[id]} onClick={() => onSelect(id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
