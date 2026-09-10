const views = new Set(['home', 'works', 'project', 'about', 'player'])
export const CANONICAL_PORTFOLIO_URL = 'https://lilzho222-gif.github.io/content-ai/portfolio-site/'

export function parsePortfolioLocation(search = '') {
  const params = new URLSearchParams(search)
  const requested = params.get('view') || 'home'
  return {
    view: views.has(requested) ? requested : 'home',
    projectId: params.get('id') || '',
  }
}

export function viewHref(view = 'home', extras = {}) {
  if (view === 'home') return './'
  const params = new URLSearchParams({ view, ...extras })
  return `?${params}`
}

export function portfolioHomeHref(pageUrl = window.location.href) {
  return new URL(pageUrl).hostname.endsWith('.onrender.com') ? CANONICAL_PORTFOLIO_URL : './'
}
