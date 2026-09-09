import assert from 'node:assert/strict'
import test from 'node:test'

const navigation = await import('../src/navigation.js').catch(() => ({}))
const portfolio = await import('../src/data/portfolio.js').catch(() => ({}))

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
