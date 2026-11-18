import { Link } from 'react-router-dom';
import { formatDate } from '../data/dates';
import usePageTransition from '../usePageTransition';

export default function PersonCard({ id, person, index = 0 }) {
  const hasPhoto = Boolean(person.photo);
  const [firstName, ...lastName] = person.name.split(' ');
  const to = `/person/${id}`;
  const openWithMorph = usePageTransition();

  return (
    <Link
      to={to}
      // the photo circle grows into the profile photo on the person's page
      onClick={(event) => openWithMorph(event, to, '.card-photo')}
      className={`card ${person.died ? 'deceased' : ''}`}
      data-person={id}
      style={{ '--i': index }}
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
        {person.died ? (
          <>
            {formatDate(person.born)} –<br />
            {formatDate(person.died)}
          </>
        ) : (
          `b. ${formatDate(person.born)}`
        )}
      </div>
      <div className="card-foot">
        {person.role && <span className="card-role">{person.role}</span>}
        {person.died && <span className="card-memory">In loving memory</span>}
      </div>
    </Link>
  );
}
