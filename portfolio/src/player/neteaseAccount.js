export function getNeteaseApiEndpoint(pageUrl = window.location.href) {
  return new URL('/api/netease', pageUrl).toString()
}

export function qrStatusLabel(code) {
  return ({
    800: '二维码已过期，请重新生成',
    801: '请使用网易云音乐 App 扫码',
    802: '已扫码，请在手机上确认',
    803: '登录成功，正在读取歌单',
  })[Number(code)] || '正在连接网易云音乐'
}

export function mergeNeteaseTracks(songs = [], urls = []) {
  const sources = new Map(urls.filter(item => item?.url).map(item => [Number(item.id), item.url]))
  return songs.flatMap(song => {
    const src = sources.get(Number(song.id))
    if (!src) return []
    const artist = song.ar?.map(item => item.name).filter(Boolean).join(' / ') || '网易云音乐'
    const album = song.al?.name || '单曲'
    return [{
      id: `netease-${song.id}`,
      title: song.name || '未命名歌曲',
      descriptor: `${artist} · ${album}`,
      src,
      artwork: song.al?.picUrl || '',
      accent: '#d49a6a',
      source: 'netease',
    }]
  })
}

export async function requestNetease(action, params = {}, signal, timeoutMs = 30000) {
  const url = new URL(getNeteaseApiEndpoint())
  url.searchParams.set('action', action)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  })
  const controller = signal ? null : new AbortController()
  let timer
  try {
    const response = await Promise.race([
      fetch(url, { credentials: 'include', signal: signal || controller.signal }),
      new Promise((_, reject) => { timer = setTimeout(() => { controller?.abort(); reject(new Error('网易云响应超时，请重试。')) }, timeoutMs) }),
    ])
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) throw new Error('账号连接需要在 Render 版本中使用。')
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.message || '网易云音乐连接失败，请稍后重试。')
    return payload
  } catch (error) {
    if (controller?.signal.aborted && error?.name === 'AbortError') {
      throw new Error('网易云响应超时，请重试。')
    }
    throw error
  } finally { clearTimeout(timer) }
}
