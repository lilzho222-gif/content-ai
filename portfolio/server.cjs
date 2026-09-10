const express = require('express')
const path = require('path')
const neteaseHandler = require('./api/netease.cjs')
const { canonicalRedirectFor } = require('./api/siteRouting.cjs')

const app = express()
const port = Number(process.env.PORT) || 10000
const dist = path.join(__dirname, 'dist')

app.disable('x-powered-by')
app.get('/health', (_req, res) => res.json({ ok: true }))
app.all('/api/netease', neteaseHandler)
app.get('/', (req, res, next) => {
  const target = canonicalRedirectFor(req.query)
  if (!target) return next()
  return res.redirect(302, target)
})
app.use(express.static(dist, { maxAge: '1h', index: 'index.html' }))
app.get(/.*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')))

app.listen(port, '0.0.0.0', () => {
  console.log(`lilzho portfolio listening on ${port}`)
})
