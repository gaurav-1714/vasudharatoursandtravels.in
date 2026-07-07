// Auto-loads photos for each package straight from its folder inside
// src/assets/gallery/<package-id>/
//
// HOW TO ADD PHOTOS FOR A PACKAGE:
// 1. Create a folder named exactly after the package's `id`
//    (e.g. for the package with id "leh-ladakh-highlights", create:
//    src/assets/gallery/leh-ladakh-highlights/)
// 2. Drop any number of .jpg / .jpeg / .png / .webp files inside it.
// 3. That's it — no code changes needed. The first photo (alphabetically)
//    becomes the cover image, and all photos become the gallery.
//
// Vite's import.meta.glob scans these at build time, so this works
// automatically for every existing and future package.

const modules = import.meta.glob(
  '/src/assets/gallery/*/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}',
  { eager: true, import: 'default' }
)

// Build a map of packageId -> sorted array of image URLs
const galleryMap = {}
for (const path in modules) {
  // path looks like: /src/assets/gallery/<packageId>/<filename>
  const match = path.match(/\/assets\/gallery\/([^/]+)\/[^/]+$/)
  if (!match) continue
  const packageId = match[1]
  if (!galleryMap[packageId]) galleryMap[packageId] = []
  galleryMap[packageId].push({ path, url: modules[path] })
}
for (const packageId in galleryMap) {
  galleryMap[packageId].sort((a, b) => a.path.localeCompare(b.path))
}

/**
 * Returns all images found in src/assets/gallery/<packageId>/ as an array
 * of image URLs. Returns [] if the folder doesn't exist or is empty.
 */
export function getPackageGallery(packageId) {
  const entries = galleryMap[packageId] || []
  return entries.map((e) => e.url)
}

/**
 * Returns the first image found for a package (used as the card/cover image),
 * or null if none exist yet.
 */
export function getPackageCover(packageId) {
  const entries = galleryMap[packageId] || []
  return entries.length > 0 ? entries[0].url : null
}
