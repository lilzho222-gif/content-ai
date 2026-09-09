import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getNeteaseApiEndpoint,
  mergeNeteaseTracks,
  qrStatusLabel,
  requestNetease,
} from '../src/player/neteaseAccount.js'

test('uses the same-origin hosted API endpoint', () => {
  assert.equal(getNeteaseApiEndpoint('https://lilzho.onrender.com/player'), 'https://lilzho.onrender.com/api/netease')
  assert.equal(getNeteaseApiEndpoint('http://localhost:5173/'), 'http://localhost:5173/api/netease')
})

test('merges playable NetEase songs and URLs into player tracks', () => {
  const tracks = mergeNeteaseTracks(
    [
      { id: 7, name: '第一首', ar: [{ name: '创作者 A' }], al: { name: '专辑 A', picUrl: 'https://img.example/a.jpg' } },
      { id: 8, name: '无版权歌曲', ar: [{ name: '创作者 B' }], al: { name: '专辑 B' } },
    ],
    [
      { id: 7, url: 'https://audio.example/7.mp3' },
      { id: 8, url: null },
    ],
  )

  assert.deepEqual(tracks, [{
    id: 'netease-7',
    title: '第一首',
    descriptor: '创作者 A · 专辑 A',
    src: 'https://audio.example/7.mp3',
    artwork: 'https://img.example/a.jpg',
    accent: '#d49a6a',
    source: 'netease',
  }])
})

test('explains every QR login state in plain language', () => {
  assert.equal(qrStatusLabel(801), '请使用网易云音乐 App 扫码')
  assert.equal(qrStatusLabel(802), '已扫码，请在手机上确认')
  assert.equal(qrStatusLabel(803), '登录成功，正在读取歌单')
  assert.equal(qrStatusLabel(800), '二维码已过期，请重新生成')
})

test('rejects a static HTML fallback instead of pretending the API exists', async () => {
  const previousWindow = globalThis.window
  const previousFetch = globalThis.fetch
  globalThis.window = { location: { href: 'https://example.com/player' } }
  globalThis.fetch = async () => ({
    ok: true,
    headers: { get: () => 'text/html; charset=utf-8' },
    json: async () => ({}),
  })
  await assert.rejects(() => requestNetease('status'), /Render/)
  globalThis.window = previousWindow
  globalThis.fetch = previousFetch
})

test('stops waiting when the hosted NetEase API does not respond', async () => {
  const previousWindow = globalThis.window
  const previousFetch = globalThis.fetch
  globalThis.window = { location: { href: 'https://example.com/player' } }
  globalThis.fetch = () => new Promise(() => {})
  try {
    await assert.rejects(
      Promise.race([
        requestNetease('status', {}, undefined, 5),
        new Promise((_, reject) => setTimeout(() => reject(new Error('test guard timeout')), 50)),
      ]),
      /网易云响应超时/,
    )
  } finally {
    globalThis.window = previousWindow
    globalThis.fetch = previousFetch
  }
})
