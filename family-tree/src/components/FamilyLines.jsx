import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { families } from '../data/people';

// Position of an element inside `container`, ignoring CSS transforms (so card animations don't skew the lines).
function boxIn(el, container) {
  let x = 0;
  let y = 0;
  for (let node = el; node && node !== container; node = node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

const STEM = 20; // gap between a row's horizontal bar and the tops of its cards

// Returns the lines to draw, plus for each person the route to highlight when they're hovered
// and who else lights up with them.
function buildLines(container) {
  const card = (id) => container.querySelector(`[data-person="${id}"]`);
  const paths = [];
  const routes = {}; // id -> path along which that person connects to the tree
  const related = {}; // id -> ids that stay lit while that person is hovered

  families().forEach(({ parents, children }) => {
    const parentBoxes = parents.map(card).filter(Boolean).map((el) => boxIn(el, container));
    const childEntries = children
      .map((id) => ({ id, el: card(id) }))
      .filter((entry) => entry.el)
      .map((entry) => ({ id: entry.id, ...boxIn(entry.el, container) }));
    if (!parentBoxes.length || !childEntries.length) return;

    const originX = parentBoxes.reduce((sum, b) => sum + b.x + b.w / 2, 0) / parentBoxes.length;
    const originY = Math.max(...parentBoxes.map((b) => b.y + b.h));

    // The line travels down the centre gap of the parents' row (the grids have an even number of
    // columns, so that gap runs clear of every card). A parent who isn't centred, like Arnold,
    // first steps down into the gap below their card, then across to that centre lane.
    const parentRow = card(parents[0])?.closest('.cards-row');
    const rowBox = parentRow ? boxIn(parentRow, container) : null;
    const laneX = rowBox ? rowBox.x + rowBox.w / 2 : originX;
    const offCentre = Math.abs(originX - laneX) > 1;
    const head = offCentre ? `M${originX} ${originY}V${originY + STEM}H${laneX}` : `M${laneX} ${originY}`;
  
    // Group children into the rows they wrap onto.
    const rows = new Map();
    childEntries.forEach((b) => {
      const key = Math.round(b.y);
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key).push(b);
    });
    const rowTops = [...rows.keys()].sort((a, b) => a - b);

    // Trunk from the parent(s) down the lane to the last row's bar.
    paths.push(`${head}V${rowTops[rowTops.length - 1] - STEM}`);

    rowTops.forEach((top) => {
      const centres = rows.get(top).map((b) => b.x + b.w / 2);
      const barY = top - STEM;
      paths.push(`M${Math.min(laneX, ...centres)} ${barY}H${Math.max(laneX, ...centres)}`);
      centres.forEach((cx) => paths.push(`M${cx} ${barY}V${top}`));
    });

    // Someone can be a child in one family and a parent in another (Arnold), so routes and
    // related people are added to, not overwritten.
    const add = (id, route, ids) => {
      routes[id] = routes[id] ? `${routes[id]} ${route}` : route;
      related[id] = [...new Set([...(related[id] ?? [id]), ...ids])];
    };
    // Each child's own route: down the lane, along its row's bar, down to its card.
    const childRoutes = childEntries.map((b) => {
      const top = Math.round(b.y);
      const route = `${head}V${top - STEM}H${b.x + b.w / 2}V${top}`;
      add(b.id, route, parents);
      return route;
    });
    // A parent lights up the whole family.
    parents.forEach((parentId) => add(parentId, childRoutes.join(' '), [...parents, ...children]));
  });

  return { paths, routes, related };
}

// Draws into its parent element, which must be position: relative and contain the person cards.
// Hovering (or keyboard-focusing) a card highlights its line and fades unrelated cards.
export default function FamilyLines() {
  const svgRef = useRef(null);
  const [lines, setLines] = useState({ paths: [], routes: {}, related: {} });
  const [traced, setTraced] = useState(null);

  useLayoutEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return undefined;

    const update = () => setLines(buildLines(container));
    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    document.fonts?.ready.then(update);

    const personAt = (event) => event.target.closest?.('[data-person]')?.dataset.person ?? null;
    const enter = (event) => setTraced(personAt(event));
    const leave = (event) => {
      if (!event.relatedTarget || !event.relatedTarget.closest?.('[data-person]')) setTraced(null);
    };
    container.addEventListener('pointerover', enter);
    container.addEventListener('pointerout', leave);
    container.addEventListener('focusin', enter);
    container.addEventListener('focusout', leave);
    return () => {
      observer.disconnect();
      container.removeEventListener('pointerover', enter);
      container.removeEventListener('pointerout', leave);
      container.removeEventListener('focusin', enter);
      container.removeEventListener('focusout', leave);
    };
  }, []);

  // Fade every card that isn't part of the traced person's immediate family.
  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const lit = traced ? lines.related[traced] ?? [traced] : null;
    container.classList.toggle('is-tracing', Boolean(lit));
    container.querySelectorAll('[data-person]').forEach((el) => {
      el.classList.toggle('is-related', Boolean(lit?.includes(el.dataset.person)));
    });
  }, [traced, lines]);

  const route = traced ? lines.routes[traced] : null;

  return (
    <svg className={`family-lines${route ? ' is-tracing' : ''}`} aria-hidden="true" ref={svgRef}>
      {lines.paths.map((d, index) => (
        <path key={d} d={d} pathLength="1" style={{ '--i': index }} />
      ))}
      {route ? <path className="family-lines-route" d={route} /> : null}
    </svg>
  );
}
