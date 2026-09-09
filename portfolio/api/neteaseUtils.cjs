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

module.exports = { compactNeteaseCookie, extractAccountProfile, playlistSongIds, songProxyUrl }
const LOGIN_COOKIE_NAMES = new Set([
  'MUSIC_U', 'MUSIC_A', '__csrf', 'NMTID', 'WEVNSM', 'os', 'appver', '__remember_me',
])

function compactNeteaseCookie(cookie) {
  return String(cookie || '')
    .split(';')
    .map(part => part.trim())
    .filter(part => LOGIN_COOKIE_NAMES.has(part.slice(0, part.indexOf('='))))
    .join('; ')
}
