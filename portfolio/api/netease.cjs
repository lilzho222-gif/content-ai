const {
  login_qr_key: loginQrKey,
  login_qr_create: loginQrCreate,
  login_qr_check: loginQrCheck,
  login_status: loginStatus,
  user_playlist: userPlaylist,
  playlist_track_all: playlistTrackAll,
  song_detail: songDetail,
  song_url: songUrl,
} = require('@neteasecloudmusicapienhanced/api')

const SESSION_NAME = 'lilzho_netease_session'
const MAX_AGE = 60 * 60 * 24 * 30

function bodyOf(result) {
  return result?.body || result || {}
}

function readSession(req) {
  const header = req.headers.cookie || ''
  const item = header.split(';').map(value => value.trim()).find(value => value.startsWith(`${SESSION_NAME}=`))
  if (!item) return ''
  try { return Buffer.from(decodeURIComponent(item.slice(SESSION_NAME.length + 1)), 'base64url').toString('utf8') } catch { return '' }
}

function saveSession(res, value) {
  const encoded = Buffer.from(value).toString('base64url')
  res.setHeader('Set-Cookie', `${SESSION_NAME}=${encoded}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`)
}

function clearSession(res) {
  res.setHeader('Set-Cookie', `${SESSION_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`)
}

function send(res, status, payload) {
  res.status(status).json(payload)
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') return send(res, 405, { message: '仅支持 GET 请求。' })

  const action = String(req.query.action || '')
  const cookie = readSession(req)

  try {
    if (action === 'qr-start') {
      const keyResult = bodyOf(await loginQrKey({}))
      const key = keyResult.data?.unikey || keyResult.unikey
      if (!key) throw new Error('暂时无法创建登录二维码。')
      const qrResult = bodyOf(await loginQrCreate({ key, qrimg: true }))
      return send(res, 200, { key, qrimg: qrResult.data?.qrimg || '' })
    }

    if (action === 'qr-check') {
      const key = String(req.query.key || '')
      if (!key) return send(res, 400, { message: '缺少二维码登录标识。' })
      const result = bodyOf(await loginQrCheck({ key }))
      if (Number(result.code) === 803 && result.cookie) saveSession(res, result.cookie)
      return send(res, 200, { code: Number(result.code), message: result.message || '' })
    }

    if (action === 'status') {
      if (!cookie) return send(res, 200, { connected: false })
      const result = bodyOf(await loginStatus({ cookie }))
      const profile = result.data?.profile || result.profile || null
      return send(res, 200, { connected: Boolean(profile), profile })
    }

    if (action === 'playlists') {
      if (!cookie) return send(res, 401, { message: '请先连接网易云账号。' })
      const uid = String(req.query.uid || '')
      if (!/^\d+$/.test(uid)) return send(res, 400, { message: '账号信息无效，请重新登录。' })
      const result = bodyOf(await userPlaylist({ uid, cookie, limit: 50, offset: 0 }))
      return send(res, 200, { playlists: result.playlist || [] })
    }

    if (action === 'tracks') {
      const id = String(req.query.id || '')
      if (!/^\d+$/.test(id)) return send(res, 400, { message: '歌单信息无效。' })
      const kind = String(req.query.kind || 'playlist')
      const detail = kind === 'song'
        ? bodyOf(await songDetail({ ids: id, cookie }))
        : bodyOf(await playlistTrackAll({ id, cookie, limit: 50, offset: 0 }))
      if (Number(detail.code) >= 400) return send(res, Number(detail.code) === 401 ? 403 : 502, { message: detail.message || '网易云暂时无法读取这个链接。' })
      const songs = detail.songs || []
      if (!songs.length) return send(res, 200, { songs: [], urls: [] })
      const playable = bodyOf(await songUrl({ id: songs.map(song => song.id).join(','), br: 320000, cookie }))
      return send(res, 200, { songs, urls: playable.data || [] })
    }

    if (action === 'logout') {
      clearSession(res)
      return send(res, 200, { connected: false })
    }

    return send(res, 400, { message: '未知的网易云操作。' })
  } catch (error) {
    console.error('NetEase gateway error:', action, error?.message)
    return send(res, 502, { message: error?.message || '网易云音乐暂时无法响应。' })
  }
}
