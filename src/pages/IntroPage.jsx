import Reveal from '../components/Reveal'

const scenarios = [
  {
    title: '客户沟通',
    desc: '金融、高端销售每天数十条客户消息：说出口的是口语，发出去的必须是得体的书面表达。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    title: '工作汇报',
    desc: '会议纪要、日报周报、项目同步：脑子里已经想明白，但结构化成稿更慢。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )
  },
  {
    title: '商务邮件',
    desc: '口语化表达一键转为正式、得体的商务邮件，措辞不必再反复打磨。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  },
  {
    title: '会议记录',
    desc: '边说边记，关键内容实时转写，会后直接输出可发送的纪要。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    )
  },
  {
    title: '跨语言沟通',
    desc: '中文口语输入，连语气与商务礼节一起重写为地道的外语商务表达。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    title: '内容创作',
    desc: '自媒体商务对接：品牌合作中的细节沟通与确认，每一条都要快速、专业、得体。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  }
]

export default function IntroPage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-hero">
        <div className="container">
          <span className="page-hero-tag">FEATURES · 功能</span>
          <h1 className="page-hero-title">为表达而生的<em>语音成稿工具</em></h1>
          <p className="page-hero-sub">
            ARTIC 把语音、理解与润色能力融入每一次输入，让你在任何文本框里都能快速、自然、准确地表达——
            说出口的话，就是能直接发出去的稿。
          </p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          <Reveal variant="fade">
            <span className="section-kicker">Use cases</span>
          </Reveal>
          <Reveal variant="blur">
            <h2 className="page-title">你在哪写，它就在哪</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">覆盖高端商务场景最典型的高频沟通与成稿需求</p>
          </Reveal>

          <div className="scenario-grid">
            {scenarios.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) + 1} variant={['up', 'scale', 'blur'][i % 3]}>
                <div className="scenario-card">
                  <div className="scenario-icon">{s.icon}</div>
                  <h3 className="scenario-title">{s.title}</h3>
                  <p className="scenario-desc">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          <Reveal variant="scale">
            <div className="cta-banner">
              <div>
                <h2 className="cta-title">准备好开始说了吗？</h2>
                <p className="cta-desc">下载 ARTIC，把开口变成可发送的商务稿</p>
              </div>
              <button className="btn btn-primary" onClick={() => onNavigate('download')}>立即下载</button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
