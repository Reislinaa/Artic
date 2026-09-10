import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * 磁吸按钮：指针在按钮附近时，按钮会被光标「吸」过去一点点，
 * 离开后弹回原位。位移量按光标到中心的距离线性缩放。
 *
 * 用 gsap.quickTo 做平滑逼近（而不是直接写 transform），
 * 这样快速移动指针时不会出现跳变。
 * 触摸设备与 prefers-reduced-motion 下完全不启用。
 */
export default function MagneticButton({ children, className = '', strength = 0.3, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined' || !window.matchMedia) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [strength])

  return (
    <button ref={ref} className={className} {...rest}>
      {children}
    </button>
  )
}
