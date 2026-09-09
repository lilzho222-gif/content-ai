import {
  ArrowDownRight, ArrowLeft, ArrowUpRight, Bot, Code2, Headphones,
  Menu, Pause, Play, Sparkles, X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CursorTrail from './components/CursorTrail'
import Reveal from './components/Reveal'
import PlayerPage from './player/PlayerPage'
import SitePlayer from './player/SitePlayer'
import BorderGlow from './components/reactbits/BorderGlow'
import FlowingMenu from './components/reactbits/FlowingMenu'
import EyeScene from './components/EyeScene'
import AmbientVideo from './components/AmbientVideo'
import VideoBackdrop from './components/VideoBackdrop'
import { MusicProvider } from './player/MusicProvider'
import { tracks as trackData } from './player/trackData'
import './styles.css'
import './enhancements.css'

const github = 'https://github.com/lilzho222-gif/content-ai'
const playerLabels = { play: '播放氛围片段', previous: '上一首', next: '下一首' }
const Glass = ({ className = '', children }) => <div className={`glass ${className}`}>{children}</div>
const media = file => `${import.meta.env.BASE_URL}media/${file}`
const glow = { colors: ['#cc7858', '#923c52', '#c5b5a3'], glowColor: '25 65 70', glowIntensity: .85, borderRadius: 18, backgroundColor: '#111217', fillOpacity: .16 }

function Navigation() {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <div className="nav-shell">
      <a className="wordmark" href="#top" aria-label="lilzho 首页"><Code2 size={21} aria-hidden="true" /><b>lilzho</b><span>张皓哲</span></a>
      <button className="menu" aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="main-nav" aria-label="主导航" className={open ? 'links shown' : 'links'} onKeyDown={event => event.key === 'Escape' && setOpen(false)}>
        <a href="#project" onClick={() => setOpen(false)}>作品</a>
        <a href="#about" onClick={() => setOpen(false)}>关于我</a>
        <a href="#now" onClick={() => setOpen(false)}>现在</a>
        <a className="music-nav" href="?view=player"><Headphones size={15} />播放器</a>
        <a className="github" href={github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>
      </nav>
    </div>
  </header>
}

function Hero() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const video = videoRef.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => reduced.matches ? video.pause() : video.play().catch(() => setPlaying(false))
    sync()
    reduced.addEventListener('change', sync)
    return () => { reduced.removeEventListener('change', sync); video.pause() }
  }, [])
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <video ref={videoRef} className="hero-video" hidden={failed} muted loop playsInline preload="metadata" poster={`${import.meta.env.BASE_URL}media/player-cover.jpg`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} aria-hidden="true">
      <source src={`${import.meta.env.BASE_URL}media/autumn.mp4`} type="video/mp4" />
    </video>
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
    <div className="hero-inner">
      <p className="hero-index">ZHANG HAOZHE <span>✦</span> LILZHO</p>
      <h1 id="hero-title">把想法，<br />做成真正<br /><em>能用的东西。</em></h1>
      <p className="hero-role">AI 内容工具独立开发者 / 内容创作实践者<br />正在学习产品、前端与 AI 应用。</p>
      <div className="hero-actions">
        <a className="primary-action" href="#project">查看我的作品 <ArrowDownRight size={18} /></a>
        <a className="plain-action" href="?view=player"><Headphones size={18} />进入声音空间</a>
      </div>
    </div>
    <BorderGlow {...glow} className="hero-note-glow"><div className="hero-note-content">
      <span className="pulse-dot" aria-hidden="true" />
      <div><small>NOW BUILDING</small><strong>AI 短视频脚本生成器</strong></div>
      <a href="#project" aria-label="查看正在构建的项目"><ArrowUpRight size={18} /></a>
    </div></BorderGlow>
    <div className="hero-controls">
      <span>CONTENT × AI × PRODUCT</span>
      <button disabled={failed} onClick={() => videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()} aria-label={failed ? '背景视频不可用' : playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <Pause size={13} /> : <Play size={13} />}{failed ? '静态背景' : playing ? '暂停' : '播放'}</button>
    </div>
  </section>
}

