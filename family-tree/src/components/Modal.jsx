import { useEffect } from 'react';

export default function Modal({ person, onClose }) {
  useEffect(() => {
    if (!person) return undefined;

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEsc);
    };
  }, [person, onClose]);

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
    <div className="modal-backdrop open" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-photo">
          {person.photo ? (
            <img src={person.photo} alt={person.name} />
          ) : (
            <span className="initials">{person.initials}</span>
          )}
        </div>

        <h2>{person.name}</h2>
        <p className="modal-meta">{person.died ? `${person.born} – ${person.died}` : `b. ${person.born}`}</p>

        <div className="modal-divider"></div>

        <div className="modal-fields">
          {fields.map((field) => (
            <div className="modal-field" key={field.label}>
              <span className="modal-field-label">{field.label}</span>
              <span className="modal-field-value">{field.value}</span>
            </div>
          ))}
        </div>

        {person.bio ? (
          <>
            <div className="modal-divider"></div>
            <p className="modal-bio">{person.bio}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
