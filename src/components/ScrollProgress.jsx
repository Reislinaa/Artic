import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 顶部极细滚动进度条：滚动到页底的阅读进度。
// 手法取自 GSAP ScrollTrigger 的 scrub 进度条模式（合成器友好的 scaleX），
// 不随滚动动效争抢 transform，prefers-reduced-motion 下自动隐藏。
export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const setter = gsap.quickSetter(bar, 'scaleX')
      const trigger = ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate: (self) => setter(self.progress)
      })
      return () => trigger.kill()
    })

    return () => mm.revert()
  }, [])

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />
}