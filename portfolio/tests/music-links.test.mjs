import { strict as assert } from 'node:assert'
import test from 'node:test'
import { parseNeteaseLink } from '../src/player/musicLinks.js'

test('converts a shared hash song URL to the official player without autoplay', () => {
  const song = parseNeteaseLink('https://music.163.com/#/song?id=186016&userid=1')
  assert.equal(song.embed, 'https://music.163.com/outchain/player?type=2&id=186016&auto=0&height=66')
  assert.equal(song.url, 'https://music.163.com/#/song?id=186016')
})
test('keeps playlist type and validates the supplied ID', () => {
  const playlist = parseNeteaseLink('https://music.163.com/playlist?id=12345')
  assert.equal(playlist.kind, 'playlist')
  assert.deepEqual(playlist.api, { action: 'tracks', id: '12345', kind: 'playlist' })
  assert.throws(() => parseNeteaseLink('https://music.163.com/song?id=abc'))
})
test('rejects foreign hosts, script URLs and unsupported account pages', () => {
  for (const url of ['javascript:alert(1)', 'https://music.163.com.evil.example/song?id=1', 'https://music.163.com/user/home?id=1']) assert.throws(() => parseNeteaseLink(url))
})
