import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import './StepsSection.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { num: '01', title: '下载安装', desc: '选择你的平台，一键安装 ARTIC' },
  { num: '02', title: '授权输入', desc: '在系统设置中启用 ARTIC 输入法' },
  { num: '03', title: '按住说话', desc: '在任意文本框按住语音键，开口即输入' },
  { num: '04', title: '享受表达', desc: '让每一次开口都变成可用的文字' }
]

/**
 * 「四步开始」——贯通式 stepper。
 *
 * 动效（v15）：**只保留滚动驱动的一层**。
 *   区块进入视口时，橙色进度线从左向右生长，节点与文案依次点亮。
 *
 *   原先还有一个「随鼠标滑到所悬停节点」的暖色光环，已按用户要求删除 ——
 *   它属于跟随鼠标的装饰，触摸设备上毫无意义，也加重了橙色的漂浮感。
 *
 * 关键取舍：CSS 的默认状态是「线已填满 / 文案已点亮」。
 * GSAP 用 fromTo 把它们拉回起始态再随滚动推进 —— 一旦 JS 未执行
 * （或用户开了 prefers-reduced-motion），页面依然完整可读，不会剩半截空线。
 */
export default function StepsSection() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.set('.steps-line-fill', { transformOrigin: 'left center' })

        /* 显式写 duration：线的 tween 占满整条时间线（duration 1），
           节点 / 文案在 0.4 内走完。不写的话 timeline 总时长会被 stagger 撑长，
           导致「画线」只占前一小段 —— 实测那样橙线在 ~175px 的滚动里就冲到 1，
           完全看不出生长过程。 */
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
          /* 节点只过渡「边框与文字色」，**不再填充底色** ——
             填底色会在数字后面出现一块淡橙色方块，和「纯数字节点」的设计冲突。 */
          .fromTo(
            '.step-num',
            { borderColor: '#3D3D3D', color: '#85827C' },
            { borderColor: '#F59E0B', color: '#B45309', duration: 0.4, stagger: 0.15, ease: 'none' },
            0
          )
      }, track)

      return () => ctx.revert()
    })

    /* 字体 / 图片加载会改变轨道的几何位置，刷新一次触发点 */
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      clearTimeout(refreshId)
      mm.revert()
    }
  }, [])

  return (
    <section className="section steps-section" id="steps">
      <div className="container">
        <Reveal>
          <span className="section-kicker">Get started</span>
        </Reveal>
        <Reveal>
          <h2 className="section-title">四步开始</h2>
        </Reveal>
        <Reveal>
          <p className="section-subtitle">零学习成本，像使用普通输入法一样简单</p>
        </Reveal>

        <div className="steps-track" ref={trackRef}>
          <div className="steps-line" aria-hidden="true">
            <span className="steps-line-fill" />
          </div>

          <ol className="steps-grid">
            {steps.map((s) => (
              <li className="step-card" key={s.num}>
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
