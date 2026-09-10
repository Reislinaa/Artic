import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Reveal from './Reveal'
import InputMockup from './InputMockup'

/**
 * Hero。
 *
 * 动效原则（v15）：**只保留光斑的缓慢「呼吸」这一层环境动效**。
 *
 * 原先堆在这里的鼠标跟随全部移除：
 *   · 光斑随光标反向漂移
 *   · 产品窗口 3D 倾斜（rotateX / rotateY）
 *   · 窗口内层视差
 *   · 跟随光标的高光斑
 *   · 标题文字随光标「弥散」（逐字被推开 + 变模糊）
 *   · CTA 磁吸
 * 理由：它们是「炫技作品集」的视觉语言，与「这是一款让你写出正式商务稿的工具」
 * 的气质冲突；而且文字弥散会直接把标题推歪、糊掉，干扰阅读。
 *
 * 真正承担说服力的动效，交给右侧的产品演示 —— 它展示的是产品怎么工作：
 * 口语逐字转写 → 改写为书面语 → 成稿逐字输出。
 */
export default function Hero({ onStartDemo, onNavigate }) {
  const glowRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (!glowRef.current) return
      const tween = gsap.to(glowRef.current, {
        scale: 1.06,
        opacity: 0.9,
        duration: 9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      })
      return () => tween.kill()
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
        {/* Left column: 主张 + 行动 + 数据 */}
        <div className="hero-col hero-col-left">
          <Reveal>
            <span className="hero-tag">ARTIC · AI 语音成稿</span>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="hero-title">
              <span className="hero-line">说出来</span>
              <span className="hero-line hero-gradient">就是商务稿</span>
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="hero-subtitle">
              不是把语音变成字幕，是直接写成能发出去的稿。
              <br />
              口语自动改书面语&nbsp;·&nbsp;说错自动纠正&nbsp;·&nbsp;一处习惯，处处能用
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
            <div className="hero-window">
              <InputMockup />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
