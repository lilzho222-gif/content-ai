import { useEffect, useRef, useState } from 'react'

export default function AmbientVideo({ src, poster, className = '', controls = false }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const video = ref.current
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const sync = () => {
      if (visible && !document.hidden && !reduce.matches) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(video)
    reduce.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); reduce.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); video.pause() }
  }, [src])
  return <video ref={ref} className={className} src={failed ? undefined : src} poster={poster} muted loop playsInline preload="metadata" controls={controls} aria-hidden={!controls} onError={() => setFailed(true)} />
}
