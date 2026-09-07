import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(pointer: fine)')
    if (!ctx || reduced.matches || !fine.matches) return undefined

    let width = 0
    let height = 0
    let frame = 0
    let particles = []
    let previous = null
    let lastTime = performance.now()
    const colors = ['192,64,51', '231,156,83', '218,224,224']

    const resize = () => {
      width = innerWidth
      height = innerHeight
      const ratio = Math.min(devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const render = time => {
      const step = Math.min((time - lastTime) / 16.7, 2)
      lastTime = time
      ctx.clearRect(0, 0, width, height)
      particles = particles.filter(p => time - p.born < p.life)
      for (const p of particles) {
        const life = 1 - (time - p.born) / p.life
        p.x += p.vx * step
        p.y += p.vy * step
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.color},${life * .65})`
        ctx.arc(p.x, p.y, p.radius * (.35 + life * .65), 0, Math.PI * 2)
        ctx.fill()
      }
      frame = particles.length ? requestAnimationFrame(render) : 0
    }
    const move = event => {
      if (event.pointerType === 'touch') return
      const point = { x: event.clientX, y: event.clientY }
      const start = previous || point
      const distance = Math.hypot(point.x - start.x, point.y - start.y)
      const amount = Math.min(9, Math.max(2, Math.ceil(distance / 6)))
      const now = performance.now()
      for (let index = 0; index < amount; index++) {
        const progress = (index + 1) / amount
        particles.push({
          x: start.x + (point.x - start.x) * progress + (Math.random() - .5) * 7,
          y: start.y + (point.y - start.y) * progress + (Math.random() - .5) * 7,
          vx: (Math.random() - .5) * .45,
          vy: -.12 - Math.random() * .45,
          radius: .6 + Math.random() * 1.35,
          born: now,
          life: 420 + Math.random() * 480,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
      particles = particles.slice(-110)
      previous = point
      if (!frame) {
        lastTime = now
        frame = requestAnimationFrame(render)
      }
    }
    const reset = () => { previous = null }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      particles = []
      ctx.clearRect(0, 0, width, height)
    }
    const preferenceChanged = () => {
      stop()
      if (!reduced.matches && fine.matches) resize()
    }
    const visibilityChanged = () => { if (document.hidden) stop() }

    resize()
    addEventListener('resize', resize)
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerleave', reset)
    addEventListener('scroll', reset, { passive: true })
    document.addEventListener('visibilitychange', visibilityChanged)
    reduced.addEventListener('change', preferenceChanged)
    fine.addEventListener('change', preferenceChanged)
    return () => {
      stop()
      removeEventListener('resize', resize)
      removeEventListener('pointermove', move)
      removeEventListener('pointerleave', reset)
      removeEventListener('scroll', reset)
      document.removeEventListener('visibilitychange', visibilityChanged)
      reduced.removeEventListener('change', preferenceChanged)
      fine.removeEventListener('change', preferenceChanged)
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
}
