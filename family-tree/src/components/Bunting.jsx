// Two swags of small triangular flags, drawn once. Purely decorative.
const WIDTH = 1100;
const HEIGHT = 90;
const COLOURS = ['var(--accent)', 'var(--ochre)', '#c79a4e', 'var(--ink)', 'var(--line-strong)'];
const FLAG_W = 22;
const FLAG_H = 28;
const SPACING = 40;

// A swag is a quadratic curve hanging between two pins.
function swag(x0, x1, pinY, sag) {
  const cx = (x0 + x1) / 2;
  const cy = pinY + sag * 2; // control point; the curve's lowest point is at pinY + sag
  const at = (t) => ({
    x: (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1,
    y: (1 - t) ** 2 * pinY + 2 * (1 - t) * t * cy + t ** 2 * pinY,
    angle: (Math.atan2(2 * (1 - t) * (cy - pinY) + 2 * t * (pinY - cy), 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx)) * 180) / Math.PI,
  });
  const count = Math.floor((x1 - x0) / SPACING);
  const flags = Array.from({ length: count }, (_, i) => at((i + 0.5) / count));
  return { path: `M${x0} ${pinY}Q${cx} ${cy} ${x1} ${pinY}`, flags };
}

const swags = [swag(0, WIDTH / 2, 8, 34), swag(WIDTH / 2, WIDTH, 8, 34)];
const flags = swags.flatMap((s) => s.flags);

export default function Bunting() {
  return (
    <svg className="bunting" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true" focusable="false">
      {swags.map((s) => (
        <path key={s.path} className="bunting-string" d={s.path} />
      ))}
      {flags.map((f, i) => (
        <g key={`${f.x}-${f.y}`} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.angle.toFixed(1)})`}>
          <polygon
            className="bunting-flag"
            points={`${-FLAG_W / 2},0 ${FLAG_W / 2},0 0,${FLAG_H}`}
            fill={COLOURS[i % COLOURS.length]}
            style={{ '--sway-delay': `${(i % 7) * -0.35}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
