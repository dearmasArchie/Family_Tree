import PersonCard from './PersonCard';

export default function GenerationSection({ label, memberIds, people, onSelect, onHeaderClick }) {
  const isCouple = label.includes('Grandparents') && memberIds.length === 2;

  return (
    <section className="generation">
      <div className="gen-label">
        <span>{label}</span>
        {onHeaderClick ? (
          <button type="button" className="generation-action" onClick={onHeaderClick}>
            View parents page
          </button>
        ) : null}
      </div>
      <div className={`cards-row ${isCouple ? 'couple-row' : ''}`}>
        {isCouple ? (
          <>
            <PersonCard key={memberIds[0]} person={people[memberIds[0]]} onClick={() => onSelect(memberIds[0])} />
            <div className="heart-divider">✦</div>
            <PersonCard key={memberIds[1]} person={people[memberIds[1]]} onClick={() => onSelect(memberIds[1])} />
          </>
        ) : (
          memberIds.map((id) => (
            <PersonCard key={id} person={people[id]} onClick={() => onSelect(id)} />
          ))
        )}
      </div>
    </section>
  );
}
