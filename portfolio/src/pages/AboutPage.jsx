import { ArrowUpRight } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'
import EyeScene from '../components/EyeScene'
import PageFooter from '../components/PageFooter'
import Reveal from '../components/Reveal'
import SitePlayer from '../player/SitePlayer'
import { profile } from '../data/portfolio'
import { EchoText } from '../components/PortalEffects'

export default function AboutPage() {
  return <div className="spatial-site about-page">
    <AppNavigation current="about" />
    <main id="main-content">
      <header className="about-hero"><h1>我不是虚构的资深专家。<br /><em className="gradient-text">我正在认真地学习，也已经开始构建。</em></h1><p>{profile.role}</p></header>
      <Reveal as="section" className="about-record">
        <div><span>教育背景</span><h2>{profile.school}</h2><p>{profile.major} · {profile.period}</p></div>
        <blockquote>从内容里观察真实问题，再用 AI 与前端把想法做成可以打开、使用和继续改进的产品。</blockquote>
      </Reveal>
      <section className="about-observe"><EyeScene /><div><h2><EchoText>观察内容，理解用户，</EchoText><br />再决定做什么。</h2><p>我熟悉内容平台的创作节奏，也愿意承认能力仍在生长。学习速度、执行力和产品意识，是我目前最确定的积累。</p></div></section>
      <section className="capability-ledger">{profile.capabilities.map(([title, text]) => <Reveal as="article" key={title}><h2>{title}</h2><p>{text}</p></Reveal>)}</section>
      <section className="now-space"><h2>现在正在做什么</h2><div>{profile.now.map(item => <p key={item}>{item}</p>)}</div><a href="https://github.com/lilzho222-gif/content-ai" target="_blank" rel="noreferrer">查看正在构建的项目 <ArrowUpRight size={17} /></a></section>
    </main>
    <PageFooter /><SitePlayer />
  </div>
}

