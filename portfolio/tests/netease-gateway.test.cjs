const test = require('node:test')
const assert = require('node:assert/strict')
const {
  compactNeteaseCookie,
  extractAccountProfile,
  playlistSongIds,
  songProxyUrl,
  createExpiringCache,
  pickRecommendedStartId,
} = require('../api/neteaseUtils.cjs')

test('keeps login credentials while removing oversized response cookie attributes', () => {
  const cookie = [
    'MUSIC_U=login-token',
    '__csrf=csrf-token',
    'NMTID=device-token',
    'Path=/',
    'Expires=Wed, 09 Jun 2032 10:18:14 GMT',
    'unrelated=' + 'x'.repeat(5000),
  ].join('; ')
  assert.equal(
    compactNeteaseCookie(cookie),
    'MUSIC_U=login-token; __csrf=csrf-token; NMTID=device-token',
  )
})

test('uses every playlist trackId instead of the abbreviated tracks array', () => {
  const detail = {
    playlist: {
      tracks: [{ id: 11 }, { id: 12 }],
      trackIds: [{ id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }],
    },
  }
  assert.deepEqual(playlistSongIds(detail), ['11', '12', '13', '14'])
})

test('gives every imported song a same-origin playback endpoint', () => {
  assert.equal(songProxyUrl(186016), '/api/netease?action=audio&id=186016')
})

test('reads the account profile returned by the direct NetEase status API', () => {
  assert.deepEqual(
    extractAccountProfile({ code: 200, profile: { userId: 1374769659, nickname: 'lilzho' } }),
    { userId: 1374769659, nickname: 'lilzho' },
  )
  assert.equal(extractAccountProfile({ code: 200, profile: null }), null)
})

test('reuses a resolved song source until its short expiry', () => {
  let now = 1000
  const cache = createExpiringCache({ ttl: 5000, now: () => now })
  cache.set('42', 'https://music.example/42.mp3')
  assert.equal(cache.get('42'), 'https://music.example/42.mp3')
  now = 7000
  assert.equal(cache.get('42'), undefined)
})

test('starts an imported playlist at the first verified playable song', () => {
  const results = [
    { id: 11, url: null },
    { id: 12, url: 'https://music.example/12.mp3' },
    { id: 13, url: 'https://music.example/13.mp3' },
  ]
  assert.equal(pickRecommendedStartId(results), '12')
  assert.equal(pickRecommendedStartId([{ id: 11, url: null }]), '')
})
