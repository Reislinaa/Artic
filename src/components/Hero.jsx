import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Reveal from './Reveal'
import DisperseText from './DisperseText'
import MagneticButton from './MagneticButton'
import InputMockup from './InputMockup'

/**
 * Hero。
 *
 * 鼠标动效分四组，全部用 GSAP 的 quickTo 做平滑跟随：
 *   ① 弥散光斑     —— 常驻「呼吸」+ 随鼠标反向漂移
 *   ② 产品小窗口   —— 常驻上下浮动
 *   ③ 产品小窗口   —— 3D 倾斜（rotateX / rotateY）+ 轻微位移，朝向光标
 *   ④ 窗口内层     —— 视差位移比外框更大，形成景深
 * 另加一层跟随光标的高光（写 CSS 变量，不经过 React）。
 *
 * 三层 DOM 分开承载「浮动 / 倾斜 / 视差」，是为了让 GSAP 与 CSS
 * 不要在同一个 transform 上打架（同一个属性被两处驱动会互相覆盖）。
 */
export default function Hero({ onStartDemo, onNavigate }) {
  const heroRef = useRef(null)
  const glowRef = useRef(null)
  const floatRef = useRef(null)
  const tiltRef = useRef(null)
  const bodyRef = useRef(null)
  const glareRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tweens = []

      /* ① 光斑常驻呼吸（property 与「鼠标漂移」的 x/y 不重叠） */
      if (glowRef.current) {
        tweens.push(
          gsap.to(glowRef.current, {
            scale: 1.08,
            opacity: 0.92,
            duration: 7,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        )
      }

      /* ② 小窗口常驻轻浮（放在最外层，避开鼠标控制的 y） */
      if (floatRef.current) {
        tweens.push(
          gsap.to(floatRef.current, {
            y: -12,
            duration: 3.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        )
      }

      /* ③④ 鼠标跟随：quickTo 让每次更新都是「向目标平滑逼近」而不是硬切 */
      const tilt = tiltRef.current
      const glare = glareRef.current
      if (tilt) gsap.set(tilt, { transformPerspective: 1000, transformOrigin: 'center center' })

      const glowX = glowRef.current ? gsap.quickTo(glowRef.current, 'x', { duration: 1.1, ease: 'power3.out' }) : null
      const glowY = glowRef.current ? gsap.quickTo(glowRef.current, 'y', { duration: 1.1, ease: 'power3.out' }) : null
      const rotX = tilt ? gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' }) : null
      const rotY = tilt ? gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' }) : null
      const winX = tilt ? gsap.quickTo(tilt, 'x', { duration: 0.8, ease: 'power3.out' }) : null
      const winY = tilt ? gsap.quickTo(tilt, 'y', { duration: 0.8, ease: 'power3.out' }) : null
      const bodyX = bodyRef.current ? gsap.quickTo(bodyRef.current, 'x', { duration: 0.9, ease: 'power3.out' }) : null
      const bodyY = bodyRef.current ? gsap.quickTo(bodyRef.current, 'y', { duration: 0.9, ease: 'power3.out' }) : null

      const onMove = (e) => {
        const hr = hero.getBoundingClientRect()
        const nx = (e.clientX - hr.left) / hr.width - 0.5
        const ny = (e.clientY - hr.top) / hr.height - 0.5

        /* 光斑朝鼠标反方向漂移：产生「光被推开」的弥散感 */
        if (glowX) glowX(-nx * 54)
        if (glowY) glowY(-ny * 40)

        if (!tilt) return
        const cr = tilt.getBoundingClientRect()
        const px = (e.clientX - cr.left) / cr.width - 0.5
        const py = (e.clientY - cr.top) / cr.height - 0.5

        if (rotY) rotY(px * 20)
        if (rotX) rotX(-py * 16)
        if (winX) winX(px * 14)
        if (winY) winY(py * 10)
        if (bodyX) bodyX(px * 26)
        if (bodyY) bodyY(py * 20)

        if (glare) {
          glare.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
          glare.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
        }
      }

      hero.addEventListener('mousemove', onMove, { passive: true })

      return () => {
        hero.removeEventListener('mousemove', onMove)
        tweens.forEach((t) => t.kill())
        gsap.set(
          [glowRef.current, floatRef.current, tiltRef.current, bodyRef.current].filter(Boolean),
          { clearProps: 'all' }
        )
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* 黑底时期遗留的命名保留：hero-glow 现在是一团橙黄弥散光斑 */}
      <div className="hero-glow-wrap" aria-hidden="true">
        <span className="hero-glow" ref={glowRef} />
      </div>
      <div className="hero-horizon" aria-hidden="true" />

      <div className="hero-content">
        {/* Left column: copy + actions + compare */}
        <div className="hero-col hero-col-left">
          <Reveal>
            <span className="hero-tag">ARTIC · AI 语音成稿</span>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="hero-title">
              <DisperseText as="span" className="hero-line" text="说出来" />
              <DisperseText as="span" className="hero-line hero-gradient" text="即成文" />
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="hero-subtitle">
              把说出口的话，变成能直接发出去的商务稿。
              <br />
              语音转写&nbsp;·&nbsp;商务润色&nbsp;·&nbsp;跨语言翻译&nbsp;·&nbsp;一键唤起
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="hero-actions">
              <MagneticButton
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('pricing')}
              >
                开始使用
              </MagneticButton>
              <button className="btn btn-ghost btn-lg" onClick={() => onNavigate('features')}>
                了解更多
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

        {/* Right column: 产品小窗口（浮动 / 倾斜 / 视差 分三层） */}
        <div className="hero-col hero-col-right">
          <Reveal delay={3}>
            <div className="hero-window" ref={floatRef}>
              <div className="hero-window-tilt" ref={tiltRef}>
                <span className="hero-window-glare" ref={glareRef} aria-hidden="true" />
                <div className="hero-window-body" ref={bodyRef}>
                  <InputMockup />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
