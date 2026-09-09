# Spatial Creator OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有个人作品集改造成可深链、可播放、可持续扩展的多空间网站，并缩短网易云首播等待。

**Architecture:** 保留查询参数路由和现有 MusicProvider，拆出数据驱动页面组件；后端为网易云音源增加短时缓存和首曲预热。现有 React Bits、GSAP、OGL 与媒体素材继续复用。

**Tech Stack:** React 19、Vite、plain CSS、Express、NetEase Cloud Music API Enhanced、GSAP、OGL

**Spec:** `docs/superpowers/specs/2026-09-09-spatial-creator-os-design.md`

## Global Constraints

- 不重建项目，不删除现有播放器和网易云功能。
- 不新增视觉依赖，不生成新视频。
- 保证深链、浏览器返回、移动端、键盘焦点和 reduced-motion。
- 所有事实性内容只使用用户已经提供的信息。

---

### Task 1: 音乐首播链路

**Files:**
- Modify: `api/netease.cjs`
- Modify: `api/neteaseUtils.cjs`
- Modify: `src/player/MusicProvider.jsx`
- Modify: `src/player/NeteasePanel.jsx`
- Test: `tests/netease-gateway.test.cjs`
- Test: `tests/playback-performance.test.mjs`

- [ ] 先写音源缓存、推荐首曲、长歌单渐进显示和 buffering 状态的失败测试。
- [ ] 运行测试，确认因接口尚不存在而失败。
- [ ] 实现短时音源缓存、首批可用性解析、前端渐进列表和播放状态。
- [ ] 运行全部测试。

### Task 2: 页面架构与内容数据

**Files:**
- Create: `src/data/portfolio.js`
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/WorksPage.jsx`
- Create: `src/pages/ProjectPage.jsx`
- Create: `src/pages/AboutPage.jsx`
- Create: `src/components/AppNavigation.jsx`
- Modify: `src/main.jsx`
- Test: `tests/portfolio-navigation.test.mjs`

- [ ] 先写路由、真实内容和可扩展作品数据失败测试。
- [ ] 运行测试，确认失败。
- [ ] 实现首页精选入口、作品空间、详情页、关于页及共享导航。
- [ ] 运行全部测试。

### Task 3: 页面专属视觉、响应式与交付

**Files:**
- Create: `src/spatial.css`
- Modify: `src/player/PlayerPage.jsx`
- Modify: `src/player/player.css`
- Modify: `index.html`
- Test: `tests/visual-theme.test.mjs`

- [ ] 先写页面特效分工、移动悬浮播放器和 favicon 失败测试。
- [ ] 运行测试，确认失败。
- [ ] 实现空间卡片、流体声音背景、文字转场、移动端收敛和媒体懒加载。
- [ ] 运行全部测试和生产构建。
- [ ] 截取桌面与手机视图，批量修复一次。
- [ ] 合并到 main、推送 GitHub，并检查 Render 部署。

