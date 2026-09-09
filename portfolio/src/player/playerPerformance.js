export function visiblePlaylist(tracks, limit = 48) {
  const items = tracks.slice(0, Math.max(0, limit))
  return { items, total: tracks.length, hasMore: items.length < tracks.length }
}

export function preferredTrackIndex(tracks, recommendedId) {
  const index = tracks.findIndex(track => String(track.id) === String(recommendedId))
  return index < 0 ? 0 : index
}
