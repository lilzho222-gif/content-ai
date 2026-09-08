export function parseNeteaseLink(input) {
  let url
  try { url = new URL(input.trim()) } catch { throw new Error('请粘贴网易云歌曲或歌单的完整链接。') }
  if (url.protocol !== 'https:' || url.hostname !== 'music.163.com') throw new Error('请使用 music.163.com 的完整链接；短链接请先在网易云中打开后复制。')
  const route = url.hash.startsWith('#/') ? new URL(url.hash.slice(1), url.origin) : url
  const kind = route.pathname === '/song' || route.pathname === '/m/song' ? 'song' : route.pathname === '/playlist' || route.pathname === '/m/playlist' ? 'playlist' : null
  const id = route.searchParams.get('id')
  if (!kind || !id || !/^\d{1,20}$/.test(id)) throw new Error('链接中需要包含有效的歌曲或歌单 ID。')
  return { kind, id, url: `https://music.163.com/#/${kind}?id=${id}`, embed: `https://music.163.com/outchain/player?type=${kind === 'song' ? 2 : 0}&id=${id}&auto=0&height=${kind === 'song' ? 66 : 430}` }
}
