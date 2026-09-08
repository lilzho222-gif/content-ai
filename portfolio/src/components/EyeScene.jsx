import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
const EvilEye = lazy(() => import('./reactbits/EvilEye'))

class EyeBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <div className="eye-fallback" /> : this.props.children }
}

export default function EyeScene() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const sync = () => setActive(visible && !document.hidden && !reduce.matches)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(ref.current)
    reduce.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); reduce.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync) }
  }, [])
  return <div ref={ref} className="eye-scene" aria-hidden="true">
    <div className="eye-fallback" />
    {active && <EyeBoundary><Suspense fallback={null}><EvilEye eyeColor="#FF6F37" intensity={1.5} pupilSize={0.6} irisWidth={0.25} glowIntensity={0.35} scale={0.8} noiseScale={1.0} pupilFollow={1.0} flameSpeed={1.0} backgroundColor="#000000" /></Suspense></EyeBoundary>}
  </div>
}
