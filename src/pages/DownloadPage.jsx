import { siApple, siIos, siAndroid } from 'simple-icons'
import Reveal from '../components/Reveal'

// simple-icons 移除了 Windows 官方图标（v16 商标下架），这里保留 Windows 官方
// 四格旗的规范路径，与其他来自 simple-icons 的真实品牌图标保持一致。
const windowsIcon = {
  title: 'Windows',
  path: 'M2 4.5l8.5-1.1V11H2V4.5zM11.5 3.3L22 2v8.8h-10.5V3.3zM2 12.5h8.5v7.6L2 19V12.5zM11.5 12.5H22V22l-10.5-1.1V12.5z'
}

const platforms = [
  {
    platform: 'iOS',
    name: 'App Store',
    desc: 'iPhone / iPad 用户',
    version: '2.1.0',
    btn: '从 App Store 下载',
    icon: siIos
  },
  {
    platform: 'Android',
    name: '应用商店',
    desc: 'Android 手机用户',
    version: '2.1.0',
    btn: '下载 Android 版',
    icon: siAndroid
  },
  {
    platform: 'Windows',
    name: '桌面版',
    desc: 'Windows 10 / 11',
    version: '2.1.0',
    btn: '下载 Windows 版',
    icon: windowsIcon
  },
  {
    platform: 'macOS',
    name: '桌面版',
    desc: 'macOS 12 及以上',
    version: '2.1.0',
    btn: '下载 macOS 版',
    icon: siApple
  }
]

const questions = [
  { q: '下载需要付费吗？', a: '基础功能完全免费，你可以放心下载使用。' },
  { q: '支持哪些设备？', a: '支持 iOS、Android、Windows、macOS 四大平台。' },
  { q: '如何更新到最新版？', a: '在应用内设置中检查更新即可，会第一时间推送。' },
  { q: '下载遇到问题怎么办？', a: '可以联系我们的客服邮箱 support@artic.cn。' }
]

// 使用 simple-icons 的真实品牌 path，fill 用 currentColor 以沿用站点统一的
// 珊瑚流星主色（--primary），避免多色品牌色破坏温暖极简的设计系统。
function PlatformIcon({ icon }) {
  if (!icon) return null
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d={icon.path} />
    </svg>
  )
}

export default function DownloadPage() {
  return (
    <div className="page">
      <div className="page-hero">
        <div className="container">
          <span className="page-hero-tag">DOWNLOAD · 下载</span>
          <h1 className="page-hero-title">下载<em>ARTIC</em></h1>
          <p className="page-hero-sub">
            全平台支持，选择你的设备，开始智能输入之旅
          </p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          <Reveal variant="blur">
            <h2 className="page-title">选择平台下载</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">覆盖 iOS、Android、Windows、macOS</p>
          </Reveal>

          <div className="download-platform-grid">
            {platforms.map((app, i) => (
              <Reveal key={app.platform} delay={(i % 2) + 1} variant={['up', 'scale', 'left', 'right'][i % 4]}>
                <div className="download-platform-card">
                  <div className="download-platform-icon">
                    <PlatformIcon icon={app.icon} />
                  </div>
                  <div className="download-platform-info">
                    <h3>{app.platform}</h3>
                    <span>{app.name}</span>
                    <p>{app.desc}</p>
                    <span className="download-platform-version">版本 {app.version}</span>
                  </div>
                  <button className="btn btn-primary download-platform-btn">{app.btn}</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section page-section-alt">
        <div className="container">
          <Reveal variant="scale">
            <h2 className="page-title">常见问题</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">关于下载与使用，你可能想知道</p>
          </Reveal>
          <div className="faq-list">
            {questions.map((item, i) => (
              <Reveal key={i} delay={(i % 2) + 1} variant={['up', 'blur'][i % 2]}>
                <div className="faq-item">
                  <div className="faq-q">
                    <span className="faq-icon">Q</span>
                    <span>{item.q}</span>
                  </div>
                  <div className="faq-a">
                    <span className="faq-icon">A</span>
                    <span>{item.a}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
