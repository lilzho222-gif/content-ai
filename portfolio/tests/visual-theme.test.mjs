import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8')
const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8')

test('uses an ink, wine and amber palette', () => {
  assert.match(css, /--wine:/)
  assert.match(css, /--amber:/)
  assert.match(css, /--ink:/)
})

test('uses a video-only hero with a poster fallback', () => {
  assert.match(app, /poster=/)
  assert.doesNotMatch(css, /url\('\/images\/lilzho-hero-reference\.png'\)/)
})

test('keeps a semantic readable headline and personal identity', () => {
  assert.match(app, /<h1 id="hero-title">/)
  assert.match(app, /hero-role/)
  assert.match(app, /张皓哲/)
  assert.doesNotMatch(app, /ParticleTitle/)
})

test('keeps decorative pointer feedback at application scope', () => {
  assert.match(app, /className="app-shell"/)
  assert.match(app, /<CursorTrail/)
  assert.doesNotMatch(css, /particle-title:hover/)
  assert.match(css, /prefers-reduced-motion:reduce/)
})

test('links the hero to an independent music player view', () => {
  assert.match(app, /view=player/)
  assert.match(app, /PlayerPage/)
  assert.match(app, /media\/autumn\.mp4/)
})

test('ships a player with two real media tracks and labelled controls', () => {
  assert.match(app, /trackData/)
  assert.match(app, /播放氛围片段/)
  assert.match(app, /上一首/)
  assert.match(app, /下一首/)
})

// Playback, next/previous and cross-view continuity are verified in the browser;
// those behaviours no longer belong to SitePlayer's implementation details.

test('uses deploy-safe relative assets for GitHub Pages', () => {
  assert.match(viteConfig, /base:\s*['"]\.\/['"]/)
  assert.doesNotMatch(app, /src="\/media\//)
})