function About() {
  return <Reveal as="section" className="about section" id="about">
    <div className="section-title"><span>关于我</span><h2>从内容中发现问题，<br />用产品寻找答案。</h2></div>
    <div className="about-grid">
      <p className="about-lead">我不是虚构的“资深专家”。现在的我是一名内容实践者与 AI 工具开发者：认真观察创作，也认真把想法变成可以使用的小产品。</p>
      <div className="about-facts">
        <div><small>教育背景</small><strong>江苏信息职业技术学院</strong><span>物流管理专业 · 2024 — 至今</span></div>
        <div><small>我看重</small><strong>学习速度、执行力、产品意识</strong><span>能力还在生长，作品已经开始发生。</span></div>
      </div>
    </div>
  </Reveal>
}

function ImageInterlude() {
  return <Reveal as="section" className="image-interlude">
    <img src={`${import.meta.env.BASE_URL}media/player-cover.jpg`} alt="暗色幻想艺术场景，作为个人创作世界的视觉参考" />
    <div className="image-vignette" aria-hidden="true" />
    <div className="image-copy"><span>MY CREATIVE WORLD</span><p>内容是观察世界的方式，<br />工具是把观察留下来的方法。</p></div>
  </Reveal>
}

function ProjectVisual() {
  return <div className="project-visual">
    <div className="code-grid" aria-hidden="true" />
    <div className="tool-window">
      <div className="window-bar"><i /><i /><i /><span>content-ai / script</span></div>
      <p><em>提示</em> 为小红书生成一条短视频脚本</p>
      <div className="generated-copy"><b>开头钩子</b><span>别再从“大家好”开始你的视频了……</span><b>内容结构</b><span>痛点 → 转折 → 可执行的方法</span></div>
    </div>
    <span className="visual-caption">DEEPSEEK API / REACT</span>
  </div>
}

function Project() {
  return <section className="project video-section" id="project">
    <VideoBackdrop name="作品" src={media('crimson-motion.mp4')} poster={media('crimson-poster.jpg')} />
    <div className="section section-foreground">
    <div className="section-title"><span>精选作品</span><h2>从真实创作需求<br />出发的一次尝试。</h2></div>
    <BorderGlow {...glow} className="project-glow"><article className="feature">
      <ProjectVisual />
      <div className="feature-info">
        <p className="project-number">PROJECT / 001</p>
        <h3>AI 短视频<br />脚本生成器</h3>
        <p>面向抖音、小红书、B 站创作者，用 AI 帮助他们跨过“想开始，却不知道怎么开始”的空白时刻。</p>
        <dl>
          <div><dt>我负责</dt><dd>产品策划、用户需求分析、前端开发</dd></div>
          <div><dt>技术</dt><dd>React / DeepSeek API / AI 应用</dd></div>
        </dl>
        <div className="tags"><i>产品策划</i><i>前端开发</i><i>AI 应用</i><i>内容创作</i></div>
        <a href={github} target="_blank" rel="noreferrer">查看 GitHub 项目 <ArrowUpRight size={17} /></a>
      </div>
    </article></BorderGlow>
    </div>
  </section>
}

function MusicPortal() {
  const preview = trackData[1]
  return <Reveal as="section" className="music-portal">
    <AmbientVideo src={preview.src} poster={media('silver-poster.jpg')} />
    <div className="portal-shade" aria-hidden="true" />
    <div className="portal-copy">
      <Headphones size={30} />
      <span>A SMALL LISTENING ROOM</span>
      <h2>给思绪一点<br />属于自己的声音。</h2>
      <p>两段来自你提供素材的氛围片段。</p>
      <a href="?view=player">打开播放器 <ArrowUpRight size={18} /></a>
    </div>
  </Reveal>
}

const skills = [
  { icon: <Sparkles />, title: '内容与平台', text: '熟悉抖音、小红书、B 站的内容语境与创作节奏。', tags: ['抖音', '小红书', 'B 站'] },
  { icon: <Bot />, title: 'AI 应用', text: '用 DeepSeek、Claude 等工具辅助内容探索与产品思考。', tags: ['DeepSeek', 'Claude', '提示词'] },
  { icon: <Code2 />, title: '产品与开发', text: '从用户需求出发做产品策划，并用前端把想法做成可用的小产品。', tags: ['需求分析', '产品策划', '前端'] },
]

