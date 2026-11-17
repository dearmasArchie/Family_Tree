export default function Header({ onHome }) {
  return (
    <header
      className={onHome ? 'header-clickable' : ''}
      role={onHome ? 'button' : undefined}
      tabIndex={onHome ? 0 : undefined}
      onClick={onHome}
      onKeyDown={onHome ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onHome();
        }
      } : undefined}
    >
      <h1>De Armas<em></em></h1>
      <p className="header-sub">A Living Record of Our Family</p>
    </header>
  );
}

