const media = file => `${import.meta.env?.BASE_URL || './'}media/${file}`

export const projects = [{
  id: 'content-ai',
  title: 'AI 短视频脚本生成器',
  shortTitle: 'Content AI',
  summary: '面向抖音、小红书与 B 站创作者，把空白的开头变成一份可继续修改的短视频脚本。',
  problem: '创作者知道自己想表达什么，却常常卡在选题、开头和内容结构上。',
  audience: '抖音、小红书、B 站内容创作者',
  role: '产品策划、用户需求分析、前端开发',
  technology: 'React / DeepSeek API / AI 应用',
  tags: ['产品策划', '前端开发', 'AI 应用', '内容创作'],
  github: 'https://github.com/lilzho222-gif/content-ai',
  poster: media('crimson-poster.jpg'),
  motion: media('crimson-motion.mp4'),
  status: '持续打磨中',
}]

export const profile = {
  name: '张皓哲',
  brand: 'lilzho',
  school: '江苏信息职业技术学院',
  major: '物流管理专业',
  period: '2024 — 至今',
  role: 'AI 内容工具独立开发者、内容创作实践者、正在学习产品与前端开发的大学生。',
  capabilities: [
    ['内容与平台', '熟悉抖音、小红书、B 站的平台语境与内容运营逻辑。'],
    ['AI 应用', '使用 DeepSeek、Claude 等工具辅助内容创作和产品探索。'],
    ['产品与开发', '从用户需求出发策划产品，并用前端把想法做成可使用的小工具。'],
  ],
  now: ['继续打磨 AI 内容工具', '积累真实的个人作品', '学习产品、前端和 AI 应用', '先成为认真创作的人，再考虑帮助更多创作者'],
}
