import { useEffect, useRef, useState } from 'react';
import { getToday, upcomingBirthdays } from '../data/birthdays';
import { monthName } from '../data/dates';
import './Birthdays.css';
import Bunting from './Bunting';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function whenLabel({ daysAway, next }) {
  if (daysAway === 0) return 'Today';
  if (daysAway === 1) return 'Tomorrow';
  if (daysAway < 7) return `This ${WEEKDAYS[next.getDay()]}`;
  if (daysAway < 56) return `In ${Math.round(daysAway / 7)} weeks`;
  const months = Math.round(daysAway / 30.4);
  return months <= 1 ? 'In a month' : `In ${months} months`;
}

function ribbonText(b) {
  const on = b.daysAway === 0 ? 'today' : b.daysAway === 1 ? 'tomorrow' : b.daysAway < 7 ? `on ${WEEKDAYS[b.next.getDay()]}` : `on ${b.day} ${monthName(b.month)}`;
  if (b.passed) return `Remembering ${b.firstName}, who would have turned ${b.age} ${on}`;
  if (b.daysAway === 0) return `Happy birthday, ${b.firstName}! ${b.age} today`;
  return `${b.firstName} turns ${b.age} ${on}`;
}

// A short burst of paper confetti, shown once per day per browser.
function useConfetti(ref, active, todayKey) {
  useEffect(() => {
    const host = ref.current;
    if (!active || !host) return undefined;
    const storageKey = `birthday-confetti-${todayKey}`;
    try {
      if (localStorage.getItem(storageKey)) return undefined;
    } catch {
      // storage blocked: still celebrate
    }
    const colours = ['#1f4d3a', '#8c5b15', '#c79a4e', '#161616', '#a9a9a4'];
    const pieces = Array.from({ length: 48 }, (_, i) => {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${8 + Math.random() * 84}%`;
      piece.style.background = colours[i % colours.length];
      piece.style.setProperty('--fall', `${180 + Math.random() * 220}px`);
      piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`);
      piece.style.setProperty('--spin', `${(Math.random() - 0.5) * 720}deg`);
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      host.appendChild(piece);
      return piece;
    });
    // Only mark today as celebrated once the burst has played (so an interrupted burst plays again).
    const timer = setTimeout(() => {
      pieces.forEach((piece) => piece.remove());
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        // ignore
      }
    }, 3200);
    return () => {
      clearTimeout(timer);
      pieces.forEach((piece) => piece.remove());
    };
  }, [ref, active, todayKey]);
}

export default function Birthdays() {
  const today = getToday();
  const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const list = upcomingBirthdays(today);
  const confettiRef = useRef(null);
  const celebrating = list.some((b) => b.daysAway === 0 && !b.passed);
  useConfetti(confettiRef, celebrating, todayKey);

  // When the "next up" person has changed since this browser last visited, their page flips in.
  const firstId = list[0]?.id;
  const [flipId] = useState(() => {
    try {
      const previous = localStorage.getItem('birthday-next-up');
      return previous && firstId && previous !== firstId ? firstId : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    try {
      if (firstId) localStorage.setItem('birthday-next-up', firstId);
    } catch {
      // storage blocked: no flip next time
    }
  }, [firstId]);

  if (!list.length) return null;
  const [first, ...rest] = list;

  return (
    <section id="birthdays" className={`birthdays${celebrating ? ' is-celebrating' : ''}`} aria-labelledby="birthdays-title" data-reveal>
      <Bunting />
      <h2 id="birthdays-title" className="birthdays-title">
        Coming birthdays
      </h2>

      <div className={`birthday-ribbon${first.daysAway === 0 && !first.passed ? ' is-today' : ''}${first.passed ? ' is-remembering' : ''}`}>
        <span className="birthday-ribbon-tag">{first.daysAway === 0 ? 'Today' : 'Next up'}</span>
        <span className="birthday-ribbon-text">{ribbonText(first)}</span>
        {rest.length ? (
          <span className="birthday-ribbon-then">Then {rest.map((b) => b.firstName).join(' · ')}</span>
        ) : null}
      </div>

      <ol className="birthday-pages" ref={confettiRef}>
        {list.map((b, index) => (
          <li
            key={b.id}
            className={`birthday-page${b.daysAway === 0 && !b.passed ? ' is-today' : ''}${b.passed ? ' is-remembering' : ''}${b.id === flipId ? ' is-flipping' : ''}`}
            style={{ '--tilt': `${[-2, 1.5, -1][index % 3]}deg` }}
          >
            <span className="birthday-page-month">{monthName(b.month)}</span>
            <span className="birthday-page-body">
              <span className="birthday-page-day">{b.day}</span>
              <span className="birthday-page-name">{b.firstName}</span>
              <span className="birthday-page-when">{b.passed ? 'Remembering' : whenLabel(b)}</span>
              <span className="birthday-page-age">{b.passed ? `Would be ${b.age}` : `Turns ${b.age}`}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
