const media = file => `${import.meta.env.BASE_URL}media/${file}`

export const tracks = [
  {
    id: 'autumn',
    title: '红叶',
    descriptor: '氛围片段 01 · 00:06',
    src: media('autumn.mp4'),
    accent: '#cf563e',
  },
  {
    id: 'particles',
    title: '光粒',
    descriptor: '氛围片段 02 · 00:06',
    src: media('particles.mp4'),
    accent: '#e3ad65',
  },
]
