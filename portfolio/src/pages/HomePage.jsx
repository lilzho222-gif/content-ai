import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Code2, Headphones, LoaderCircle, Sparkles } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import AmbientVideo from '../components/AmbientVideo'
import Reveal from '../components/Reveal'
import PageFooter from '../components/PageFooter'
import SitePlayer from '../player/SitePlayer'
import { projects, profile } from '../data/portfolio'
import { viewHref } from '../navigation'
import './portal-home.css'

const media = file => `${import.meta.env.BASE_URL}media/${file}`
const platforms = ['抖音', '小红书', 'B 站']

function ProductConsole() {
  const [platform, setPlatform] = useState('小红书')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const generate = () => {
    setLoading(true)
    setGenerated(false)
    window.setTimeout(() => { setLoading(false); setGenerated(true) }, 650)
  }
  return <div className="product-console" aria-label="AI 短视频脚本生成器功能预览">
    <header><span><Sparkles size={15} /> Content AI</span><i>DeepSeek API</i></header>
    <div className="console-body">
      <div className="console-form">
        <label>目标平台</label>
        <div className="platform-switch">{platforms.map(item => <button type="button" aria-pressed={platform === item} onClick={() => setPlatform(item)} key={item}>{item}</button>)}</div>
        <label htmlFor="demo-topic">视频主题</label>
        <input id="demo-topic" defaultValue="大学生如何开始做个人项目" />
        <button className="generate-button" type="button" onClick={generate} disabled={loading}>{loading ? <LoaderCircle className="console-spin" size={17} /> : <Sparkles size={17} />}{loading ? '正在生成' : '生成脚本'}</button>
      </div>
      <div className={`console-output ${generated ? 'is-generated' : ''}`} aria-live="polite">
        <span>生成结果 · {platform}</span>
        <h3>{generated ? '别等准备好了，先做出第一个能用的版本。' : '一份结构清晰、可以继续修改的短视频脚本。'}</h3>
        <p><b>开头钩子</b>{generated ? '你不需要先成为专家，才有资格开始。' : '3 秒抓住注意力，避免从“大家好”开始。'}</p>
        <p><b>内容结构</b>痛点 → 转折 → 具体行动 → 互动结尾</p>
        <small><Check size={13} /> 产品原型中的真实功能路径</small>
      </div>
    </div>
  </div>
}

export default function HomePage() {
  const project = projects[0]
  return <div className="spatial-site home-page product-home">
    <AppNavigation current="home" />
    <main id="main-content">
      <section className="product-hero">
        <AmbientVideo className="product-hero-video" src={media('tech-structure.mp4')} poster={media('tech-structure.png')} />
        <div className="product-hero-shade" aria-hidden="true" />
        <div className="product-grid" aria-hidden="true" />
        <div className="product-hero-copy">
          <p className="product-kicker">张皓哲 / lilzho</p>
          <h1>我把内容创作中的问题，<br /><em>做成能用的 AI 产品。</em></h1>
          <p className="product-summary">AI 内容工具独立开发者与大学生。代表作：AI 短视频脚本生成器。</p>
          <div className="product-actions"><a className="product-primary" href={viewHref('project', { id: project.id })}>查看代表作 <ArrowRight size={18} /></a><a href={viewHref('about')}>了解我 <ArrowUpRight size={17} /></a></div>
        </div>
        <div className="product-hero-visual"><ProductConsole /></div>
      </section>

      <Reveal as="section" className="selected-product">
        <header><p>代表作</p><h2>AI 短视频<br />脚本生成器</h2><span>面向抖音、小红书和 B 站创作者，从主题输入到结构化脚本输出。</span></header>
        <div className="product-proof">
          <div className="proof-flow"><span>输入主题</span><ArrowRight /><span>选择平台</span><ArrowRight /><span>生成脚本</span></div>
          <div className="proof-output"><small>脚本结构 / 30 秒</small><h3>开头钩子、内容展开、互动结尾，一次形成可编辑初稿。</h3><div>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          <footer><p>我负责产品策划、用户需求分析、前端开发与 DeepSeek API 接入。</p><div><a href={viewHref('project', { id: project.id })}>项目详情 <ArrowUpRight size={16} /></a><a href="https://lilzho222-gif.github.io/content-ai/" target="_blank" rel="noreferrer">打开真实产品 <ArrowUpRight size={16} /></a></div></footer>
        </div>
      </Reveal>

      <section className="other-work" aria-labelledby="other-work-title">
        <Reveal as="header"><p>持续构建</p><h2 id="other-work-title">不虚构数量，<br />只展示正在发生的探索。</h2></Reveal>
        <div className="other-work-grid">
          <Reveal as="a" href={viewHref('works')} className="work-entry work-entry-main"><Code2 /><span>作品空间</span><h3>真实项目与构建过程</h3><p>查看详情、技术与后续新增作品。</p><ArrowUpRight /></Reveal>
          <Reveal as="a" href={viewHref('player')} className="work-entry work-entry-sound"><Headphones /><span>声音实验</span><h3>给思绪一点声音</h3><p>网易云歌单、本地音乐与自定义壁纸。</p><ArrowUpRight /></Reveal>
          <Reveal as="a" href={viewHref('about')} className="work-entry work-entry-accent"><AmbientVideo src={media('mono-signal.mp4')} /><div><span>视觉点睛</span><h3>内容观察与个人表达</h3></div><ArrowUpRight /></Reveal>
        </div>
      </section>

      <Reveal as="section" className="home-about"><div><p>ABOUT LILZHO</p><h2>内容实践者，<br />也是正在成长的产品开发者。</h2></div><div><p>{profile.role}</p><p>我熟悉内容平台的语境，正在学习如何把需求、AI 与前端连接成真正可以使用的小产品。</p><a href={viewHref('about')}>查看完整介绍 <ArrowUpRight size={16} /></a></div></Reveal>
      <Reveal as="section" className="home-contact"><p>有想法，先把它做出来。</p><h2>持续学习，持续构建。</h2><a href="https://github.com/lilzho222-gif/content-ai" target="_blank" rel="noreferrer">在 GitHub 找到我 <ArrowUpRight size={18} /></a></Reveal>
    </main>
    <PageFooter /><SitePlayer />
  </div>
}
