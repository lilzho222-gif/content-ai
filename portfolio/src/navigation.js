const views = new Set(['home', 'works', 'project', 'about', 'player'])

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
