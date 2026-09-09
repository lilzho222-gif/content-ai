import assert from 'node:assert/strict'
import test from 'node:test'

const performance = await import('../src/player/playerPerformance.js').catch(() => ({}))

test('long playlists render progressively without hiding the total', () => {
  const tracks = Array.from({ length: 211 }, (_, id) => ({ id }))
  const first = performance.visiblePlaylist(tracks, 48)
  assert.equal(first.items.length, 48)
  assert.equal(first.total, 211)
  assert.equal(first.hasMore, true)
  const last = performance.visiblePlaylist(tracks, 999)
  assert.equal(last.items.length, 211)
  assert.equal(last.hasMore, false)
})

test('replacement selects the recommended playable song when present', () => {
  const tracks = [{ id: '11' }, { id: '12' }, { id: '13' }]
  assert.equal(performance.preferredTrackIndex(tracks, '12'), 1)
  assert.equal(performance.preferredTrackIndex(tracks, '404'), 0)
})
