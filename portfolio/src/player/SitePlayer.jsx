import { Headphones, ListMusic, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useMusic } from './MusicProvider'

export default function SitePlayer() {
  const music = useMusic()
  return <>
    {music.blocked && <button className="sound-unlock" onClick={music.play}><span><Headphones size={18} /></span><strong>开启音乐</strong><small>点击播放，陪你逛一会儿</small></button>}
    <aside className="site-player" aria-label="网页音乐播放器">
      {music.error && <p className="site-player-error" role="status">{music.error}</p>}
      <div className="site-player-copy"><i className={music.playing ? 'playing' : ''} aria-hidden="true"><span /><span /><span /></i><div><small>{music.playing ? '正在播放' : '音乐空间'}</small><strong>{music.track.title}</strong></div></div>
      <div className="site-player-controls">
        <button aria-label="上一首" onClick={() => music.choose(music.index - 1)}><SkipBack size={16} /></button>
        <button className="site-play" aria-label={music.playing ? '暂停音乐' : '播放音乐'} onClick={music.toggle}>{music.playing ? <Pause size={17} /> : <Play size={17} />}</button>
        <button aria-label="下一首" onClick={() => music.choose(music.index + 1)}><SkipForward size={16} /></button>
        <button aria-label={music.muted ? '取消静音' : '静音'} onClick={() => music.setMuted(!music.muted)}>{music.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
      </div>
      <a className="site-player-expand" href="?view=player" aria-label="打开歌单与网易云音乐"><ListMusic size={19} /></a>
    </aside>
  </>
}
