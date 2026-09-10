import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'

const navigation = await import('../src/navigation.js').catch(() => ({}))
const portfolio = await import('../src/data/portfolio.js').catch(() => ({}))
const require = createRequire(import.meta.url)
const siteRouting = (() => { try { return require('../api/siteRouting.cjs') } catch { return {} } })()

test('normalizes deep links to known portfolio views', () => {
  assert.equal(navigation.parsePortfolioLocation('?view=works').view, 'works')
  assert.equal(navigation.parsePortfolioLocation('?view=project&id=content-ai').projectId, 'content-ai')
  assert.equal(navigation.parsePortfolioLocation('?view=unknown').view, 'home')
})

test('keeps real project content in a reusable data collection', () => {
  assert.ok(Array.isArray(portfolio.projects))
  assert.equal(portfolio.projects[0].id, 'content-ai')
  assert.equal(portfolio.projects[0].title, 'AI 短视频脚本生成器')
  assert.match(portfolio.projects[0].github, /lilzho222-gif\/content-ai/)
})

test('the hosted music player returns to the one canonical portfolio', () => {
  assert.equal(
    navigation.portfolioHomeHref('https://lilzho-portfolio.onrender.com/?view=player'),
    'https://lilzho222-gif.github.io/content-ai/portfolio-site/',
  )
  assert.equal(
    navigation.portfolioHomeHref('https://lilzho222-gif.github.io/content-ai/portfolio-site/?view=player'),
    './',
  )
})

test('Render keeps only the player and redirects its old homepage', () => {
  assert.equal(siteRouting.canonicalRedirectFor({ view: 'player' }), '')
  assert.equal(siteRouting.canonicalRedirectFor({}), 'https://lilzho222-gif.github.io/content-ai/portfolio-site/')
  assert.equal(siteRouting.canonicalRedirectFor({ view: 'home' }), 'https://lilzho222-gif.github.io/content-ai/portfolio-site/')
})

test('Render deploys every commit from the linked branch', async () => {
  const blueprint = await readFile(new URL('../../render.yaml', import.meta.url), 'utf8')
  assert.match(blueprint, /autoDeployTrigger:\s*commit/)
})
