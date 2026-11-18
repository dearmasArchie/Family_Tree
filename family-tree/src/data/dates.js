export const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

const capitalise = (word) => word[0].toUpperCase() + word.slice(1);

// Birth dates in people.json come as "12 March 1920", "November 19 1961" or just "1978".
// Returns { year, month (0-11 or -1), day (0 if unknown), sortKey, dayMonth ("12 Mar" or null) }.
export function parseBorn(born) {
  const year = Number(born.match(/\d{4}/)?.[0]);
  const month = MONTHS.findIndex((name) => born.toLowerCase().includes(name));
  const day = Number(born.replace(/\d{4}/, '').match(/\d{1,2}/)?.[0]) || 0;
  const hasDay = month >= 0 && day > 0;
  return {
    year,
    month,
    day: hasDay ? day : 0,
    sortKey: year * 10000 + (month + 1) * 100 + day,
    dayMonth: hasDay ? `${day} ${capitalise(MONTHS[month]).slice(0, 3)}` : null,
  };
}

export const monthName = (month) => capitalise(MONTHS[month]);

// "12 March 1920" / "November 19 1961" -> "12 Mar 1920"; "1978" stays "1978"; anything unreadable is returned as-is.
export function formatDate(text) {
  if (!text) return '';
  const { year, dayMonth } = parseBorn(text);
  if (!year) return text;
  return dayMonth ? `${dayMonth} ${year}` : String(year);
}

// "12 Mar 1920 – 4 Jun 1998" or "b. 19 Nov 1961"
export function lifeDates(person) {
  return person.died ? `${formatDate(person.born)} – ${formatDate(person.died)}` : `b. ${formatDate(person.born)}`;
}

// Whole years between a birth date and `until` (default today). Uses month and day when known.
export function ageInYears(born, until = new Date()) {
  const b = parseBorn(born);
  if (!b.year) return null;
  let age = until.getFullYear() - b.year;
  if (b.month >= 0) {
    const hadBirthday =
      until.getMonth() > b.month || (until.getMonth() === b.month && until.getDate() >= (b.day || 1));
    if (!hadBirthday) age -= 1;
  }
  return age;
}

// A Date for a "12 March 1920"-style string (1 Jan when only the year is known), or null.
export function toDate(text) {
  const d = parseBorn(text || '');
  if (!d.year) return null;
  return new Date(d.year, Math.max(d.month, 0), d.day || 1);
}
