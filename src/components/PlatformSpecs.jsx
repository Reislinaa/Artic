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

/**
 * 平台支持：用**规格表**呈现，而不是卡片墙。
 * 取舍依据：图标 → 名称 → 状态标签（三行信息结构），
 * 一行一个平台、一句一种能力；层级靠留白与字号，不靠分割线堆叠。
 */
const PLATFORMS = [
  { name: 'macOS', tag: '原生适配', desc: '支持 macOS 12+，触控板与快捷键深度集成', icon: siApple },
  { name: 'Windows', tag: '原生适配', desc: '支持 Windows 10 / 11，办公与编码场景无缝切换', icon: windowsIcon },
  { name: 'iOS', tag: '移动端', desc: 'iPhone 与 iPad，语音转写和滑动输入兼得', icon: siAppstore },
  { name: 'Android', tag: '移动端', desc: '覆盖主流安卓机型，九宫格与全键盘自适应', icon: siAndroid },
  { name: 'Web', tag: '浏览器扩展', desc: 'Chrome 与 Edge 扩展，网页输入框里也能成稿', icon: siGooglechrome },
  { name: 'Linux', tag: '开源支持', desc: '面向开发者，持续维护更新', icon: siLinux }
]

export default function PlatformSpecs() {
  return (
    <div className="pspecs">
      {PLATFORMS.map((p) => (
        <div className="pspec" key={p.name}>
          <div className="pspec-key">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={p.icon.path} />
            </svg>
            <span className="pspec-name">{p.name}</span>
          </div>
          <span className="pspec-tag">{p.tag}</span>
          <span className="pspec-desc">{p.desc}</span>
        </div>
      ))}
    </div>
  )
}
