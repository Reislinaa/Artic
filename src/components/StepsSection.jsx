import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import DisperseText from './DisperseText'
import './StepsSection.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { num: '01', title: '下载安装', desc: '选择你的平台，一键安装 ARTIC' },
  { num: '02', title: '授权输入', desc: '在系统设置中启用 ARTIC 输入法' },
  { num: '03', title: '按住说话', desc: '在任意文本框按住语音键，开口即输入' },
  { num: '04', title: '享受表达', desc: '让每一次开口都变成可用的文字' }
]

/**
 * 「四步开始」——做成真正的 stepper，而不是四个平行文字块。
 *
 * 视觉：一条贯通整轨的细线，数字是线上的圆形节点（原来数字是悬在空中孤零零的小字）。
 * 动效：
 *   ① 滚动 —— 橙色进度线从左向右生长，节点与文案依次点亮（ScrollTrigger scrub）
 *   ② 鼠标 —— 一个暖色光环沿轨道滑到所悬停的节点上（gsap.quickTo 平滑跟随）
 *
 * 关键取舍：CSS 里的默认状态是「线已填满 / 文案已点亮」。
 * GSAP 用 fromTo 把它们拉回起始态再随滚动推进，这样一旦 JS 未执行
 * （或用户开了 prefers-reduced-motion），页面依然是完整可读的，不会剩半截空线。
 */
export default function StepsSection() {
  const trackRef = useRef(null)
  const haloRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const mm = gsap.matchMedia()

    /* 只在「用户没有要求减少动效」时启用动画 */
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.set('.steps-line-fill', { transformOrigin: 'left center' })

        /* 显式写 duration：
             线的 tween 占满整条时间线（duration 1），节点/文案在 0.85 内走完。
             不写的话，timeline 总时长会被 stagger 撑长，导致「画线」只占前一小段 ——
             实测那样会让橙线在 ~175px 的滚动里就从 0 冲到 1，完全看不出生长过程。 */
        gsap
          .timeline({
            scrollTrigger: {
              trigger: track,
              start: 'top 85%',
              end: 'bottom 65%',
              scrub: 0.5
            }
          })
          .fromTo('.steps-line-fill', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0)
          .fromTo(
            '.step-body',
            { autoAlpha: 0.28 },
            { autoAlpha: 1, duration: 0.4, stagger: 0.15, ease: 'none' },
            0
          )
          .fromTo(
            '.step-num',
            { borderColor: 'rgba(16,16,16,0.24)', color: '#8A8A93', backgroundColor: '#F5F2EC' },
            {
              borderColor: '#F59E0B',
              color: '#B45309',
              backgroundColor: '#FFF6E8',
              duration: 0.4,
              stagger: 0.15,
              ease: 'none'
            },
            0
          )
      }, track)

      return () => ctx.revert()
    })

    /* 字体/图片加载会改变轨道的几何位置，刷新一次触发点 */
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      clearTimeout(refreshId)
      mm.revert()
    }
  }, [])

  /* 光环滑到目标节点：读取节点相对轨道的 x，交给 GSAP 平滑过渡 */
  const moveHalo = (card) => {
    const halo = haloRef.current
    const node = card?.querySelector('.step-num')
    if (!halo || !node || !trackRef.current) return
    const trackRect = trackRef.current.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()
    const x = nodeRect.left - trackRect.left + nodeRect.width / 2
    gsap.to(halo, { x, autoAlpha: 1, duration: 0.5, ease: 'power3.out', overwrite: true })
  }

  const hideHalo = () => {
    if (haloRef.current) {
      gsap.to(haloRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
    }
  }

  return (
    <section className="section steps-section" id="steps">
      <div className="container">
        <Reveal>
          <span className="section-kicker">Get started</span>
        </Reveal>
        <Reveal>
          <h2 className="section-title">
            <DisperseText text="四步开始" />
          </h2>
        </Reveal>
        <Reveal>
          <p className="section-subtitle">零学习成本，像使用普通输入法一样简单</p>
        </Reveal>

        <div className="steps-track" ref={trackRef} onMouseLeave={hideHalo}>
          <div className="steps-line" aria-hidden="true">
            <span className="steps-line-fill" />
          </div>
          <span className="steps-halo" ref={haloRef} aria-hidden="true" />

          <ol className="steps-grid">
            {steps.map((s) => (
              <li
                className="step-card"
                key={s.num}
                onMouseEnter={(e) => moveHalo(e.currentTarget)}
                onFocus={(e) => moveHalo(e.currentTarget)}
              >
                <span className="step-num">{s.num}</span>
                <div className="step-body">
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
