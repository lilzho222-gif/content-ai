import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8')
const home = readFileSync(new URL('../src/pages/HomePage.jsx', import.meta.url), 'utf8')
const player = readFileSync(new URL('../src/player/PlayerPage.jsx', import.meta.url), 'utf8')
const spatial = readFileSync(new URL('../src/spatial.css', import.meta.url), 'utf8')
const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8')

test('uses an ink, wine and amber palette', () => {
  assert.match(css, /--wine:/)
  assert.match(css, /--amber:/)
  assert.match(css, /--ink:/)
})

test('uses a product UI hero without unrelated scenic media', () => {
  assert.match(home, /ProductConsole/)
  assert.doesNotMatch(home, /autumn|forest|moon|bloom|garden/i)
  assert.doesNotMatch(css, /url\('\/images\/lilzho-hero-reference\.png'\)/)
})

test('keeps a semantic readable headline and personal identity', () => {
  assert.match(home, /<h1>/)
  assert.match(home, /profile\.role/)
  assert.match(home, /张皓哲 \/ lilzho/)
  assert.doesNotMatch(home, /ParticleTitle/)
})

test('keeps decorative pointer feedback at application scope', () => {
  assert.match(app, /className="app-shell"/)
  assert.match(app, /<CursorTrail/)
  assert.doesNotMatch(css, /particle-title:hover/)
  assert.match(spatial, /prefers-reduced-motion:reduce/)
})

test('links the hero to an independent music player view', () => {
  assert.match(home, /viewHref\('player'\)/)
  assert.match(app, /PlayerPage/)
  assert.match(home, /声音实验/)
})

test('ships a player with labelled controls and an expandable playlist', () => {
  assert.match(player, /给思绪一点/)
  assert.match(player, /上一首/)
  assert.match(player, /下一首/)
  assert.match(player, /继续显示/)
  assert.match(player, /removeTrack/)
})

// Playback, next/previous and cross-view continuity are verified in the browser;
// those behaviours no longer belong to SitePlayer's implementation details.

test('uses deploy-safe relative assets for GitHub Pages', () => {
  assert.ok(/base:\s*['"]\.\/['"]/.test(viteConfig))
  assert.doesNotMatch(home, /src="\/media\//)
})
