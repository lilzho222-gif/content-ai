import { ArrowDownRight, ArrowUpRight, Headphones, UserRound } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import AmbientVideo from '../components/AmbientVideo'
import BorderGlow from '../components/reactbits/BorderGlow'
import Reveal from '../components/Reveal'
import PageFooter from '../components/PageFooter'
import SitePlayer from '../player/SitePlayer'
import { projects, profile } from '../data/portfolio'
import { viewHref } from '../navigation'

const media = file => `${import.meta.env.BASE_URL}media/${file}`
const glow = { colors: ['#d59662', '#703f51', '#356d72'], glowColor: '28 56 66', glowIntensity: .7, borderRadius: 24, backgroundColor: '#111318', fillOpacity: .12 }

export default function HomePage() {
  const project = projects[0]
  return <div className="spatial-site home-page">
    <AppNavigation current="home" />
    <main id="main-content">
      <section className="home-hero">
        <AmbientVideo className="home-hero-video" src={media('autumn.mp4')} poster={media('player-cover.jpg')} />
        <div className="hero-atmosphere" aria-hidden="true"><i /><i /><i /></div>
        <div className="home-hero-copy">
          <h1>把想法，做成真正<br /><em>能用的东西。</em></h1>
          <div className="hero-intro">
            <p>{profile.name} / {profile.brand}</p>
            <span>{profile.role}</span>
          </div>
          <div className="hero-links">
            <a className="primary-route" href={viewHref('works')}>进入作品空间 <ArrowDownRight size={18} /></a>
            <a href={viewHref('about')}>认识我 <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <a className="hero-sound-link glass-surface" href={viewHref('player')}><Headphones size={18} /><span>给思绪一点<br />属于自己的声音</span><ArrowUpRight size={16} /></a>
        <p className="hero-coordinate">CONTENT × AI × PRODUCT · 2024—NOW</p>
      </section>

      <Reveal as="section" className="home-feature">
        <a href={viewHref('project', { id: project.id })} aria-label={`查看${project.title}详情`}>
          <AmbientVideo src={project.motion} poster={project.poster} />
          <div className="feature-shade" aria-hidden="true" />
          <div className="feature-copy"><span>{project.status}</span><h2>{project.title}</h2><p>{project.summary}</p><strong>查看作品详情 <ArrowUpRight size={18} /></strong></div>
          <div className="feature-meta"><i>01 / SELECTED WORK</i><i>React · DeepSeek API</i></div>
        </a>
      </Reveal>

      <section className="home-portals" aria-label="更多个人内容">
        <Reveal as="a" className="identity-portal portal-card" href={viewHref('about')}>
          <div className="portal-orbit" aria-hidden="true" />
          <UserRound size={25} /><h2>我是谁，<br />正在走向哪里。</h2><p>教育、能力、现在与未来方向。</p><span>打开个人档案 <ArrowUpRight size={16} /></span>
        </Reveal>
        <BorderGlow {...glow} className="sound-portal-glow"><Reveal as="a" className="sound-portal portal-card" href={viewHref('player')}>
          <AmbientVideo src={media('silver-motion.mp4')} poster={media('silver-poster.jpg')} />
          <div className="portal-darken" /><Headphones size={25} /><h2>给思绪一点<br />属于自己的声音。</h2><p>网易云歌单、本地音乐与可更换壁纸。</p><span>进入声音空间 <ArrowUpRight size={16} /></span>
        </Reveal></BorderGlow>
      </section>
    </main>
    <PageFooter />
    <SitePlayer />
  </div>
}

