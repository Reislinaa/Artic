import { useEffect, useRef } from 'react'

/* 影响半径 / 最大位移 / 最大模糊 / 最大放大 */
const RADIUS = 150
const PUSH = 22
const BLUR = 4
const SCALE = 0.07

/**
 * 文字随鼠标「弥散」：把文本按**字符**拆开，光标附近的字会被
 * 沿「字符 → 光标」的反方向推开，同时轻微放大、模糊、降透明，
 * 离开半径后自动复位。
 *
 * 性能取舍：
 *   · 用「一个 window 级 mousemove（passive）+ requestAnimationFrame 节流」，
 *     每个实例自己判断光标是否靠近自己 —— 远离时直接返回，不做任何计算。
 *   · 只写 transform / filter / opacity，不碰 layout 属性。
 *   · 用一个 dirty 集合记录「当前被改过的字符」，复位时只处理它们，避免每帧全量写样式。
 *   · 触摸设备（无 hover）与 prefers-reduced-motion 下**完全不启用**。
 */
export default function DisperseText({ as: Tag = 'span', className = '', text = '', ...rest }) {
  const wrapRef = useRef(null)
  const charsRef = useRef([])
  const dirtyRef = useRef(new Set())

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !text) return
    if (typeof window === 'undefined' || !window.matchMedia) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const chars = charsRef.current.filter(Boolean)
    if (!chars.length) return

    let raf = 0
    let mx = -1e5
    let my = -1e5

    const clearChar = (el, i) => {
      el.style.transform = ''
      el.style.filter = ''
      el.style.opacity = ''
      dirtyRef.current.delete(i)
    }

    const clearAll = () => {
      for (const i of [...dirtyRef.current]) clearChar(chars[i], i)
    }

    const frame = () => {
      raf = 0
      for (let i = 0; i < chars.length; i++) {
        const el = chars[i]
        const r = el.getBoundingClientRect()
        const dx = r.left + r.width / 2 - mx
        const dy = r.top + r.height / 2 - my
        const d = Math.hypot(dx, dy)

        if (d >= RADIUS) {
          if (dirtyRef.current.has(i)) clearChar(el, i)
          continue
        }

        const f = 1 - d / RADIUS
        const nx = dx / (d || 1)
        const ny = dy / (d || 1)
        el.style.transform =
          `translate3d(${(nx * PUSH * f).toFixed(2)}px, ${(ny * PUSH * f).toFixed(2)}px, 0) ` +
          `scale(${(1 + SCALE * f).toFixed(3)})`
        el.style.filter = `blur(${(BLUR * f).toFixed(2)}px)`
        el.style.opacity = (1 - 0.28 * f).toFixed(3)
        dirtyRef.current.add(i)
      }
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      const r = wrap.getBoundingClientRect()
      const near =
        mx > r.left - RADIUS &&
        mx < r.right + RADIUS &&
        my > r.top - RADIUS &&
        my < r.bottom + RADIUS
      if (!near) {
        // 光标已远离：把之前改过的字符复位，然后不再计算
        if (dirtyRef.current.size && !raf) raf = requestAnimationFrame(frame)
        return
      }
      if (!raf) raf = requestAnimationFrame(frame)
    }

    /* 滚动会改变字符的屏幕坐标，缓存的光标位置立刻失效 → 先复位 */
    const onScroll = () => {
      if (dirtyRef.current.size) clearAll()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      clearAll()
    }
  }, [text])

  return (
    <Tag ref={wrapRef} className={className} {...rest}>
      {[...text].map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="dt-char"
          ref={(el) => {
            charsRef.current[i] = el
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </Tag>
  )
}
