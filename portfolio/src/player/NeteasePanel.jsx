import { useState } from 'react'
import { ArrowUpRight, Link2 } from 'lucide-react'
import { parseNeteaseLink } from './musicLinks'
import { useMusic } from './MusicProvider'

export default function NeteasePanel() {
  const music = useMusic()
  const [input, setInput] = useState(() => { try { return localStorage.getItem('lilzho-netease-link') || '' } catch { return '' } })
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const submit = event => {
    event.preventDefault()
    try {
      const result = parseNeteaseLink(input)
      music.pause(); setSelected(result); setError('')
      try { localStorage.setItem('lilzho-netease-link', result.url) } catch { /* Private browsing may disable storage. */ }
    } catch (reason) { setError(reason.message) }
  }
  return <section className="netease-panel" aria-labelledby="netease-heading">
    <div className="netease-title"><div><h2 id="netease-heading">把喜欢的歌带过来。</h2><p>网易云音乐 · 歌曲与歌单</p></div><a href="https://music.163.com/" target="_blank" rel="noreferrer" onClick={music.pause}>去网易云登录 <ArrowUpRight size={17} /></a></div>
    <p className="netease-note">在网易云官网登录后，复制歌曲或公开歌单链接到这里。当前支持官方外链播放器，暂不支持在本站同步账号、私人歌单或会员权限。</p>
    <form onSubmit={submit}><label htmlFor="netease-link">网易云歌曲 / 歌单链接</label><div className="netease-input-row"><input id="netease-link" value={input} onChange={event => setInput(event.target.value)} placeholder="https://music.163.com/#/playlist?id=…" type="url" required aria-describedby="netease-help" /><button type="submit"><Link2 size={17} />载入播放器</button></div><small id="netease-help">使用完整的 music.163.com 链接；分享短链接请先在网易云中打开。</small></form>
    {error && <p className="media-error" role="alert">{error}</p>}
    {selected && <div className="netease-embed"><iframe key={selected.embed} title="网易云官方外链播放器" src={selected.embed} width="100%" height={selected.kind === 'song' ? 110 : 450} allow="autoplay" /><p>歌曲是否可播放由网易云版权与外链权限决定。若播放器空白或无法播放，请在网易云打开。<a href={selected.url} target="_blank" rel="noreferrer">在网易云打开 <ArrowUpRight size={14} /></a></p><button onClick={() => setSelected(null)}>关闭网易云播放器</button></div>}
  </section>
}
