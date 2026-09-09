const COVER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_COVER_SIZE = 10 * 1024 * 1024

export function removeTrackState(tracks, currentIndex, id) {
  const removedIndex = tracks.findIndex(track => track.id === id)
  if (removedIndex < 0) return { tracks, index: currentIndex, removed: null }
  const nextTracks = tracks.filter(track => track.id !== id)
  let nextIndex = currentIndex
  if (!nextTracks.length) nextIndex = 0
  else if (removedIndex < currentIndex) nextIndex = currentIndex - 1
  else if (currentIndex >= nextTracks.length) nextIndex = nextTracks.length - 1
  return { tracks: nextTracks, index: nextIndex, removed: tracks[removedIndex] }
}

export function validateCoverFile(file) {
  if (!file || !COVER_TYPES.has(file.type)) return { ok: false, message: '请选择 JPG、PNG 或 WebP 图片。' }
  if (file.size > MAX_COVER_SIZE) return { ok: false, message: '壁纸图片不能超过 10MB。' }
  return { ok: true, message: '' }
}
