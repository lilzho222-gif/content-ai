const test = require('node:test')
const assert = require('node:assert/strict')
const {
  extractAccountProfile,
  playlistSongIds,
  songProxyUrl,
} = require('../api/neteaseUtils.cjs')

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
