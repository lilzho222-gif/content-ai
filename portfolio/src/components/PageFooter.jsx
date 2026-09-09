import { ArrowUpRight } from 'lucide-react'
import { viewHref } from '../navigation'

export default function PageFooter() {
  return <footer className="spatial-footer">
    <a href={viewHref('home')}>lilzho / 张皓哲</a>
    <p>持续学习，持续构建</p>
    <nav aria-label="页脚导航"><a href={viewHref('works')}>作品</a><a href={viewHref('about')}>关于</a><a href="https://github.com/lilzho222-gif/content-ai" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a></nav>
  </footer>
}

