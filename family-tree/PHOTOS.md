# Adding family photos

The site picks up photos automatically. Put a file in the right folder and it appears; you never have to touch the code.

All photo folders are inside `family-tree/src/assets/photos/`:

```
family-tree/
└── src/
    └── assets/
        └── photos/
            ├── people/   ← one photo per person (cards, profile pages, family links)
            ├── hero/     ← up to 9 photos for the ring around the home page headline
            └── album/    ← any number of photos for the Family album wall
```

---

## Before you start: file types

| Works | Doesn't work |
|---|---|
| `.jpg` `.jpeg` `.png` `.webp` `.avif` (also `.JPG` `.JPEG` `.PNG`) | `.heic` (iPhone default), `.gif`, `.bmp`, `.tiff`, `.pdf` |

**iPhone photos (`.heic`):** convert them to `.jpg` first. On an iPhone you can set *Settings → Camera → Formats → Most Compatible*. On Windows you can open the photo in the Photos app and choose *Save as → JPG*.

You **don't** need to shrink your photos. The site makes small, fast copies automatically when it builds. Your originals are never changed and are never shown to visitors.

---

## 1. Person photos: `photos/people/`

Each photo is shown in a **circle** on the person's tree card, their profile page and in family links.

**Name the file exactly after the person's key**, then any supported extension:

| Person | File name |
|---|---|
| Ernesto De Armas | `ernesto.jpg` |
| Jovita De Armas | `jovita.jpg` |
| Marietta De Armas | `marietta.jpg` |
| Lourdes De Armas | `lourdes.jpg` |
| Fernando De Armas | `fernando.jpg` |
| Ronaldo De Armas | `ronaldo.jpg` |
| Arnold De Armas | `arnold.jpg` |
| Rebecca De Armas | `rebecca.jpg` |
| Ernesto De Armas Jr. | `ernestoJr.jpg` |
| Jeffrey Rynan De Armas | `jeffrey.jpg` |
| Arlouigie De Armas | `arlouigie.jpg` |
| Arnie De Armas | `arnie.jpg` |
| Arnesto De Armas | `arnesto.jpg` |
| Archie De Armas | `archie.jpg` |

- Capital letters don't matter (`Jovita.JPG` works too).
- The key is the name in quotes at the start of each person's entry in `src/data/people.json`. New people added later use their own key the same way.
- Use **square photos with the face in the centre**; everything outside the circle is cropped off.
- Photos of people who have passed (Ernesto, Jovita) are shown in black and white automatically.
- Until a person has a photo, their initials are shown instead.

---

## 2. Home page ring: `photos/hero/`

Up to **9 photos** float around the headline at the top of the home page. They're shown in **black and white**.

**Name them with numbers** so you control the order. They fill the ring clockwise, starting at the top:

| File | Position | Shape (photo is cropped to fit) |
|---|---|---|
| `01.jpg` | top (12 o'clock) | landscape, wide |
| `02.jpg` | upper right, small | portrait, tall |
| `03.jpg` | right | portrait, tall |
| `04.jpg` | lower right | landscape, wide |
| `05.jpg` | bottom | square |
| `06.jpg` | lower left | portrait, tall |
| `07.jpg` | left, small | square |
| `08.jpg` | left | portrait, tall |
| `09.jpg` | upper left | landscape, wide |

- On phones only `01`, `03`, `04` and `06` are shown, so put your favourites there.
- Fewer than 9? The empty spots keep their grey placeholder.
- Numbers are sorted as numbers, so `2.jpg` comes before `10.jpg` either way; `01`, `02` … just keeps the folder tidy.

---

## 3. Family album: `photos/album/`

Drop in **as many photos as you like**, with any file names; no renaming, dates or captions needed.

- They appear on the home page, after the family tree, as tilted prints in **file-name order**. To control the order, number them (`001.jpg`, `002.jpg` …).
- The first **12** are shown, then a **Show more** button adds 12 at a time.
- Prints are black and white and turn to colour on hover. Clicking one opens it large, in colour.
- Each photo keeps its own shape (nothing is cropped), but very tall photos make very tall prints.

---

## Seeing your changes

1. Open a terminal in the `family-tree` folder.
2. Start the site:

   ```bash
   npm run dev
   ```

3. Open <http://localhost:5173>. New photos appear as soon as you save them into a folder. If one doesn't show, refresh the page.

The first time a new photo is shown, it can take a second while its small copy is made.

**Removing or replacing a photo:** delete or overwrite the file in the folder. That's all.

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| A person still shows initials | The file name doesn't match their key (check spelling, e.g. `ernestoJr` not `ernesto-jr`), or it's a `.heic` file. |
| A photo doesn't appear at all | Unsupported file type, or it's in the wrong folder. Make sure it's directly inside `people/`, `hero/` or `album/`, not in a subfolder. |
| Hero photos are in the wrong spots | They're placed by file name; rename to `01` … `09`. |
| A face is cut off in the circle | Crop the photo to a square with the face centred before adding it. |

---

## Privacy: read before committing to git

- Visitors only ever get the small copies, with hidden photo data (such as **GPS location**) removed.
- **Your original files are different.** If you `git commit` the photo folders, the originals, location data included, are stored in the repository's history permanently, even if you delete them later.
- If the GitHub repository is **public**, either:
  - remove location data first (on Windows: right-click the photo → *Properties* → *Details* → *Remove Properties and Personal Information*), or
  - keep the photo files out of git and only commit the README files in each folder.
