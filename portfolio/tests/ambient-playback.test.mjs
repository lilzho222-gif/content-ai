import test from 'node:test'
import assert from 'node:assert/strict'

const { shouldPlayAmbient } = await import('../src/components/ambientPlayback.js').catch(() => ({}))

test('background playback respects user pause after the section re-enters view', () => {
  assert.equal(typeof shouldPlayAmbient, 'function')
  assert.equal(shouldPlayAmbient({ visible: true, hidden: false, reduced: false, paused: true, failed: false }), false)
})

test('background video only plays when visible, allowed and available', () => {
  assert.equal(typeof shouldPlayAmbient, 'function')
  const normal = { visible: true, hidden: false, reduced: false, paused: false, failed: false }
  assert.equal(shouldPlayAmbient(normal), true)
  for (const change of [{ visible: false }, { hidden: true }, { reduced: true }, { failed: true }]) {
    assert.equal(shouldPlayAmbient({ ...normal, ...change }), false)
  }
})
