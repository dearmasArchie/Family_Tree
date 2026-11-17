export default function PersonCard({ person, onClick }) {
  const hasPhoto = Boolean(person.photo);
  const [firstName, ...lastName] = person.name.split(' ');

  return (
    <button
      type="button"
      className={`card ${person.died ? 'deceased' : ''}`}
      onClick={onClick}
    >
      <div className={`card-photo ${hasPhoto ? 'has-photo' : ''}`}>
        {hasPhoto ? (
          <img src={person.photo} alt={person.name} />
        ) : (
          <span className="initials">{person.initials}</span>
        )}
      </div>
      <div className="card-name">
        {firstName}
        <br />
        {lastName.join(' ')}
      </div>
      <div className="card-dates">
        {person.died ? `${person.born} – ${person.died}` : `b. ${person.born}`}
      </div>
      {person.role && <span className="card-role">{person.role}</span>}
    </button>
  );
}
