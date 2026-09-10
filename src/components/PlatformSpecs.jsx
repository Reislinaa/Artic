import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siApple, siAppstore, siAndroid, siGooglechrome, siLinux } from 'simple-icons'
import './PlatformSpecs.css'

gsap.registerPlugin(ScrollTrigger)

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
 * 与上一版的差别：索引与名称仍在左侧对齐页头，标签移到最右成为「状态列」。
 *
 * 说明：这里**曾经有一层跟随鼠标的暖色聚光**，已按用户反馈移除 ——
 * 它在白色卡片上会糊成一片半透明污渍，比不加更难看。
 * 交互改为**逐行**的：悬停该行时索引转橙、图标微抬、箭头滑入。
 */
export default function PlatformSpecs({ onNavigate }) {
  const listRef = useRef(null)

  /* 逐行入场：进入视口时从上往下依次浮现。
     用 fromTo —— CSS 的默认状态是「已显示」，所以 JS 未执行
     或用户开了 prefers-reduced-motion 时，表格依然完整可读。 */
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const rows = list.querySelectorAll('.pspec')
    if (!rows.length) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: list, start: 'top 88%', once: true }
        }
      )
      return () => {
        tween.kill()
        gsap.set(rows, { clearProps: 'all' })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <div className="pspecs" ref={listRef}>
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
