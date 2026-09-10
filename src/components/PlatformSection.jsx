import Reveal from './Reveal'
import PlatformSpecs from './PlatformSpecs'
import './PlatformSection.css'

// 多端适配区块：用规格表说明各端支持程度（克制，不用卡片墙）
export default function PlatformSection({ onNavigate }) {
  return (
    <section className="section platform" id="platform">
      <div className="container">
        <Reveal variant="fade">
          <span className="section-kicker">Works everywhere you type</span>
        </Reveal>
        <Reveal variant="blur">
          <h2 className="section-title">
            一处习惯，处处如一
          </h2>
        </Reveal>
        <Reveal delay={1} variant="fade">
          <p className="section-subtitle">
            同一套热键与词库，跟着你在六个平台上工作。
          </p>
        </Reveal>

        <PlatformSpecs onNavigate={onNavigate} />

        <Reveal delay={2} variant="up">
          <div className="platform-cta">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('download')}
            >
              选择你的平台下载
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
