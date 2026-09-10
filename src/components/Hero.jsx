import Reveal from './Reveal'
import InputMockup from './InputMockup'

export default function Hero({ onStartDemo, onNavigate }) {
  return (
    <section className="hero" id="home">
      {/* 黑底 + 橙色光晕：主光斑（右上）+ 地平线光带（底部中央） */}
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-horizon" aria-hidden="true" />

      <div className="hero-content">
        {/* Left column: copy + actions + compare */}
        <div className="hero-col hero-col-left">
          <Reveal>
            <span className="hero-tag">ARTIC · AI 语音成稿</span>
          </Reveal>

          <Reveal delay={1} variant="scale">
            <h1 className="hero-title">
              <span className="hero-line">说出来</span>
              <span className="hero-line hero-gradient">即成文</span>
            </h1>
          </Reveal>

          <Reveal delay={2} variant="blur">
            <p className="hero-subtitle">
              把说出口的话，变成能直接发出去的商务稿。
              语音转写 · 商务润色 · 跨语言翻译 · 一键唤起
            </p>
          </Reveal>

          <Reveal delay={3} variant="up" duration={0.7}>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('pricing')}>
                开始使用
              </button>
              <button className="btn btn-on-ink btn-lg" onClick={() => onNavigate('features')}>
                了解更多
              </button>
            </div>
          </Reveal>

          {/* speed comparison sits below the buttons in the LEFT column */}
          <Reveal delay={5} variant="up">
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
          </Reveal>
        </div>

        {/* Right column: phone / chat mockup */}
        <div className="hero-col hero-col-right">
          <Reveal delay={4} variant="fade">
            <InputMockup />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
