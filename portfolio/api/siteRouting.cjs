const CANONICAL_PORTFOLIO_URL = 'https://lilzho222-gif.github.io/content-ai/portfolio-site/'

function canonicalRedirectFor(query = {}) {
  return String(query.view || '') === 'player' ? '' : CANONICAL_PORTFOLIO_URL
}

module.exports = { CANONICAL_PORTFOLIO_URL, canonicalRedirectFor }
