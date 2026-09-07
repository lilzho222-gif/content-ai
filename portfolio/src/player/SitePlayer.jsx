import { useCallback, useEffect, useRef, useState } from 'react'
import { Headphones, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { tracks } from './trackData'

export default function SitePlayer() {
  const audioRef = useRef(null)
  const wantsPlaying = useRef(true)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const track = tracks[trackIndex]

  const attemptPlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      audio.muted = false
      await audio.play()
      wantsPlaying.current = true
      setMuted(false)
      setAutoplayBlocked(false)
    } catch {
      setAutoplayBlocked(true)
    }
  }, [])

  const chooseTrack = index => {
    wantsPlaying.current = true
    setTrackIndex((index + tracks.length) % tracks.length)
  }

  useEffect(() => {
    const audio = audioRef.current
    audio.load()
    if (wantsPlaying.current) attemptPlayback()
  }, [trackIndex, attemptPlayback])

  useEffect(() => {
    if (!autoplayBlocked) return undefined
    const unlock = () => attemptPlayback()
    document.addEventListener('pointerdown', unlock, { once: true })
    document.addEventListener('keydown', unlock, { once: true })
    return () => {
      document.removeEventListener('pointerdown', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [autoplayBlocked, attemptPlayback])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (audio.paused) attemptPlayback()
    else {
      wantsPlaying.current = false
      audio.pause()
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return <>
    {autoplayBlocked && <button className="sound-unlock" onClick={attemptPlayback}>
      <span><Headphones size={18} /></span>
      <strong>开启音乐</strong>
      <small>浏览器需要你点击一次</small>
    </button>}
    <aside className="site-player" aria-label="网页音乐播放器">
      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        autoPlay
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => chooseTrack(trackIndex + 1)}
      />
      <div className="site-player-copy">
        <i className={playing ? 'playing' : ''}><span /><span /><span /></i>
        <div><small>NOW PLAYING</small><strong>{track.title}</strong></div>
      </div>
      <div className="site-player-controls">
        <button aria-label="上一首" onClick={() => chooseTrack(trackIndex - 1)}><SkipBack size={16} /></button>
        <button className="site-play" aria-label={playing ? '暂停' : '播放'} onClick={togglePlayback}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
        <button aria-label="下一首" onClick={() => chooseTrack(trackIndex + 1)}><SkipForward size={16} /></button>
        <button aria-label={muted ? '取消静音' : '静音'} onClick={toggleMute}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
      </div>
    </aside>
  </>
}
