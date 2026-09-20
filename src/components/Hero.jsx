import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import InputMockup from './InputMockup'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero。
 *
 * 主视觉（v16）：不再用一句中文口号当大标题，
 * 改为**巨大化 ARTIC 品牌字标**作为首屏记忆点，中文卖点下沉到小字说明。
 * 动效（用户要求「整个页面多一点动效」）：
 *   · ARTIC 字母左到右逐个「上浮 + 去模糊」入场（贴合输入法「逐个落字」意象）
 *   · 字标下方一道细规则横线 draw-in；末尾一个闪烁输入光标持续「打字」感
 *   · 右侧产品演示窗口一个缓慢的呼吸浮动
 *   · 两团弥散光斑随滚动做轻量视差（取代被移除的鼠标跟随）
 *   以上全部在 prefers-reduced-motion 下自动关闭，内容仍完整可读。
 */
export default function Hero({ onStartDemo, onNavigate }) {
  const glowRef = useRef(null)
  const wordRef = useRef(null)
  const ruleRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* 光斑呼吸 */
      if (glowRef.current) {
        const tween = gsap.to(glowRef.current, {
          scale: 1.06,
          opacity: 0.9,
          duration: 9,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        })
        return () => tween.kill()
      }
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* ARTIC 字标入场：逐字上浮 + 去模糊 */
      if (wordRef.current) {
        const tl = gsap.timeline({ delay: 0.12 })
        tl.fromTo(
          wordRef.current.querySelectorAll('.wm'),
          { y: 46, autoAlpha: 0, rotate: 5, filter: 'blur(12px)' },
          {
            y: 0,
            autoAlpha: 1,
            rotate: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.07,
            ease: 'power3.out'
          }
        ).fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'left center' },
          '-=0.45'
        )
        return () => tl.kill()
      }
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* 弥散光斑随滚动轻量视差 */
      const wrap = document.querySelector('.hero-glow-wrap')
      const horizon = document.querySelector('.hero-horizon')
      const hero = document.querySelector('.hero')
      if (!hero) return
      const clean = []
      if (wrap) {
        /* wrap 用 transform: translateY(-50%) 居中，GSAP 的 y 会覆盖它，
           这里改用 marginTop 做轻量视差以保留垂直居中 */
        clean.push(
          gsap.fromTo(wrap, { marginTop: 0 }, { marginTop: 70, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 } })
        )
      }
      if (horizon) {
        clean.push(
          gsap.fromTo(horizon, { y: 0 }, { y: 46, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 } })
        )
      }
      return () => clean.forEach((t) => t.scrollTrigger?.kill() || t.kill())
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-glow-wrap" aria-hidden="true">
        <span className="hero-glow" ref={glowRef} />
      </div>
      <div className="hero-horizon" aria-hidden="true" />

      <div className="hero-content">
        {/* Left column: 字标 + 说明 + 行动 + 数据 */}
        <div className="hero-col hero-col-left">
          <Reveal>
            <span className="hero-tag">AI 语音成稿 · Say what you mean, but better</span>
          </Reveal>

          {/* 大字：ARTIC 品牌字标 */}
          <h1 className="hero-wordmark" ref={wordRef} aria-label="ARTIC">
            {Array.from('ARTIC').map((ch, i) => (
              <span className="wm" key={i} aria-hidden="true">
                {ch}
              </span>
            ))}
          </h1>
          <div className="hero-wordmark-rule" ref={ruleRef} aria-hidden="true" />

          <Reveal delay={2}>
            <p className="hero-subtitle">
              说出即稿——让说出口的话，直接变成能发出去的商务稿。
              <br />
              口语自动改书面语&nbsp;·&nbsp;说错即时纠正&nbsp;·&nbsp;一处习惯，处处能用
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('pricing')}>
                开始使用
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => onNavigate('features')}>
                看它怎么改稿
              </button>
            </div>
          </Reveal>

          {/* speed comparison sits below the buttons in the LEFT column */}
          <Reveal delay={4}>
            {/* 这一层保证「速度卡 + 说明文字」永远纵向堆叠：
                平板断点会把 .reveal 变成 flex 行布局，若两者直接作为
                .reveal 的子元素会被排成一行（实测 860px 下并排错位）。 */}
            <div className="hero-compare-wrap">
              <div className="hero-compare">
                <div className="compare-item">
                  <span className="compare-label">传统打字</span>
                  <div className="compare-value">
                    <span className="compare-num">45</span>
                    <span className="compare-unit">wpm</span>
                  </div>
                  <div className="compare-bar compare-bar-slow"><span /></div>
                </div>
                <div className="compare-arrow">→</div>
                <div className="compare-item">
                  <span className="compare-label">ARTIC</span>
                  <div className="compare-value">
                    <span className="compare-num compare-num-fast">220</span>
                    <span className="compare-unit">wpm</span>
                  </div>
                  <div className="compare-bar compare-bar-fast"><span /></div>
                </div>
              </div>
              <p className="hero-caption">超长音频稳定 3 秒内出稿，说完即所得</p>
            </div>
          </Reveal>
        </div>

        {/* Right column: 产品演示（口语 → 商务稿，逐字出现） */}
        <div className="hero-col hero-col-right">
          <Reveal delay={3}>
            <div className="hero-window hero-window-float">
              <InputMockup />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
