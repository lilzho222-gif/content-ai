import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import AmbientVideo from './AmbientVideo'

export default function VideoBackdrop({ name, src, poster, tone = 'crimson' }) {
  const [paused, setPaused] = useState(false)
  return <>
    <div className={`section-video-layer ${tone}`} aria-hidden="true">
      <AmbientVideo src={src} poster={poster} paused={paused} />
      <div className="section-video-shade" />
    </div>
    <button className="backdrop-toggle" onClick={() => setPaused(value => !value)} aria-label={`${paused ? '恢复' : '暂停'}${name}背景动效`} aria-pressed={paused}>
      {paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? '恢复动效' : '暂停动效'}</span>
    </button>
  </>
}
