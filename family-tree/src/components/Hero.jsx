import { useEffect, useRef } from 'react';
import { heroPhotos } from '../data/heroPhotos';
import { people } from '../data/people';
import './Hero.css';

const CANVAS_W = 1440;
const CANVAS_H = 920;

const ringWords = [
  ...new Set(
    Object.values(people).flatMap((person) => [person.name, person.birthplace]).filter(Boolean),
  ),
].join('  ·  ').toUpperCase();

export default function Hero({ onExplore }) {
  const sectionRef = useRef(null);

  // Mouse parallax: write the pointer offset (-1..1) into CSS variables once per frame.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let frame = 0;
    const handleMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        section.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width - 0.5) * 2);
        section.style.setProperty('--my', ((event.clientY - rect.top) / rect.height - 0.5) * 2);
      });
    };
    const handleLeave = () => {
      section.style.setProperty('--mx', 0);
      section.style.setProperty('--my', 0);
    };

    section.addEventListener('pointermove', handleMove);
    section.addEventListener('pointerleave', handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', handleMove);
      section.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return (
    <section className="ring-hero" ref={sectionRef}>
      <div className="ring-hero-canvas">
        <svg className="ring-hero-words" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} aria-hidden="true">
          <path
            id="ring-hero-path"
            d="M 160 460 a 560 330 0 1 1 1120 0 a 560 330 0 1 1 -1120 0"
            fill="none"
          />
          <text>
            <textPath href="#ring-hero-path">{`${ringWords}  ·  ${ringWords}`}</textPath>
          </text>
        </svg>

        {heroPhotos.map((photo, index) => (
          <div
            key={photo.src}
            className={`ring-photo${photo.back ? ' is-back' : ''}${photo.mobile ? ` is-mobile-${photo.mobile}` : ''}`}
            style={{
              left: `${(photo.x / CANVAS_W) * 100}%`,
              top: `${(photo.y / CANVAS_H) * 100}%`,
              width: `${(photo.w / CANVAS_W) * 100}%`,
              '--depth': photo.w / 20,
              '--scroll-speed': (0.025 + ((photo.w - 120) / 120) * 0.05).toFixed(3),
              '--drift-x': `${(index % 3) + 2}px`,
              '--drift-y': `${((index + 1) % 3) + 2}px`,
              '--drift-time': `${6 + (index % 4)}s`,
              '--pop-delay': `${0.95 + index * 0.1}s`,
            }}
          >
            <div className="ring-photo-scroll">
              <div className="ring-photo-drift">
                <img src={photo.src} alt={photo.alt} style={{ aspectRatio: photo.ratio }} />
              </div>
            </div>
          </div>
        ))}

        <div className="ring-hero-copy">
          <div className="ring-hero-copy-scroll">
            <h2>
              The <span style={{ color: "#1f4d3a"}}>De Armas</span> family,
              <br />
              through the generations
            </h2>
            <p>
              Every name, relationship and memory, from our grandparents in Bulacan to the newest members. Open a card
              to read a story, then follow the lines to see how we connect.
            </p>
            <button type="button" onClick={onExplore}>
              Explore the family tree
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
