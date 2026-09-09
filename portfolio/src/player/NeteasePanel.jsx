import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Link2, LoaderCircle, LogOut, Music2, QrCode } from 'lucide-react'
import { mergeNeteaseTracks, qrLoginCanConnect, qrStatusLabel, requestNetease } from './neteaseAccount'
import { parseNeteaseLink } from './musicLinks'
import { useMusic } from './MusicProvider'

export default function NeteasePanel({ onTracksLoaded }) {
  const music = useMusic()
  const timer = useRef(null)
  const [account, setAccount] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [qr, setQr] = useState(null)
  const [status, setStatus] = useState('正在检查连接状态')
  const [busy, setBusy] = useState(true)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [input, setInput] = useState(() => { try { return localStorage.getItem('lilzho-netease-link') || '' } catch { return '' } })
  const [error, setError] = useState('')

  const loadAccount = useCallback(async () => {
    try {
      const session = await requestNetease('bootstrap', {}, undefined, 16000)
      if (!session.connected || !session.profile) { setAccount(null); setPlaylists([]); return false }
      setAccount(session.profile)
      setPlaylists(session.playlists || [])
      setStatus(`已连接 ${session.profile.nickname || '网易云账号'}`)
      return true
    } catch (reason) {
      const staticSite = /Render/.test(reason.message)
      setApiAvailable(!staticSite)
      setStatus(staticSite ? '账号连接将在 Render 版本启用' : '账号状态检查超时，仍可重新扫码')
      if (!staticSite) setError(reason.message)
      return false
    } finally { setBusy(false) }
  }, [])

  useEffect(() => { loadAccount(); return () => clearTimeout(timer.current) }, [loadAccount])

  const checkQr = useCallback(async key => {
    try {
      const result = await requestNetease('qr-check', { key })
      setStatus(qrStatusLabel(result.code))
      if (Number(result.code) === 803) {
        if (!qrLoginCanConnect(result)) {
          setStatus('手机已确认，但网易云没有返回登录凭证，请重新生成二维码')
          setBusy(false)
          return
        }
        setQr(null)
        await loadAccount()
        return
      }
      if (Number(result.code) === 800) { setBusy(false); return }
      timer.current = setTimeout(() => checkQr(key), 1800)
    } catch (reason) { setBusy(false); setError(reason.message) }
  }, [loadAccount])

  const startQr = async () => {
    clearTimeout(timer.current)
    setBusy(true); setError(''); setStatus('正在生成登录二维码')
    try {
      const result = await requestNetease('qr-start')
      setQr(result)
      setStatus(qrStatusLabel(801))
      timer.current = setTimeout(() => checkQr(result.key), 1200)
    } catch (reason) { setBusy(false); setError(reason.message) }
  }

  const openPlaylist = async playlist => {
    setBusy(true); setError(''); setStatus(`正在读取《${playlist.name}》`)
    try {
      const result = await requestNetease('tracks', { id: playlist.id })
      const tracks = mergeNeteaseTracks(result.songs, result.urls)
      if (!tracks.length) throw new Error('这个歌单里暂时没有可以播放的歌曲。')
      music.replaceTracks(tracks, { recommendedId: result.recommendedStartId })
      setStatus(`已载入《${playlist.name}》· ${tracks.length} 首`)
      onTracksLoaded?.()
    } catch (reason) { setError(reason.message) } finally { setBusy(false) }
  }

  const logout = async () => {
    setBusy(true); setError('')
    try { await requestNetease('logout'); setAccount(null); setPlaylists([]); setQr(null); setStatus('已断开网易云账号') }
    catch (reason) { setError(reason.message) } finally { setBusy(false) }
  }

  const submit = async event => {
    event.preventDefault()
    try {
      const link = parseNeteaseLink(input)
      setBusy(true); setError(''); setStatus('正在读取链接中的歌曲')
      const result = await requestNetease(link.api.action, { id: link.api.id, kind: link.api.kind })
      const tracks = mergeNeteaseTracks(result.songs, result.urls)
      if (!tracks.length) throw new Error(link.kind === 'playlist' ? '这个歌单没有可播放的歌曲。' : '这首歌暂时无法播放。')
      music.pause(); music.replaceTracks(tracks, { recommendedId: result.recommendedStartId })
      setStatus(`已从链接载入 ${tracks.length} 首歌曲`)
      try { localStorage.setItem('lilzho-netease-link', link.url) } catch { /* Private browsing may disable storage. */ }
      onTracksLoaded?.()
    } catch (reason) {
      setError(/隐私/.test(reason.message) ? '这个歌单是私密的。请先扫码连接创建该歌单的网易云账号。' : reason.message)
    } finally { setBusy(false) }
  }

  return <section className="netease-panel" aria-labelledby="netease-heading">
    <div className="netease-title"><div><h2 id="netease-heading">连接我的网易云。</h2><p>扫码登录 · 同步歌单 · 直接切歌</p></div>{account ? <button className="netease-logout" onClick={logout} disabled={busy}><LogOut size={16} />断开</button> : <a href="https://music.163.com/" target="_blank" rel="noreferrer" onClick={music.pause}>打开网易云 <ArrowUpRight size={17} /></a>}</div>

    <div className="netease-account-card">
      {account ? <>
        <div className="netease-profile">{account.avatarUrl ? <img src={account.avatarUrl} alt="网易云账号头像" /> : <span><Music2 /></span>}<div><small>CONNECTED</small><strong>{account.nickname}</strong><p>{status}</p></div></div>
        <div className="netease-playlists" aria-label="我的网易云歌单">{playlists.map(playlist => <button key={playlist.id} onClick={() => openPlaylist(playlist)} disabled={busy}><span>{playlist.coverImgUrl && <img src={playlist.coverImgUrl} alt="" />}</span><b>{playlist.name}</b><small>{playlist.trackCount || 0} 首</small></button>)}</div>
      </> : qr ? <div className="netease-qr"><img src={qr.qrimg} alt="网易云音乐登录二维码" /><div><QrCode size={18} /><strong>{status}</strong><small>二维码只用于本次登录，请在手机网易云音乐中确认。</small><button onClick={startQr} disabled={busy && status !== qrStatusLabel(800)}>重新生成</button></div></div> : <div className="netease-connect"><span><QrCode size={23} /></span><div><strong>用手机扫码连接</strong><p>{apiAvailable ? '登录后可以读取你的歌单，并在本站播放器中切换歌曲。' : 'GitHub Pages 继续正常使用；账号同步将在 Render 网址中启用。'}</p></div><button onClick={startQr} disabled={busy || !apiAvailable}>{busy ? <LoaderCircle className="spin" size={17} /> : <QrCode size={17} />}连接账号</button></div>}
      {busy && account && <p className="netease-loading"><LoaderCircle className="spin" size={15} />{status}</p>}
    </div>

    <div className="netease-divider"><span>或者使用公开链接</span></div>
    <form onSubmit={submit}><label htmlFor="netease-link">网易云歌曲 / 歌单链接</label><div className="netease-input-row"><input id="netease-link" value={input} onChange={event => setInput(event.target.value)} placeholder="https://music.163.com/#/playlist?id=…" type="url" required aria-describedby="netease-help" /><button type="submit" disabled={busy}><Link2 size={17} />导入本站播放器</button></div><small id="netease-help">私密歌单需先扫码连接创建该歌单的账号；会员与版权限制由网易云决定。</small></form>
    {error && <p className="media-error" role="alert">{error}</p>}
  </section>
}
