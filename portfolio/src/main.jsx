import { lazy, Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CursorTrail from './components/CursorTrail'
import { MusicProvider } from './player/MusicProvider'
import { parsePortfolioLocation } from './navigation'
import { pageExperiences } from './data/experience'
import './styles.css'
import './enhancements.css'
import './spatial.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const WorksPage = lazy(() => import('./pages/WorksPage'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PlayerPage = lazy(() => import('./player/PlayerPage'))

function RouteFallback() {
  return <div className="route-loading" role="status"><span /><p>正在进入 lilzho 的创作空间</p></div>
}

function App() {
  const [location, setLocation] = useState(() => parsePortfolioLocation(window.location.search))

  useEffect(() => {
    const update = () => setLocation(parsePortfolioLocation(window.location.search))
    const navigate = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest('a')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || (url.search === window.location.search && url.hash)) return
      event.preventDefault()
      history.pushState({}, '', url)
      update()
    }
    document.addEventListener('click', navigate)
    window.addEventListener('popstate', update)
    return () => { document.removeEventListener('click', navigate); window.removeEventListener('popstate', update) }
  }, [])

  useEffect(() => {
    const titles = { home: '张皓哲 · lilzho', works: '作品空间 · lilzho', project: 'AI 短视频脚本生成器 · lilzho', about: '关于张皓哲 · lilzho', player: '声音空间 · lilzho' }
    document.title = titles[location.view] || titles.home
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.view, location.projectId])

  let page
  if (location.view === 'works') page = <WorksPage />
  else if (location.view === 'project') page = <ProjectPage projectId={location.projectId} />
  else if (location.view === 'about') page = <AboutPage />
  else if (location.view === 'player') page = <PlayerPage />
  else page = <HomePage />

  return <div className="app-shell" data-experience={pageExperiences[location.view]?.signature}><CursorTrail /><Suspense fallback={<RouteFallback />}><div className="route-frame" key={`${location.view}:${location.projectId}`}>{page}</div></Suspense></div>
}

createRoot(document.getElementById('root')).render(<MusicProvider><App /></MusicProvider>)
