import Reveal from './Reveal'
import AdapterCarousel from './AdapterCarousel'
import './PlatformSection.css'

// 多端适配区块：转盘展示支持的平台
export default function PlatformSection({ onNavigate }) {
  return (
    <section className="section platform" id="platform">
      <div className="container">
        <Reveal variant="fade">
          <span className="section-kicker">Works everywhere you type</span>
        </Reveal>
        <Reveal variant="blur">
          <h2 className="section-title">一处习惯，处处如一</h2>
        </Reveal>
        <Reveal delay={1} variant="fade">
          <p className="section-subtitle">
            ARTIC在你熟悉的每个平台上都能使用，不挑应用
          </p>
        </Reveal>

        <AdapterCarousel />

        <Reveal delay={2} variant="up">
          <div className="platform-cta">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('download')}>
              立即下载
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
