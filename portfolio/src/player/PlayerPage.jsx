import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ListMusic, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import CursorTrail from '../components/CursorTrail'
import { tracks } from './trackData'
import './player.css'

const formatTime = value => {
  if (!Number.isFinite(value)) return '0:00'
  return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`
}

export default function PlayerPage({ labels }) {
  const audioRef = useRef(null)
  const continuePlaying = useRef(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState(0)
  const [volume, setVolume] = useState(.72)
  const [muted, setMuted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const track = tracks[trackIndex]

  const chooseTrack = (index, autoplay = playing) => {
    continuePlaying.current = autoplay
    setFailed(false)
    setTrackIndex((index + tracks.length) % tracks.length)
  }

  useEffect(() => {
    const audio = audioRef.current
    audio.load()
    setTime(0)
    setDuration(0)
    audio.muted = false
    audio.play().then(() => setAutoplayBlocked(false)).catch(() => {
      setPlaying(false)
      setAutoplayBlocked(true)
    })
  }, [trackIndex])

  const toggle = () => {
    const audio = audioRef.current
    if (audio.paused) audio.play().catch(() => setFailed(true))
    else audio.pause()
  }

  return <div className="player-page" style={{ '--track-accent': track.accent }}>
    <CursorTrail />
    <video key={track.src} className="player-backdrop" src={track.src} autoPlay muted loop playsInline aria-hidden="true" />
    <header className="player-nav">
      <a href="./" className="back-link"><ArrowLeft size={18} /> 返回作品集</a>
      <span>lilzho / listening room</span>
    </header>
    <main className="player-stage">
      <section className="record-visual" aria-label={`${track.title}动态封面`}>
        <div className={`record-frame ${playing ? 'is-playing' : ''}`}>
          <img src={`${import.meta.env.BASE_URL}media/player-cover.jpg`} alt="暗色幻想场景音乐封面" />
          <div className="record-disc"><span>lilzho</span></div>
        </div>
        <p>两个短片段，一间给思绪留白的房间。</p>
      </section>
      <section className="player-console" aria-label="音乐播放器">
        <p className="player-kicker">NOW PLAYING / {String(trackIndex + 1).padStart(2, '0')}</p>
        <h1>{track.title}</h1>
        <p className="track-descriptor">{track.descriptor}</p>
        {autoplayBlocked && <button className="player-unlock" onClick={() => audioRef.current.play().then(() => setAutoplayBlocked(false))}><Headphones size={17} /> 点击开启音乐</button>}
        <audio ref={audioRef} src={track.src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onEnded={() => chooseTrack(trackIndex + 1, true)} onError={() => { setFailed(true); setPlaying(false) }} />
        <label className="progress-control">
          <span className="sr-only">播放进度</span>
          <input type="range" min="0" max={duration || 0} step="0.01" value={Math.min(time, duration || 0)} onChange={event => { const next = Number(event.target.value); audioRef.current.currentTime = next; setTime(next) }} />
          <span className="time-row"><i>{formatTime(time)}</i><i>{formatTime(duration)}</i></span>
        </label>
        {failed && <p className="media-error" role="status">片段未能加载，请刷新页面后重试。</p>}
        <div className="transport">
          <button aria-label={labels.previous} onClick={() => chooseTrack(trackIndex - 1)}><SkipBack size={21} /></button>
          <button className="play-control" aria-label={playing ? '暂停氛围片段' : labels.play} onClick={toggle} disabled={failed}>{playing ? <Pause size={28} /> : <Play size={28} />}</button>
          <button aria-label={labels.next} onClick={() => chooseTrack(trackIndex + 1)}><SkipForward size={21} /></button>
        </div>
        <div className="volume-row">
          <button aria-label={muted ? '取消静音' : '静音'} onClick={() => { audioRef.current.muted = !muted; setMuted(!muted) }}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <label><span className="sr-only">音量</span><input type="range" min="0" max="1" step="0.01" value={volume} onChange={event => { const next = Number(event.target.value); audioRef.current.volume = next; setVolume(next); if (next > 0 && muted) { audioRef.current.muted = false; setMuted(false) } }} /></label>
        </div>
        <div className="track-list"><span><ListMusic size={16} /> 播放列表</span>{tracks.map((item, index) => <button key={item.id} className={index === trackIndex ? 'active' : ''} onClick={() => chooseTrack(index)}><i>{String(index + 1).padStart(2, '0')}</i><b>{item.title}</b><small>{item.descriptor}</small></button>)}</div>
      </section>
    </main>
  </div>
}
