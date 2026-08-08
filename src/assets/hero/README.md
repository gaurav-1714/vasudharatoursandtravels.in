# Hero Background Images

This folder powers the rotating background image on the homepage hero section
("Journeys into the Himalayas").

## How to add a new image

1. Drop an image file directly into this folder (`src/assets/hero/`).
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Recommended size: at least 1800px wide, landscape orientation
   - Keep file sizes reasonable (under ~500KB each) for fast page loads
2. That's it — no code changes needed. The homepage automatically picks up
   every image in this folder and rotates through all of them.

## How to remove an image

Just delete the file from this folder. The rotation will automatically
adjust to the remaining images.

## Notes

- Images rotate automatically every few seconds with a smooth crossfade.
- If this folder is empty, the homepage falls back to a default image.
- File names don't matter — any name works, and images are shown in
  alphabetical order by filename. Prefix with numbers (e.g. `01-ladakh.jpg`,
  `02-nepal.jpg`) if you want to control the order.
