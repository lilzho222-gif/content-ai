import { ArrowUpRight, Code2, Target, Users } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import AmbientVideo from '../components/AmbientVideo'
import PageFooter from '../components/PageFooter'
import SitePlayer from '../player/SitePlayer'
import { projects } from '../data/portfolio'
import { viewHref } from '../navigation'

export default function ProjectPage({ projectId }) {
  const project = projects.find(item => item.id === projectId) || projects[0]
  return <div className="spatial-site project-page">
    <AppNavigation current="works" back={{ href: viewHref('works'), label: '返回作品空间' }} />
    <main id="main-content">
      <header className="project-hero">
        <AmbientVideo src={project.motion} poster={project.poster} />
        <div className="project-hero-shade" />
        <div><p>{project.status}</p><h1>{project.title}</h1><span>{project.summary}</span></div>
      </header>
      <section className="project-story">
        <div className="story-lead"><h2>不是为了展示 AI，<br />而是解决创作者真正会遇到的空白。</h2><p>{project.problem}</p></div>
        <div className="story-facts">
          <article><Users /><span>目标用户</span><strong>{project.audience}</strong></article>
          <article><Target /><span>我负责</span><strong>{project.role}</strong></article>
          <article><Code2 /><span>使用技术</span><strong>{project.technology}</strong></article>
        </div>
      </section>
      <section className="project-terminal" aria-label="项目生成流程演示">
        <div className="terminal-grid" aria-hidden="true" />
        <div className="terminal-window">
          <header><i /><i /><i /><span>content-ai / script-generator</span></header>
          <div className="terminal-body"><p><b>INPUT</b> 为小红书生成一条短视频脚本</p><div><small>01 / 开头钩子</small><strong>别再从“大家好”开始你的视频了。</strong></div><div><small>02 / 内容结构</small><strong>痛点 → 转折 → 可执行的方法</strong></div><p className="terminal-status">DEEPSEEK API · READY</p></div>
        </div>
        <div className="terminal-copy"><h2>从需求到可使用产品。</h2><p>我负责产品策划、用户需求分析和前端开发，并基于 DeepSeek API 实现脚本生成能力。</p><div>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href={project.github} target="_blank" rel="noreferrer">在 GitHub 查看项目 <ArrowUpRight size={17} /></a></div>
      </section>
    </main>
    <PageFooter /><SitePlayer />
  </div>
}

