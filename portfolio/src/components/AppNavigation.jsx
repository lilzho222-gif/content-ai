import { ArrowLeft, ArrowUpRight, Code2, Headphones, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { viewHref } from '../navigation'

const links = [
  ['home', '首页'],
  ['works', '作品'],
  ['about', '关于'],
  ['player', '声音'],
]

export default function AppNavigation({ current = 'home', back }) {
  const [open, setOpen] = useState(false)
  return <>
    <a className="skip-link" href="#main-content">跳到主要内容</a>
    <header className="spatial-nav">
      <a className="spatial-brand" href={viewHref('home')} aria-label="lilzho 首页">
        <Code2 size={19} aria-hidden="true" /><strong>lilzho</strong><span>张皓哲</span>
      </a>
      {back && <a className="route-back" href={back.href}><ArrowLeft size={17} />{back.label}</a>}
      <button className="spatial-menu" aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'spatial-links is-open' : 'spatial-links'} aria-label="主导航">
        {links.map(([view, label]) => <a key={view} href={viewHref(view)} aria-current={current === view ? 'page' : undefined} onClick={() => setOpen(false)}>{view === 'player' && <Headphones size={14} />}{label}</a>)}
        <a className="nav-github" href="https://github.com/lilzho222-gif/content-ai" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
      </nav>
    </header>
  </>
}