function Capabilities() {
  return <section className="capabilities video-section" id="capabilities">
    <VideoBackdrop name="能力" src={media('silver-motion.mp4')} poster={media('silver-poster.jpg')} tone="silver" />
    <div className="section section-foreground">
    <div className="section-title compact"><span>我能做什么</span><h2>仍在学习，<br />也已经在做。</h2></div>
    <div className="capability-list">{skills.map((skill, index) => <article key={skill.title}>
      <span className="skill-index">0{index + 1}</span><div className="skill-icon">{skill.icon}</div>
      <h3>{skill.title}</h3><p>{skill.text}</p><div>{skill.tags.map(tag => <i key={tag}>{tag}</i>)}</div>
    </article>)}</div>
    </div>
  </section>
}

function Direction() {
  return <Reveal as="section" className="direction section" id="exploring">
    <EyeScene />
    <div className="direction-content">
      <div className="section-title"><h2>保持好奇，<br /><em>看见更多可能。</em></h2><p className="eye-caption">移动鼠标，探索视线的方向。</p></div>
      <div className="direction-copy"><p><b>从创作开始</b>我在真实的内容场景里理解卡点，而不是只在纸上谈产品。</p><p><b>把想法落地</b>我用 AI 工具探索方向，也在学习前端开发，让工具真正被打开、使用与改进。</p></div>
    </div>
  </Reveal>
}

function ExploreMenu() {
  return <section className="explore-menu section" id="explore-menu" aria-labelledby="explore-heading">
    <div className="explore-heading"><h2 id="explore-heading">接下来，去哪里？</h2><p>认识我，看看作品，或者听一首歌。</p></div>
    <FlowingMenu items={[
      { link: '#project', text: '看看作品', image: media('silver-poster.jpg') },
      { link: '#exploring', text: '探索更多', image: media('crimson-poster.jpg') },
      { link: '?view=player', text: '听点声音', image: media('player-cover.jpg') },
    ]} speed={18} textColor="#e9e0d7" bgColor="#0c0d11" marqueeBgColor="#d4a077" marqueeTextColor="#171215" borderColor="#3b3030" />
  </section>
}

function Now() {
  const items = ['继续打磨 AI 内容工具', '积累真实的个人作品', '学习产品、前端和 AI 应用', '先成为认真创作的人，再考虑帮助更多创作者']
  return <Reveal as="section" className="now" id="now"><div className="now-inner">
    <div className="section-title"><span>现在</span><h2>正在构建中。</h2></div>
    <div className="now-list">{items.map((item, index) => <p key={item}><i>0{index + 1}</i>{item}</p>)}</div>
    <a className="primary-action" href={github} target="_blank" rel="noreferrer">GitHub 上查看项目 <ArrowUpRight size={17} /></a>
  </div></Reveal>
}

function Footer() {
  return <footer><a href="#top" className="footer-brand">lilzho</a><span>张皓哲的个人作品集</span><a href="?view=player"><Headphones size={15} />听点声音</a><em>持续学习，持续构建</em></footer>
}

function PortfolioPage() {
  return <div className="app-shell"><CursorTrail /><Navigation /><main><Hero /><About /><ExploreMenu /><Project /><Capabilities /><Direction /><ImageInterlude /><MusicPortal /><Now /></main><Footer /><SitePlayer /></div>
}

function App() {
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get('view'))
  useEffect(() => {
    const update = () => setView(new URLSearchParams(window.location.search).get('view'))
    const navigate = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest('a')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search === location.search) return
      event.preventDefault()
      history.pushState({}, '', url)
      update()
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    document.addEventListener('click', navigate)
    window.addEventListener('popstate', update)
    return () => { document.removeEventListener('click', navigate); window.removeEventListener('popstate', update) }
  }, [])
  return <MusicProvider>{view === 'player' ? <PlayerPage labels={playerLabels} /> : <PortfolioPage />}</MusicProvider>
}

createRoot(document.getElementById('root')).render(<App />)
