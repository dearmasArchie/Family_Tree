export default function PersonDetail({ person, onBack }) {
  if (!person) {
    return null;
  }

  const fields = [
    { label: 'Birthplace', value: person.birthplace },
    { label: 'Occupation', value: person.occupation },
    person.spouse && { label: 'Spouse', value: person.spouse },
    person.died && { label: 'Passed', value: person.died }
  ].filter(Boolean);

  return (
    <div className="person-detail-page">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="detail-container">
        <div className="detail-photo">
          {person.photo ? (
            <img src={person.photo} alt={person.name} />
          ) : (
            <span className="initials">{person.initials}</span>
          )}
        </div>

        <div className="detail-content">
          <h1>{person.name}</h1>
          <p className="detail-role">{person.role}</p>
          <p className="detail-dates">
            {person.died ? `${person.born} – ${person.died}` : `b. ${person.born}`}
          </p>

          <div className="detail-divider"></div>

          <div className="detail-fields">
            {fields.map((field) => (
              <div className="detail-field" key={field.label}>
                <span className="detail-field-label">{field.label}</span>
                <span className="detail-field-value">{field.value}</span>
              </div>
            ))}
          </div>

          {person.bio ? (
            <>
              <div className="detail-divider"></div>
              <p className="detail-bio">{person.bio}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
