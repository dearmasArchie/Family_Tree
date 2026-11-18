import { Link } from 'react-router-dom';
import { ageInYears, formatDate, parseBorn, toDate } from '../data/dates';
import { byBirth, childrenOf, parentsOf, people, siblingsOf, spouseIdOf } from '../data/people';
import usePageTransition from '../usePageTransition';
import './PersonDetail.css';

// First name, keeping a suffix so Ernesto Jr. isn't confused with his father.
const firstName = (id) => {
  const name = people[id].name;
  const suffix = name.match(/\s(Jr\.|Sr\.|III|II)$/)?.[1];
  return suffix ? `${name.split(' ')[0]} ${suffix}` : name.split(' ')[0];
};
const joinNames = (ids) => ids.map(firstName).join(' & ');

// `morph` names the avatar for the page-change animation: the clicked photo grows into this one.
function Avatar({ person, size = 'md', morph = false }) {
  return (
    <span
      className={`profile-avatar is-${size}${person.died ? ' is-remembered' : ''}`}
      aria-hidden="true"
      style={morph ? { viewTransitionName: 'person-photo' } : undefined}
    >
      {person.photo ? <img src={person.photo} alt="" /> : person.initials}
    </span>
  );
}

// A small clickable person in the family mini-tree.
function Node({ id, current = false }) {
  const person = people[id];
  const to = `/person/${id}`;
  const crossfade = usePageTransition();
  if (current) {
    return (
      <span className="mini-node is-current" aria-current="page">
        <Avatar person={person} size="lg" />
        <span className="mini-node-name">{firstName(id)}</span>
      </span>
    );
  }
  return (
    <Link to={to} onClick={(event) => crossfade(event, to)} className="mini-node">
      {/* no morph here: the big profile photo already carries the name, and names must be unique */}
      <Avatar person={person} />
      <span className="mini-node-name">{firstName(id)}</span>
    </Link>
  );
}

// "5th child of Ernesto & Jovita" / "Eldest child of Arnold" / "Patriarch"
function relationLine(id, person) {
  const parents = parentsOf(id);
  if (!parents.length) return person.role;
  const role = ['Eldest', 'Youngest'].includes(person.role) ? `${person.role} child` : person.role;
  return `${role} of ${joinNames(parents)}`;
}

// "Born 23 Jul 1968 · 58 years old" or "1920 – 1998 · Lived to 78"
function lifeLine(person) {
  if (person.died) {
    const lived = ageInYears(person.born, toDate(person.died));
    const years = `${parseBorn(person.born).year} – ${parseBorn(person.died).year}`;
    return lived !== null ? `${years} · Lived to ${lived}` : years;
  }
  const age = ageInYears(person.born);
  return age !== null ? `Born ${formatDate(person.born)} · ${age} years old` : `Born ${formatDate(person.born)}`;
}

export default function PersonDetail({ id, person }) {
  const crossfade = usePageTransition();
  if (!person) return null;
  const home = { pathname: '/', hash: 'family-tree' };

  const parents = parentsOf(id);
  const children = byBirth(childrenOf(id));
  const spouseId = spouseIdOf(id);
  const siblings = siblingsOf(id);

  // Born / Age / Birthplace / Occupation / Children: empty ones are left out.
  const facts = [
    { label: 'Born', value: formatDate(person.born) },
    person.died
      ? { label: 'Passed', value: formatDate(person.died) }
      : ageInYears(person.born) !== null && { label: 'Age', value: ageInYears(person.born) },
    person.died && ageInYears(person.born, toDate(person.died)) !== null && {
      label: 'Lived to',
      value: ageInYears(person.born, toDate(person.died)),
    },
    person.birthplace && { label: 'Birthplace', value: person.birthplace },
    person.occupation && { label: 'Occupation', value: person.occupation },
    person.spouse && !spouseId && { label: 'Spouse', value: person.spouse },
    children.length > 0 && { label: 'Children', value: children.length },
  ].filter(Boolean);

  // Previous / next sibling in birth order.
  const birthOrder = byBirth([id, ...siblings]);
  const place = birthOrder.indexOf(id);
  const prevId = place > 0 ? birthOrder[place - 1] : null;
  const nextId = place < birthOrder.length - 1 ? birthOrder[place + 1] : null;

  return (
    <article className="profile">
      <Link to={home} onClick={(event) => crossfade(event, home)} className="profile-back">
        ← Family tree
      </Link>

      <header className="profile-head">
        <Avatar person={person} size="xl" morph />
        <div className="profile-title">
          <h1 className="profile-name">{person.name}</h1>
          <p className="profile-relation">{relationLine(id, person)}</p>
          <p className="profile-life">
            {lifeLine(person)}
            {person.died ? <span className="profile-memory"> · In loving memory</span> : null}
          </p>
        </div>
      </header>

      <dl className="profile-facts">
        {facts.map((fact) => (
          <div className="profile-fact" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {person.bio ? <p className="profile-bio">{person.bio}</p> : null}

      {parents.length || children.length || spouseId || siblings.length ? (
        <section className="profile-family" aria-labelledby="family-heading">
          <h2 id="family-heading" className="profile-section-title">
            Family
          </h2>

          <div className="mini-tree">
            {parents.length ? (
              <>
                <span className="mini-label">Parents</span>
                <ul className="mini-row">
                  {parents.map((parentId) => (
                    <li key={parentId}>
                      <Node id={parentId} />
                    </li>
                  ))}
                </ul>
                <span className="mini-stem" aria-hidden="true" />
              </>
            ) : null}

            <div className="mini-row is-self">
              <Node id={id} current />
              {spouseId ? (
                <>
                  <span className="mini-rings" role="img" aria-label="married to">
                    <svg viewBox="0 0 28 18" width="24" height="16" aria-hidden="true">
                      <circle cx="10" cy="9" r="6.5" />
                      <circle cx="18" cy="9" r="6.5" />
                    </svg>
                  </span>
                  <Node id={spouseId} />
                </>
              ) : null}
            </div>

            {children.length ? (
              <>
                <span className="mini-stem" aria-hidden="true" />
                <ul className={`mini-row mini-children${children.length > 1 ? ' has-bar' : ''}`}>
                  {children.map((childId) => (
                    <li key={childId}>
                      <Node id={childId} />
                    </li>
                  ))}
                </ul>
                <span className="mini-label">Children</span>
              </>
            ) : null}
          </div>

          {siblings.length ? (
            <div className="mini-siblings">
              <span className="mini-label">Siblings</span>
              <ul className="mini-row is-loose">
                {byBirth(siblings).map((siblingId) => (
                  <li key={siblingId}>
                    <Node id={siblingId} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {prevId || nextId ? (
        <nav className="profile-pager" aria-label="Brothers and sisters in birth order">
          {prevId ? (
            <Link
              to={`/person/${prevId}`}
              onClick={(event) => crossfade(event, `/person/${prevId}`)}
              className="profile-pager-link is-prev"
            >
              <span className="profile-pager-dir">← {people[prevId].role}</span>
              <span className="profile-pager-name">{people[prevId].name}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextId ? (
            <Link
              to={`/person/${nextId}`}
              onClick={(event) => crossfade(event, `/person/${nextId}`)}
              className="profile-pager-link is-next"
            >
              <span className="profile-pager-dir">{people[nextId].role} →</span>
              <span className="profile-pager-name">{people[nextId].name}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
