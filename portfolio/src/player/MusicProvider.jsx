import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { tracks as defaults } from './trackData'
import { removeTrackState } from './playerCustomization'
import { preferredTrackIndex } from './playerPerformance'

const MusicContext = createContext(null)
export const useMusic = () => useContext(MusicContext)
const emptyTrack = { id: 'empty', title: '播放列表是空的', descriptor: '添加歌曲后开始播放', src: '', accent: '#b47764' }

export function MusicProvider({ children }) {
  const audioRef = useRef(null)
  const urls = useRef([])
  const [tracks, setTracks] = useState(defaults)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState('')
  const [volume, setVolume] = useState(.45)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState(0)
  const [buffering, setBuffering] = useState(false)
  const desired = useRef(true)
  const sequence = useRef(0)
  const track = tracks[index] || tracks[0] || emptyTrack
  const play = useCallback(async () => {
    if (!audioRef.current?.src || !tracks.length) { setError('先添加一首歌曲再播放。'); return }
    desired.current = true
    const token = ++sequence.current
    setError('')
    try {
      await audioRef.current.play()
      if (token === sequence.current) setBlocked(false)
    } catch (reason) {
      if (token !== sequence.current || reason.name === 'AbortError') return
      if (reason.name === 'NotAllowedError') setBlocked(true)
      else { setBlocked(false); setError('这首暂时无法播放，请重试或换一首。') }
    }
  }, [tracks.length])
  const pause = useCallback(() => { desired.current = false; sequence.current++; audioRef.current.pause(); setBlocked(false) }, [])
  const choose = useCallback(next => {
    if (!tracks.length) return
    const value = (next + tracks.length) % tracks.length
    desired.current = true
    if (value === index) { audioRef.current.currentTime = 0; play() }
    else setIndex(value)
  }, [index, tracks.length, play])
  useEffect(() => {
    sequence.current++
    const audio = audioRef.current
    if (!track.src) {
      desired.current = false
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      setTime(0); setDuration(0); setPlaying(false)
      return
    }
    audio.src = track.src
    audio.load()
    setTime(0); setDuration(0); setError('')
    if (desired.current) play()
  }, [track.src, play])
  useEffect(() => { audioRef.current.volume = volume; audioRef.current.muted = muted }, [volume, muted])
  useEffect(() => () => urls.current.forEach(url => URL.revokeObjectURL(url)), [])
  const importFiles = files => {
    const accepted = Array.from(files).filter(file => /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(file.name) && file.size <= 100 * 1024 * 1024)
    if (!accepted.length) { setError('请选择 MP3、M4A、WAV、OGG 或 FLAC 音频，每首不超过 100MB。'); return }
    const added = accepted.map(file => {
      const src = URL.createObjectURL(file)
      urls.current.push(src)
      return { id: crypto.randomUUID(), title: file.name.replace(/\.[^.]+$/, ''), descriptor: '本地歌曲 · 仅当前页面', src, accent: '#cf9273', local: true }
    })
    desired.current = true
    setTracks(current => [...current, ...added]); setIndex(tracks.length); setError('')
  }
  const replaceTracks = (nextTracks, { recommendedId = '' } = {}) => {
    if (!Array.isArray(nextTracks) || !nextTracks.length) { setError('这个歌单暂时没有可播放的歌曲。'); return false }
    desired.current = true
    setTracks(nextTracks)
    setIndex(preferredTrackIndex(nextTracks, recommendedId))
    setError('')
    return true
  }
  const removeTrack = id => {
    const result = removeTrackState(tracks, index, id)
    if (!result.removed) return false
    if (result.removed.local && result.removed.src?.startsWith('blob:')) {
      URL.revokeObjectURL(result.removed.src)
      urls.current = urls.current.filter(url => url !== result.removed.src)
    }
    if (!result.tracks.length) {
      desired.current = false
      audioRef.current.pause()
      setBlocked(false)
    }
    setTracks(result.tracks)
    setIndex(result.index)
    setError('')
    return true
  }
  const seek = next => { if (Number.isFinite(duration) && duration > 0) { audioRef.current.currentTime = next; setTime(next) } }
  const value = { tracks, track, index, playing, buffering, blocked, error, volume, muted, duration, time, play, pause, choose, importFiles, replaceTracks, removeTrack, seek, setVolume, setMuted, toggle: () => playing ? pause() : play() }
  return <MusicContext.Provider value={value}>
    <audio ref={audioRef} preload="auto" onLoadStart={() => setBuffering(true)} onWaiting={() => setBuffering(true)} onCanPlay={() => setBuffering(false)} onPlaying={() => setBuffering(false)} onPlay={() => { setPlaying(true); setBlocked(false) }} onPause={() => setPlaying(false)} onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onEnded={() => choose(index + 1)} onError={() => { setBuffering(false); setError('音频加载失败，可以重试或切换歌曲。'); setPlaying(false) }} />
    {children}
  </MusicContext.Provider>
}
