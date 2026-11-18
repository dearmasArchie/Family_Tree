import { parseBorn } from './dates';
import rawPeople from './people.json';
import { personPhoto } from './photos';

// A "photo" set in people.json wins; otherwise use src/assets/photos/people/<key>.jpg if it exists.
export const people = Object.fromEntries(
  Object.entries(rawPeople).map(([id, person]) => [id, { ...person, photo: person.photo || personPhoto(id) }]),
);


// --- Relationships -------------------------------------------------------
// people.json stores "parents": ["ernesto", "jovita"] on each child; everything else is worked out here.
const ids = Object.keys(people);
const idByName = Object.fromEntries(ids.map((id) => [people[id].name, id]));

export function parentsOf(id) {
  return (people[id]?.parents ?? []).filter((parentId) => people[parentId]);
}

export function childrenOf(id) {
  return ids.filter((childId) => parentsOf(childId).includes(id));
}

export function siblingsOf(id) {
  const parents = parentsOf(id);
  return ids.filter((otherId) => otherId !== id && parentsOf(otherId).some((parentId) => parents.includes(parentId)));
}

// "spouse" is a name; returns the spouse's key if they're in the tree, otherwise null.
export function spouseIdOf(id) {
  return idByName[people[id]?.spouse] ?? null;
}

// Children grouped by their pair of parents, e.g. [{ parents: ['ernesto', 'jovita'], children: [...] }].
export function families() {
  const groups = new Map();
  ids.forEach((id) => {
    const parents = parentsOf(id);
    if (!parents.length) return;
    const key = [...parents].sort().join('+');
    if (!groups.has(key)) groups.set(key, { parents, children: [] });
    groups.get(key).children.push(id);
  });
  return [...groups.values()];
}

// --- Birth order -----------------------------------------------------------
const birthKey = (id) => parseBorn(people[id].born).sortKey || Infinity;
export const byBirth = (list) => [...list].sort((a, b) => birthKey(a) - birthKey(b));

const ORDINALS = ['', '', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

// Children get their birth order as their role ("Eldest", "2nd child" … "Youngest");
// anyone without parents in the tree keeps the "role" from people.json (e.g. Patriarch).
ids.forEach((id) => {
  if (!parentsOf(id).length) return;
  const order = byBirth([id, ...siblingsOf(id)]);
  const place = order.indexOf(id) + 1;
  if (order.length === 1) people[id].role = 'Only child';
  else if (place === 1) people[id].role = 'Eldest';
  else if (place === order.length) people[id].role = 'Youngest';
  else people[id].role = `${ORDINALS[place] ?? `${place}th`} child`;
});

// --- Generations shown on the home page ------------------------------------
export const generations = [
  {
    id: 'grandparents',
    label: 'I · Grandparents',
    members: ['ernesto', 'jovita'],
  },
  {
    id: 'children',
    label: 'II · Children of Ernesto & Jovita',
    members: byBirth(['lourdes', 'fernando', 'marietta', 'ronaldo', 'arnold', 'rebecca', 'ernestoJr', 'jeffrey']),
  },
  {
    id: 'grandchildren',
    label: 'III · Grandchildren',
    onHomeTree: false, // kept for person pages and the parents page, not drawn in the home tree
    members: byBirth(['arlouigie', 'arnie', 'arnesto', 'archie']),
  },
];
