import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const experience = await import('../src/data/experience.js').catch(() => ({}))

test('each portfolio space owns a distinct signature interaction', () => {
  const values = Object.values(experience.pageExperiences || {})
  assert.equal(values.length, 5)
  assert.equal(new Set(values.map(value => value.signature)).size, values.length)
})

test('browser chrome carries the lilzho identity', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  assert.match(html, /rel="icon"/)
  assert.match(html, /theme-color/)
})
