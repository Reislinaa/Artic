import Reveal from '../components/Reveal'
import './PaymentPage.css'

// 定价与商业计划书一致：¥29.9/月 · ¥299/年；企业版按人数定价（B 端，需联系）
const PLANS = [
  {
    key: 'pro-monthly',
    name: '专业版 · 月付',
    price: '29.9',
    unit: '/ 月',
    tagline: '按月订阅，随时取消',
    features: ['无限次语音转写', '商务级润色成稿', '跨语言翻译 + 润色', '自定义热键一键唤起', '多设备云同步'],
    cta: '订阅月付',
    popular: false
  },
  {
    key: 'pro-yearly',
    name: '专业版 · 年付',
    price: '299',
    unit: '/ 年',
    tagline: '合 ¥24.9/月，一年省 ¥59.8',
    features: ['包含月付全部功能', '优先体验新功能', '专属客服通道', '年付锁定当前价格', '数据回流越用越准'],
    cta: '订阅年付',
    popular: true
  },
  {
    key: 'enterprise',
    name: '企业版',
    price: '按人数',
    unit: '定价',
    tagline: '企业专属词包与私有术语库',
    features: ['行业术语 / 产品名 / 内部黑话定制', '团队词库共享与统一管理', '按使用人数灵活计费', '专属客户成功支持', '可签订企业采购合同'],
    cta: '联系商务',
    popular: false,
    enterprise: true
  }
]

export default function PaymentPage({ onNavigate }) {
  // 点击订阅 → 跳转到独立收银台页面
  const handleSelect = (p) => {
    if (p.enterprise) {
      window.location.href = 'mailto:business@artic.cn?subject=ARTIC 企业版咨询'
      return
    }
    if (onNavigate) onNavigate('checkout', { plan: p.key })
  }

  return (
    <div className="page pay-page">
      <div className="page-hero">
        <div className="container">
          <span className="page-hero-tag">PRICING · 定价</span>
          <h1 className="page-hero-title">为「靠表达吃饭」的人<em>定价</em></h1>
          <p className="page-hero-sub">
            让说出口的话，就是能直接发出去的稿。10 月 15 日正式上线，创始用户内测进行中。
          </p>
        </div>
      </div>

      <section className="page-section pay-plans">
        <div className="container">
          <div className="plan-grid">
            {PLANS.map((p, i) => (
              <Reveal key={p.key} delay={(i % 3) + 1} variant={['up', 'scale', 'up'][i % 3]}>
                <div className={`plan-card ${p.popular ? 'plan-popular' : ''}`}>
                  {p.popular && <span className="plan-badge">最受欢迎</span>}
                  <h3 className="plan-name">{p.name}</h3>
                  <p className="plan-tagline">{p.tagline}</p>
                  <div className="plan-price">
                    {p.enterprise ? (
                      <>
                        <span className="plan-amount plan-amount-sm">{p.price}</span>
                        <span className="plan-period">{p.unit}</span>
                      </>
                    ) : (
                      <>
                        <span className="plan-currency">¥</span>
                        <span className="plan-amount">{p.price}</span>
                        <span className="plan-period">{p.unit}</span>
                      </>
                    )}
                  </div>
                  <ul className="plan-features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <svg viewBox="0 0 20 20" className="plan-check" aria-hidden>
                          <path d="M5 10.5l3.2 3.2L15 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn ${p.popular ? 'btn-primary' : 'btn-ghost'} plan-btn`}
                    onClick={() => handleSelect(p)}
                  >
                    {p.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="plan-footnote">
            订阅制 · 随时取消；企业版按使用人数计价，可开具增值税发票。
          </p>
        </div>
      </section>

      <section className="page-section page-section-alt">
        <div className="container">
          <Reveal variant="scale">
            <h2 className="page-title">关于支付</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">你也许想知道</p>
          </Reveal>
          <div className="faq-list">
            {[
              { q: '支持哪些支付方式？', a: '目前支持微信支付与支付宝扫码支付，覆盖绝大多数国内用户。' },
              { q: '可以随时取消吗？', a: '按月订阅可随时在账户中心取消，到期后不再续费。' },
              { q: '发票如何开具？', a: '支付成功后可在订单详情中申请电子发票，支持企业抬头与增值税专用发票。' },
              { q: '企业版怎么计费？', a: '企业版按使用人数定价，并为每家企业训练专属词包，可联系我们获取报价。' },
              { q: '支付遇到问题？', a: '请联系客服邮箱 support@artic.cn，我们将尽快协助处理。' }
            ].map((item, i) => (
              <Reveal key={i} delay={(i % 2) + 1} variant={['up', 'blur'][i % 2]}>
                <div className="faq-item">
                  <div className="faq-q"><span className="faq-icon">Q</span><span>{item.q}</span></div>
                  <div className="faq-a"><span className="faq-icon">A</span><span>{item.a}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
