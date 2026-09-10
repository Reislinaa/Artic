import Reveal from '../components/Reveal'

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: '表达至上',
    desc: '我们服务那些靠表达吃饭的人。让他们更清晰地表达，更高效地完成大量沟通。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 15 9l7 .5-5.5 4.5L18.5 21 12 17 5.5 21l2-7L2 9.5 9 9z" />
      </svg>
    ),
    title: '质量即分水岭',
    desc: '识别准只是及格线，写得好才是付费理由。功能数量让位于润色质量。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '数据只属于你',
    desc: '语音与文本优先在本地处理，敏感内容无需上传云端，你的表达只属于你。'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 3v6h-6" />
      </svg>
    ),
    title: '越用越准',
    desc: '采纳、修改与重写持续回流为场景语料，让产品随使用规模变强而非变慢。'
  }
]

const milestones = [
  { year: '2026', title: 'ARTIC 立项', desc: '四位合伙人共同出资设立，聚焦高端商务场景的表达效率。' },
  { year: '2026 · 9', title: '创始用户内测', desc: '50 位 Founding User Program 启动，共创反馈驱动产品迭代。' },
  { year: '2026 · 10', title: '正式上线', desc: '语音转写 + 商务润色、语音 + 翻译 + 润色两大核心功能发布。' },
  { year: '下一步', title: '企业专属词包', desc: '为每家企业训练专属术语库，承接企业级表达效率需求。' }
]

const contactItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: '产品反馈',
    value: 'feedback@artic.cn',
    href: 'mailto:feedback@artic.cn'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    label: '商务合作 / 企业版',
    value: 'business@artic.cn',
    href: 'mailto:business@artic.cn'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: '问题咨询',
    value: 'support@artic.cn',
    href: 'mailto:support@artic.cn'
  }
]

export default function AboutPage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-hero">
        <div className="container">
          <span className="page-hero-tag">ABOUT US · 关于我们</span>
          <h1 className="page-hero-title">为「高表达密度」的人<em>而生</em></h1>
          <p className="page-hero-sub">
            ARTIC 是一家为高表达密度人群而生的 AI 软件公司。我们服务律师、金融从业者、
            高端销售、品牌策划、项目经理——那些对表达的精准度与专业度有极高要求的人。
          </p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          <Reveal variant="blur">
            <h2 className="page-title">我们的信念</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">四个判断，决定我们怎么做产品</p>
          </Reveal>
          <div className="values-grid">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) + 1} variant={['up', 'blur', 'scale', 'fade'][i % 4]}>
                <div className="value-card">
                  <div className="value-icon">{v.icon}</div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section page-section-alt">
        <div className="container">
          <Reveal variant="blur">
            <h2 className="page-title">发展历程</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">从立项到上线，与创始用户一起打磨</p>
          </Reveal>
          <div className="timeline">
            {milestones.map((m, i) => (
              <Reveal key={i} delay={(i % 2) + 1} variant={['left', 'scale'][i % 2]}>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-year">{m.year}</span>
                    <h3 className="timeline-title">{m.title}</h3>
                    <p className="timeline-desc">{m.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          <Reveal variant="blur">
            <h2 className="page-title">联系我们</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">任何需求，随时与我们沟通</p>
          </Reveal>
          <div className="contact-grid">
            {contactItems.map((c, i) => (
              <Reveal key={c.label} delay={(i % 2) + 1} variant={['up', 'scale', 'left', 'right'][i % 4]}>
                <a className="contact-card" href={c.href}>
                  <div className="contact-icon">{c.icon}</div>
                  <div className="contact-label">{c.label}</div>
                  <div className="contact-value">{c.value}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section page-section-alt">
        <div className="container">
          <Reveal variant="scale">
            <div className="cta-banner">
              <div>
                <h2 className="cta-title">想让每句话都能直接发出去？</h2>
                <p className="cta-desc">开始使用 ARTIC，把开口变成可发送的商务稿</p>
              </div>
              <button className="btn btn-primary" onClick={() => onNavigate('pricing')}>查看定价</button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
