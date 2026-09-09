import { ArrowUpRight, Layers3 } from 'lucide-react'
import { useState } from 'react'
import AppNavigation from '../components/AppNavigation'
import AmbientVideo from '../components/AmbientVideo'
import FlowingMenu from '../components/reactbits/FlowingMenu'
import PageFooter from '../components/PageFooter'
import SitePlayer from '../player/SitePlayer'
import { projects } from '../data/portfolio'
import { viewHref } from '../navigation'

function ProjectDeck({ project }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const move = event => {
    if (matchMedia('(pointer: coarse)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -8, y: ((event.clientX - rect.left) / rect.width - .5) * 10 })
  }
  return <a className="project-deck" href={viewHref('project', { id: project.id })} onPointerMove={move} onPointerLeave={() => setTilt({ x: 0, y: 0 })} style={{ '--rx': `${tilt.x}deg`, '--ry': `${tilt.y}deg` }}>
    <div className="deck-ghost deck-back" />
    <div className="deck-ghost deck-middle" />
    <div className="deck-front"><AmbientVideo src={project.motion} poster={project.poster} /><div className="deck-shade" /><span>{project.status}</span><h2>{project.title}</h2><p>{project.summary}</p><strong>打开作品 <ArrowUpRight size={18} /></strong></div>
  </a>
}

export default function WorksPage() {
  return <div className="spatial-site works-page">
    <AppNavigation current="works" />
    <main id="main-content">
      <header className="works-heading"><h1>探索更多作品</h1><p>这里不是作品堆积页，而是一间持续生长的创作空间。每个项目都能独立展开，也能继续新增。</p></header>
      <section className="works-stage">
        <aside><Layers3 size={20} /><span>WORK LIBRARY</span><strong>{String(projects.length).padStart(2, '0')}</strong><p>真实作品数量</p></aside>
        <div className="works-decks">{projects.map(project => <ProjectDeck project={project} key={project.id} />)}</div>
        <div className="future-slot"><span>NEXT SLOT</span><p>下一件真实作品完成后，会从这里进入作品空间。</p></div>
      </section>
      <section className="works-menu"><FlowingMenu items={projects.map(project => ({ link: viewHref('project', { id: project.id }), text: project.shortTitle, image: project.poster }))} speed={14} textColor="#ece3da" bgColor="#0d1115" marqueeBgColor="#ca9164" marqueeTextColor="#161116" borderColor="#373238" /></section>
    </main>
    <PageFooter /><SitePlayer />
  </div>
}

