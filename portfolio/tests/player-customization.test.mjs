import test from 'node:test'
import assert from 'node:assert/strict'
import { removeTrackState, validateCoverFile } from '../src/player/playerCustomization.js'

const tracks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

test('deleting the current track selects the following track', () => {
  assert.deepEqual(removeTrackState(tracks, 1, 'b'), {
    tracks: [{ id: 'a' }, { id: 'c' }],
    index: 1,
    removed: tracks[1],
  })
})

test('deleting the last current track selects the previous track', () => {
  assert.equal(removeTrackState(tracks, 2, 'c').index, 1)
})

test('deleting the only track produces a safe empty playlist', () => {
  assert.deepEqual(removeTrackState([{ id: 'a' }], 0, 'a'), {
    tracks: [],
    index: 0,
    removed: { id: 'a' },
  })
})

test('cover wallpaper accepts only common images up to 10 MB', () => {
  assert.equal(validateCoverFile({ type: 'image/webp', size: 2_000_000 }).ok, true)
  assert.match(validateCoverFile({ type: 'image/svg+xml', size: 1_000 }).message, /JPG/)
  assert.match(validateCoverFile({ type: 'image/png', size: 11 * 1024 * 1024 }).message, /10MB/)
})
