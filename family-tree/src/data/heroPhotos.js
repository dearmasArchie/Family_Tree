import { heroPhotoFiles } from './photos';

// Hero ring photos, in clockwise order starting at 12 o'clock.
// Real photos: drop files into src/assets/photos/hero/. They fill these slots in file-name order;
// any slot without a photo keeps its grey placeholder.
// x / y are the photo's centre and w its width, all in px on a 1440 × 920 canvas.
// `mobile` marks the 4 photos kept on small screens ('top' or 'bottom').
const slots = [
  { src: '/hero-photos/photo-1.svg', alt: 'Family photo', x: 720, y: 120, w: 170, ratio: '4 / 3', mobile: 'top' },
  { src: '/hero-photos/photo-2.svg', alt: 'Family photo', x: 1262, y: 272, w: 130, ratio: '4 / 5', back: true },
  { src: '/hero-photos/photo-3.svg', alt: 'Family photo', x: 1312, y: 452, w: 210, ratio: '4 / 5', mobile: 'top' },
  { src: '/hero-photos/photo-4.svg', alt: 'Family photo', x: 1170, y: 772, w: 230, ratio: '4 / 3', mobile: 'bottom' },
  { src: '/hero-photos/photo-5.svg', alt: 'Family photo', x: 720, y: 836, w: 140, ratio: '1 / 1' },
  { src: '/hero-photos/photo-6.svg', alt: 'Family photo', x: 300, y: 752, w: 200, ratio: '4 / 5', mobile: 'bottom' },
  { src: '/hero-photos/photo-7.svg', alt: 'Family photo', x: 186, y: 640, w: 120, ratio: '1 / 1', back: true },
  { src: '/hero-photos/photo-8.svg', alt: 'Family photo', x: 118, y: 404, w: 160, ratio: '4 / 5' },
  { src: '/hero-photos/photo-9.svg', alt: 'Family photo', x: 272, y: 162, w: 240, ratio: '4 / 3' },
];

export const heroPhotos = slots.map((slot, index) => ({ ...slot, src: heroPhotoFiles[index] ?? slot.src }));
