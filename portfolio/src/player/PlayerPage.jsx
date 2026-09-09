import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Headphones, ImagePlus, ListMusic, Pause, Play, Plus, RotateCcw, SkipBack, SkipForward, Trash2, Volume2, VolumeX } from 'lucide-react'
import CursorTrail from '../components/CursorTrail'
import BorderGlow from '../components/reactbits/BorderGlow'
import AmbientVideo from '../components/AmbientVideo'
import { useMusic } from './MusicProvider'
import NeteasePanel from './NeteasePanel'
import { validateCoverFile } from './playerCustomization'
import './player.css'

const formatTime = value => Number.isFinite(value) ? `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}` : '0:00'

export default function PlayerPage() {
  const music = useMusic()
  const [source, setSource] = useState('local')
  const wallpaperUrl = useRef('')
  const [wallpaper, setWallpaper] = useState('')
  const [wallpaperError, setWallpaperError] = useState('')
  const changeSource = next => { if (next === 'netease') music.pause(); setSource(next) }
  const defaultCover = music.track.artwork || `${import.meta.env.BASE_URL}media/player-cover.jpg`
  const updateWallpaper = file => {
    const validation = validateCoverFile(file)
    if (!validation.ok) { setWallpaperError(validation.message); return }
    if (wallpaperUrl.current) URL.revokeObjectURL(wallpaperUrl.current)
    wallpaperUrl.current = URL.createObjectURL(file)
    setWallpaper(wallpaperUrl.current)
    setWallpaperError('')
  }
  const resetWallpaper = () => {
    if (wallpaperUrl.current) URL.revokeObjectURL(wallpaperUrl.current)
    wallpaperUrl.current = ''
    setWallpaper('')
    setWallpaperError('')
  }
  useEffect(() => () => { if (wallpaperUrl.current) URL.revokeObjectURL(wallpaperUrl.current) }, [])
  return <div className="player-page" style={{ '--track-accent': music.track.accent }}>
    <CursorTrail />
    <AmbientVideo className="player-backdrop" src={`${import.meta.env.BASE_URL}media/silver-motion.mp4`} poster={`${import.meta.env.BASE_URL}media/silver-poster.jpg`} />
    <header className="player-nav"><a href="./" className="back-link"><ArrowLeft size={18} />返回作品集</a><span>lilzho / listening room</span></header>
    <main className="player-stage">
      <section className="record-visual" aria-label="音乐封面">
        <div className={`record-frame ${music.playing ? 'is-playing' : ''}`}><img src={wallpaper || defaultCover} alt={wallpaper ? '自定义播放器壁纸' : music.track.artwork ? `${music.track.title} 封面` : '暗色幻想场景音乐封面'} /><div className="record-disc"><span>lilzho</span></div></div>
        <div className="cover-actions"><label><ImagePlus size={16} />更换壁纸<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="更换播放器壁纸" onChange={event => { updateWallpaper(event.target.files?.[0]); event.target.value = '' }} /></label>{wallpaper && <button onClick={resetWallpaper}><RotateCcw size={15} />恢复默认</button>}</div>
        {wallpaperError && <p className="cover-error" role="alert">{wallpaperError}</p>}
        <p>在声音里停一会儿，让想法慢慢生长。</p>
      </section>
      <BorderGlow backgroundColor="#131216" glowColor="25 65 70" colors={['#b47764', '#873b50', '#c4b3a1']} glowIntensity={.6} borderRadius={20} className="player-glow">
        <section className="player-console" aria-label="音乐播放器">
          <div className="source-switch" role="group" aria-label="音乐来源"><button aria-pressed={source === 'local'} onClick={() => changeSource('local')}>我的播放列表</button><button aria-pressed={source === 'netease'} onClick={() => changeSource('netease')}>网易云音乐 <span>↗</span></button></div>
          {source === 'netease' ? <NeteasePanel /> : <>
            <h1>{music.track.title}</h1><p className="track-descriptor">{music.track.descriptor}</p>
            {music.blocked && <button className="player-unlock" onClick={music.play}><Headphones size={17} />点击开启音乐</button>}
            {music.tracks.length > 0 && <><label className="progress-control"><span className="sr-only">播放进度</span><input type="range" min="0" max={Number.isFinite(music.duration) ? music.duration : 0} step="0.01" value={Math.min(music.time, music.duration || 0)} onChange={event => music.seek(Number(event.target.value))} /><span className="time-row"><i>{formatTime(music.time)}</i><i>{formatTime(music.duration)}</i></span></label>
            {music.error && <p className="media-error" role="status">{music.error}</p>}
            <div className="transport"><button aria-label="上一首" onClick={() => music.choose(music.index - 1)}><SkipBack size={21} /></button><button className="play-control" aria-label={music.playing ? '暂停音乐' : '播放音乐'} onClick={music.toggle}>{music.playing ? <Pause size={28} /> : <Play size={28} />}</button><button aria-label="下一首" onClick={() => music.choose(music.index + 1)}><SkipForward size={21} /></button></div>
            <div className="volume-row"><button aria-label={music.muted ? '取消静音' : '静音'} onClick={() => music.setMuted(!music.muted)}>{music.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button><label><span className="sr-only">音量</span><input type="range" min="0" max="1" step="0.01" value={music.volume} onChange={event => { music.setVolume(Number(event.target.value)); music.setMuted(false) }} /></label></div></>}
            {!music.tracks.length && <p className="empty-playlist">还没有歌曲。添加本地音乐，或从网易云歌单载入。</p>}
            <div className="local-import"><label className="import-button"><Plus size={17} />添加自己的歌曲<input aria-label="添加本地歌曲" type="file" accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.flac" multiple onChange={event => { music.importFiles(event.target.files); event.target.value = '' }} /></label><small>文件仅在你的浏览器播放，不上传。刷新后需重新添加。</small></div>
            <div className="track-list"><span><ListMusic size={16} />播放列表 · {music.tracks.length} 首</span>{music.tracks.map((track, index) => <div className={`track-row ${index === music.index ? 'active' : ''}`} key={track.id}><button className="track-select" aria-pressed={index === music.index} onClick={() => music.choose(index)}><i>{String(index + 1).padStart(2, '0')}</i><b>{track.title}</b><small>{track.local ? '本地' : track.source === 'netease' ? '网易云' : '氛围片段'}</small></button><button className="track-delete" aria-label={`从播放列表删除 ${track.title}`} onClick={() => music.removeTrack(track.id)}><Trash2 size={15} /></button></div>)}</div>
          </>}
        </section>
      </BorderGlow>
    </main>
  </div>
}
