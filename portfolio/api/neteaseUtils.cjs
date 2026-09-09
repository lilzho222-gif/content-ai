function playlistSongIds(detail, limit = 1000) {
  const playlist = detail?.playlist || {}
  const source = playlist.trackIds?.length ? playlist.trackIds : playlist.tracks || []
  return source
    .map(item => String(item?.id || ''))
    .filter(id => /^\d+$/.test(id))
    .slice(0, limit)
}

function songProxyUrl(id) {
  return `/api/netease?action=audio&id=${encodeURIComponent(String(id))}`
}

function extractAccountProfile(payload) {
  return payload?.profile || payload?.data?.profile || null
}

module.exports = { extractAccountProfile, playlistSongIds, songProxyUrl }
