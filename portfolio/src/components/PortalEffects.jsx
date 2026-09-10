import { useId } from 'react'
import { ArrowUpRight, Headphones, Layers3, UserRound } from 'lucide-react'
import { viewHref } from '../navigation'
import AmbientVideo from './AmbientVideo'

export function DotField() {
  return <div className="portal-dot-field" aria-hidden="true" />
}

export function CurvedLoop() {
  const id = useId().replaceAll(':', '')
  return <svg className="portal-curved-loop" viewBox="0 0 600 150" aria-hidden="true">
    <defs><path id={id} d="M -600 75 Q -450 0 -300 75 T 0 75 T 300 75 T 600 75 T 900 75 T 1200 75" /></defs>
    <text><textPath href={`#${id}`}>IDEAS INTO REALITY · 持续学习，持续构建 · IDEAS INTO REALITY · 持续学习，持续构建 · IDEAS INTO REALITY ·<animate attributeName="startOffset" from="0%" to="33.33%" dur="28s" repeatCount="indefinite" /></textPath></text>
  </svg>
}

export function PortalDock() {
  const items = [['works', '作品空间', Layers3], ['about', '个人档案', UserRound], ['player', '声音空间', Headphones]]
  return <nav className="portal-dock" aria-label="空间快捷入口">{items.map(([view, label, Icon]) => <a href={viewHref(view)} key={view}><Icon size={20} /><span>{label}</span></a>)}</nav>
}

export function FlyingPosterRail() {
  const items = [['about', '继续认识我', 'moon-orbit'], ['player', '让思绪慢下来', 'blue-bloom']]
  return <div className="flying-poster-rail" aria-label="更多空间">{items.map(([view, title, file]) => <a href={viewHref(view)} key={view}><img loading="lazy" src={`${import.meta.env.BASE_URL}media/${file}.png`} alt="" /><span>{title}<ArrowUpRight size={18} /></span></a>)}</div>
}

export function FloatingLines() {
  return <div className="floating-lines" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
}

export function EchoText({ children, className = '' }) {
  return <span className={`echo-text ${className}`} data-text={children}>{children}</span>
}

export function VisualSignalRail() {
  const base = import.meta.env.BASE_URL
  return <section className="visual-signals" aria-label="视觉灵感片段">
    <header><span>VISUAL SIGNALS / 02</span><h2>素材不是装饰，<br />它们负责建立情绪。</h2><p>你提供的动态片段被整理为视觉语言参考，不被伪装成项目成果。</p></header>
    <div className="signal-reel">
      <a className="signal-card signal-decay" href={viewHref('project')}>
        <AmbientVideo src={`${base}media/character-signal.mp4`} />
        <span>01 / 叙事张力</span><strong>看项目如何被构建 <ArrowUpRight size={18} /></strong>
      </a>
      <a className="signal-card signal-mono" href={viewHref('about')}>
        <AmbientVideo src={`${base}media/mono-signal.mp4`} />
        <span>02 / 黑白信号</span><strong>认识创作者本人 <ArrowUpRight size={18} /></strong>
      </a>
    </div>
  </section>
}
