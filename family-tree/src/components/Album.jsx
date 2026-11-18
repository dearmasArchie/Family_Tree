import { useEffect, useRef, useState } from 'react';
import { albumPhotos } from '../data/photos';
import './Album.css';

// Shown until real photos are added to src/assets/photos/album/.
const PLACEHOLDERS = Array.from({ length: 9 }, (_, i) => {
  const src = `/hero-photos/photo-${i + 1}.svg`;
  return { thumb: src, full: src };
});

// Small, stable tilt and nudge per print so the wall looks casually scattered.
const TILTS = [-3, 2, -1.5, 3.5, -2.5, 1, -4, 2.5, -1];
const NUDGES = [0, 14, -6, 8, -10, 4, 12, -4, 6];
const PAGE_SIZE = 12; // prints shown at first, and added per "Show more"

function Viewer({ photos, index, onChange, onClose }) {
  const dialogRef = useRef(null);
  const touchX = useRef(null);
  const [direction, setDirection] = useState(null); // 'next' | 'prev': which way the new photo slides in
  const [closing, setClosing] = useState(false);
  const count = photos.length;
  const go = (step) => {
    setDirection(step > 0 ? 'next' : 'prev');
    onChange((current) => (current + step + count) % count);
  };
  // Fade out first, then actually close.
  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    // showModal gives focus trapping and Esc-to-close for free. No cleanup: removing the
    // element ends the modal, and calling close() would fire onClose (React dev runs effects twice).
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') go(1);
    if (event.key === 'ArrowLeft') go(-1);
  };

  return (
    <dialog
      ref={dialogRef}
      className={`album-viewer${closing ? ' is-closing' : ''}`}
      aria-label={`Family photo ${index + 1} of ${count}`}
      onCancel={(event) => {
        event.preventDefault(); // Esc: close through React state instead of waiting for the 'close' event
        requestClose();
      }}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={(event) => event.target === dialogRef.current && requestClose()} // click outside the photo
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const dx = event.changedTouches[0].clientX - (touchX.current ?? 0);
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* keyed by index so each new photo mounts fresh and plays its slide-in */}
      <img
        key={index}
        className={`album-viewer-photo${direction ? ` from-${direction}` : ''}`}
        src={photos[index].full}
        alt={`Family photo ${index + 1} of ${count}`}
      />
      <div className="album-viewer-bar">
        <button type="button" className="album-viewer-button" onClick={() => go(-1)} aria-label="Previous photo">
          ‹
        </button>
        <span className="album-viewer-count">
          {index + 1} / {count}
        </span>
        <button type="button" className="album-viewer-button" onClick={() => go(1)} aria-label="Next photo">
          ›
        </button>
      </div>
      <button type="button" className="album-viewer-close" onClick={requestClose} aria-label="Close photo">
        ×
      </button>
    </dialog>
  );
}

export default function Album() {
  const hasPhotos = albumPhotos.length > 0;
  const photos = hasPhotos ? albumPhotos : PLACEHOLDERS;
  const [openIndex, setOpenIndex] = useState(null);
  const [shown, setShown] = useState(PAGE_SIZE);
  const wallRef = useRef(null);
  const focusFrom = useRef(null);
  const visible = photos.slice(0, shown);
  const remaining = hasPhotos ? photos.length - visible.length : 0;

  // After "Show more", move keyboard focus to the first new print so keyboard users keep their place.
  useEffect(() => {
    if (focusFrom.current === null) return;
    wallRef.current?.querySelector(`[data-index="${focusFrom.current}"]`)?.focus();
    focusFrom.current = null;
  }, [shown]);

  const showMore = () => {
    focusFrom.current = shown;
    setShown((count) => count + PAGE_SIZE);
  };

  return (
    <section id="album" className="album" aria-labelledby="album-title" data-reveal>
      <div className="album-head">
        <h2 id="album-title" className="album-title">
          Family album
        </h2>
        {!hasPhotos ? <p className="album-note">Photos coming soon</p> : null}
      </div>

      <ul className={`album-wall${hasPhotos ? '' : ' is-placeholder'}`} ref={wallRef}>
        {visible.map((photo, index) => (
          <li
            key={photo.thumb}
            className="album-print"
            style={{ '--tilt': `${TILTS[index % TILTS.length]}deg`, '--nudge': `${NUDGES[index % NUDGES.length]}px` }}
          >
            {hasPhotos ? (
              <button
                type="button"
                className="album-print-button"
                data-index={index}
                onClick={() => setOpenIndex(index)}
              >
                <img src={photo.thumb} alt={`Family photo ${index + 1}`} loading="lazy" />
              </button>
            ) : (
              <img src={photo.thumb} alt="" />
            )}
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <div className="album-more">
          <button type="button" className="album-more-button" onClick={showMore}>
            Show more
          </button>
          <span className="album-more-count">
            {visible.length} of {photos.length} photos
          </span>
        </div>
      ) : null}

      {/* The viewer can step through every photo, including ones not shown on the wall yet. */}
      {openIndex !== null ? (
        <Viewer photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      ) : null}
    </section>
  );
}
