import Reveal from './Reveal'
import ScrollLine from './ScrollLine'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
    en: 'VOICE',
    title: '语音转写',
    desc: '随口说，自动整理成干净文字。去除口癖、重复与自我纠正，只保留最终表达。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3v14a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    ),
    en: 'COMPLETE',
    title: '智能补全',
    desc: '理解上下文与语气，未写完的句子已为你续上，表达快人一步。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
      </svg>
    ),
    en: 'POLISH',
    title: '自动润色',
    desc: '一句口语，自动整理成得体邮件、汇报或文案，张嘴即得成品。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    en: 'TRANSLATE',
    title: '实时翻译',
    desc: '边说边译，支持多种语言即时转写，跨语言沟通不再切换应用。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    en: 'PRIVATE',
    title: '隐私优先',
    desc: '本地优先处理，敏感内容不上云，输入这件事只属于你自己。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    en: 'SYNCED',
    title: '跨端同步',
    desc: '手机、电脑、网页输入习惯与词库无缝同步，处处如一。'
  }
]

export default function Features({ onTryFeature }) {
  return (
    <section className="section features" id="features">
      <div className="container">
        <Reveal variant="fade">
          <span className="section-kicker">Why ARTIC</span>
        </Reveal>
        <Reveal variant="blur">
          <h2 className="section-title">为表达而生的能力</h2>
        </Reveal>
        <Reveal delay={1} variant="fade">
          <p className="section-subtitle">
            把每一次开口，都变成准确、自然、可直接使用的文字
          </p>
        </Reveal>
        <ScrollLine />
        <div className="features-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) + 1} variant={['up', 'scale', 'left', 'right', 'blur'][i % 5]}>
              <div className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <span className="feature-en">{f.en}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
