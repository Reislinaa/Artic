import Reveal from '../components/Reveal'

const scenarios = [
  {
    title: '客户沟通',
    desc: '客户一句语音发来，你回过去的是干净的书面确认。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    title: '工作汇报',
    desc: '会开完了，话也讲清楚了，就卡在把口头话整理成文字。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )
  },
  {
    title: '商务邮件',
    desc: '该说的都说了，只差把口头话收拾成正式邮件的样子。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  },
  {
    title: '会议记录',
    desc: '边开会边记，散会纪要已经写好，直接就能发。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    )
  },
  {
    title: '跨语言沟通',
    desc: '用中文想清楚，发给对方的却是得体的英文。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    title: '内容创作',
    desc: '品牌合作细节来回确认，说出来就是能直接发出去的回复。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
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
            ARTIC 把语音与润色带进每一次输入，任何文本框里，说出口的话就是能直接发出去的稿。
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
            <p className="page-subtitle">从回客户消息到整理会议纪要，开口就成了稿</p>
          </Reveal>

          <div className="scenario-grid">
            {scenarios.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) + 1} variant={['up', 'scale', 'blur'][i % 3]}>
                <div className="scenario-card">
                  <div className="scenario-head">
                    <span className="scenario-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="scenario-icon">{s.icon}</span>
                  </div>
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
