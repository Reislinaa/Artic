import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

export function initSmoothScroll() {
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return lenis
}

// 路由切换时回到顶部：优先走 Lenis（立即跳到顶部），无 Lenis 时退回原生
export function scrollToTopImmediate() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
    return
  }
  window.scrollTo({ top: 0 })
}

export function destroySmoothScroll() {
  if (!lenis) return
  lenis.destroy()
  lenis = null
}