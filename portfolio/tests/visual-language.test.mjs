import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const home = readFileSync(new URL('../src/pages/HomePage.jsx', import.meta.url), 'utf8')
const works = readFileSync(new URL('../src/pages/WorksPage.jsx', import.meta.url), 'utf8')
const player = readFileSync(new URL('../src/player/PlayerPage.jsx', import.meta.url), 'utf8')

test('distributes distinct interactive languages across pages', () => {
  assert.match(home, /DotField/)
  assert.match(home, /CurvedLoop/)
  assert.match(home, /PortalDock/)
  assert.match(works, /FlyingPosterRail/)
  assert.match(player, /night-garden\.mp4/)
})

test('ships the selected supplied motion assets locally', () => {
  for (const file of ['blue-bloom.mp4', 'moon-orbit.mp4', 'tech-structure.mp4', 'night-garden.mp4', 'forest-galaxy.mp4', 'character-signal.mp4', 'mono-signal.mp4']) {
    assert.equal(existsSync(new URL(`../public/media/${file}`, import.meta.url)), true, file)
  }
})

test('keeps decorative languages distributed and purposeful', () => {
  assert.match(works, /VisualSignalRail/)
  assert.match(works, /EchoText/)
  const project = readFileSync(new URL('../src/pages/ProjectPage.jsx', import.meta.url), 'utf8')
  const netease = readFileSync(new URL('../src/player/NeteasePanel.jsx', import.meta.url), 'utf8')
  assert.match(project, /FloatingLines/)
  assert.match(project, /glitch-text/)
  assert.match(netease, /curved-input-shell/)
})
