// Photos are picked up automatically from these folders; no code changes needed.
//   src/assets/photos/album/<anything>.jpg      the family album wall after the tree
//   src/assets/photos/people/<person key>.jpg   e.g. jovita.jpg, ernestoJr.png
//   src/assets/photos/hero/<anything>.jpg       the first 9 by file name fill the hero ring
// Supported: .jpg .jpeg .png .webp .avif
//
// Visitors never download the originals: vite-imagetools (see vite.config.js) makes resized WebP copies.
// `withoutEnlargement` means small photos are never blown up; sideways phone photos are turned upright
// and location data is dropped from the copies.

const byName = (files) =>
  Object.keys(files)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => ({ path, url: files[path] }));

const baseName = (path) => path.split('/').pop().replace(/\.[^.]+$/, '');

// Person photos: shown in circles up to 200px wide, so 400px covers high-resolution screens.
const peopleFiles = import.meta.glob('../assets/photos/people/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
  query: '?w=400&format=webp&quality=80&withoutEnlargement',
});

const peoplePhotoByKey = Object.fromEntries(
  byName(peopleFiles).map(({ path, url }) => [baseName(path).toLowerCase(), url]),
);

export function personPhoto(id) {
  return peoplePhotoByKey[id.toLowerCase()] ?? '';
}

// Hero ring: slots are at most 240px wide.
const heroFiles = import.meta.glob('../assets/photos/hero/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
  query: '?w=500&format=webp&quality=80&withoutEnlargement',
});

export const heroPhotoFiles = byName(heroFiles).map(({ url }) => url);

// Family album: every photo in src/assets/photos/album/ (any name), in file-name order.
// Two copies each: a small one for the wall (prints are ~250px wide) and a large one for the viewer.
const albumThumbs = import.meta.glob('../assets/photos/album/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
  query: '?w=600&format=webp&quality=80&withoutEnlargement',
});
const albumLarge = import.meta.glob('../assets/photos/album/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
  query: '?w=1600&format=webp&quality=82&withoutEnlargement',
});

export const albumPhotos = byName(albumThumbs).map(({ path, url }) => ({ thumb: url, full: albumLarge[path] }));
