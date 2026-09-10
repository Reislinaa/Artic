import { useRef } from 'react'
import { siApple, siAppstore, siAndroid, siGooglechrome, siLinux } from 'simple-icons'
import './PlatformSpecs.css'

// simple-icons v16 因商标下架了 Windows 官方图标，这里保留官方四格旗的规范 path，
// 与其余来自 simple-icons 的品牌标保持一致。
const windowsIcon = {
  title: 'Windows',
  path: 'M2 4.5l8.5-1.1V11H2V4.5zM11.5 3.3L22 2v8.8h-10.5V3.3zM2 12.5h8.5v7.6L2 19V12.5zM11.5 12.5H22V22l-10.5-1.1V12.5z'
}

// iOS 用 App Store 图标代表：simple-icons 的 iOS 图标本身就是「iOS」字形，
// 放在「iOS」文字前面会出现「iOS iOS」的重复。App Store 是 iOS 端的分发入口，
// 语义准确且辨识度高。（simple-icons v16 没有 iphone / ipad 图标）

const PLATFORMS = [
  { name: 'macOS', tag: '原生适配', desc: '支持 macOS 12+，触控板与快捷键深度集成', icon: siApple },
  { name: 'Windows', tag: '原生适配', desc: '支持 Windows 10 / 11，办公与编码场景无缝切换', icon: windowsIcon },
  { name: 'iOS', tag: '移动端', desc: 'iPhone 与 iPad，语音转写和滑动输入兼得', icon: siAppstore },
  { name: 'Android', tag: '移动端', desc: '覆盖主流安卓机型，九宫格与全键盘自适应', icon: siAndroid },
  { name: 'Web', tag: '浏览器扩展', desc: 'Chrome 与 Edge 扩展，网页输入框里也能成稿', icon: siGooglechrome },
  { name: 'Linux', tag: '开源支持', desc: '面向开发者，持续维护更新', icon: siLinux }
]

/**
 * 平台支持表。
 *
 * 结构：索引 → 图标 + 名称 → 说明 → 状态 → 箭头。
 * 与上一版的差别：
 *   · 不再用 `max-width + margin auto` 居中 —— 那会让表格左边缘与页头标题错位；
 *     现在与页头同一起始线，并吃满容器宽度，消除右侧大片空白。
 *   · 标签移到最右成为「状态列」，中间不再夹着两个空洞。
 *   · 每行可点击（跳下载页），因此悬停反馈是「真实可交互」而不是装饰。
 *
 * 鼠标交互：整表有一个跟随指针的暖色聚光（react-bits 的 Spotlight 范式）。
 * 位置写在 CSS 变量上，用 rAF 节流，**不触发 React 重渲染**。
 */
export default function PlatformSpecs({ onNavigate }) {
  const wrapRef = useRef(null)
  const frameRef = useRef(0)

  const handleMove = (e) => {
    if (frameRef.current) return
    const { clientX, clientY } = e
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - rect.left}px`)
      el.style.setProperty('--my', `${clientY - rect.top}px`)
      el.style.setProperty('--spot', '1')
    })
  }

  const handleLeave = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
    wrapRef.current?.style.setProperty('--spot', '0')
  }

  return (
    <div className="pspecs" ref={wrapRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {/* 跟随指针的聚光层：放在行之下，不遮挡文字 */}
      <div className="pspecs-spot" aria-hidden="true" />

      {PLATFORMS.map((p, i) => (
        <button
          type="button"
          className="pspec"
          key={p.name}
          onClick={() => onNavigate?.('download')}
        >
          <span className="pspec-index">{String(i + 1).padStart(2, '0')}</span>

          <span className="pspec-key">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={p.icon.path} />
            </svg>
            <span className="pspec-name">{p.name}</span>
          </span>

          <span className="pspec-desc">{p.desc}</span>
          <span className="pspec-tag">{p.tag}</span>
          <span className="pspec-go" aria-hidden="true">→</span>
        </button>
      ))}
    </div>
  )
}
