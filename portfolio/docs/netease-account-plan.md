# 连接自己的网易云账号：实施方案

核对日期：2026-09-08。当前网站仍是 GitHub Pages 静态作品集。本文件是接入方案，不代表账号已经登录或完成端到端验证。

## 选型结论

建议评估自己部署的 [NeteaseCloudMusicApiEnhanced/api-enhanced](https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced)。核对时该仓库未归档，最近一次推送为 2026-09-04；[Binaryify 原仓库](https://github.com/Binaryify/NeteaseCloudMusicApi) 已归档。Enhanced README 同时说明原项目 npm 包仍可能更新，不能把 GitHub 归档等同于所有发行渠道停更。

Enhanced 是第三方接口实现，不是网易云官方 OAuth。存在服务条款、接口变动、账号风控和播放权限风险。不能承诺永久可用，也不能凭登录获得不属于该账号的版权或会员权限。

## 推荐部署结构

保留现在的公开作品集网址；另设由站主控制的音乐服务，包含受保护的管理页面和后台。尽量让音乐页面与后台同源，避免跨站 Cookie 被浏览器拦截。作品集继续保留本地歌曲播放器，音乐账号功能进入独立的同源音乐页面。

1. 在自己的服务器或云托管账户部署 Node.js 22+ 服务。也可以用项目提供的 Docker 方式。固定审核过的版本或镜像摘要，不盲目跟随 latest。
2. 音乐后台由自己管理，不使用网上陌生的公共 API。上游 API 只在内部网络监听；外部暴露一个 HTTPS 的受限业务网关。
3. 网关只允许账号状态、扫码登录、歌单和歌曲查询等必要操作。后台管理页需站主身份验证；CORS、来源检查、请求频率限制和 CSRF 防护必须同时配置，CORS 不是身份验证。
4. 网易云登录 Cookie 保留在服务端会话存储；浏览器只持有自己网站的 HttpOnly、Secure 会话 Cookie。不把 MUSIC_U、密码、登录结果写入公开仓库、前端环境变量、URL 或日志。
5. 站主扫码后只同步自己选中的公开歌单用于访客展示。访客不能获取站主私人歌单、收藏、账号资料或借用站主会员会话。私人音乐空间仅站主可访问。
6. 主动关闭该项目默认启用的歌曲解锁功能（ENABLE_GENERAL_UNBLOCK=false），不启用第三方音源替换。只播放账号与平台正常授权返回的音频；无权限时提示在网易云打开。

## 登录与歌单流程

上游文档确认的流程：

- `/login/qr/key`：获取二维码 key。
- `/login/qr/create`：以 key 生成二维码；请求 qrimg 时返回图片。
- `/login/qr/check`：按合理间隔查询，带时间戳避免缓存。800 过期、801 待扫描、802 待确认、803 登录成功；成功响应含 Cookie，必须由后台截留。
- `/login/status` 或 `/user/account`：由后台验证账号状态。
- `/user/playlist`：用已登录账号的 uid 查询歌单。
- `/playlist/track/all`：分页读取选中歌单歌曲。
- `/song/url/v1`：按账号权限获取音频地址；不要长期缓存易过期的播放 URL。

上面的客户端页面和受限网关仍需实现。二维码必须由你本人使用网易云 App 扫描并确认，不能用外链播放器代替账号登录。

## 两种托管选择

**推荐：自己的长期在线服务器，部署音乐页面 + 网关 + 内部 API。** 会话和访问权限更容易控制，也不依赖你的个人电脑开机。需要服务器访问权限、域名／HTTPS，以及你认可的预算。

**备选：自己的 Vercel 账户。** 项目有部署模板，但仍需要另外实现安全网关、会话存储和站主权限，不能直接把原始接口公开后把 Cookie 放前端。网络可达性、平台限制和费用以实际账户测试为准。

## 下一步需要的信息

选择你自己控制的服务器或云托管账户。不要在聊天里发送网易云密码或 Cookie。部署完成后由你扫描二维码登录，再验证账号显示、歌单分页、正常授权歌曲播放、退出清理、会话过期、访客不能读取私人内容。

## 已核对资料

- [项目 README：环境与部署](https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced/blob/main/README.MD)
- [项目接口文档：二维码登录与歌单](https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced/blob/main/public/docs/home.md)
- [原版仓库归档状态](https://github.com/Binaryify/NeteaseCloudMusicApi)

Firecrawl 用于检索 GitHub 文档，Context7 用于交叉核对登录会话示例。上游示例把 Cookie 存入 localStorage；这里不照搬该安全设计，推荐改为服务端会话。
