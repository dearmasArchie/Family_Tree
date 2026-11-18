import { parseBorn } from './dates';
import { people } from './people';

const DAY = 24 * 60 * 60 * 1000;

// While developing, add ?today=2026-11-19 to the address to preview another day.
export function getToday() {
  const override = import.meta.env.DEV && new URLSearchParams(window.location.search).get('today');
  const date = override ? new Date(`${override}T00:00:00`) : new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// The next `count` birthdays from `today`, soonest first (people need a full birth date).
export function upcomingBirthdays(today, count = 3) {
  return Object.entries(people)
    .map(([id, person]) => {
      const born = parseBorn(person.born);
      if (!born.year || born.month < 0 || !born.day) return null;
      let next = new Date(today.getFullYear(), born.month, born.day);
      if (next < today) next = new Date(today.getFullYear() + 1, born.month, born.day);
      return {
        id,
        firstName: person.name.split(' ')[0],
        passed: Boolean(person.died),
        month: born.month,
        day: born.day,
        next,
        daysAway: Math.round((next - today) / DAY),
        age: next.getFullYear() - born.year,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, count);
}
