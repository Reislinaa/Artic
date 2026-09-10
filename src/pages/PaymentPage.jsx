import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { siWechat, siAlipay } from 'simple-icons'
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

const METHOD_META = {
  wechat: { label: '微信支付', icon: siWechat, color: '#07C160' },
  alipay: { label: '支付宝', icon: siAlipay, color: '#1677FF' }
}

function BrandIcon({ icon, color }) {
  if (!icon) return null
  return (
    <svg viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d={icon.path} />
    </svg>
  )
}

export default function PaymentPage({ onNavigate }) {
  const [step, setStep] = useState('select') // select | pay | success
  const [plan, setPlan] = useState(null)
  const [method, setMethod] = useState('wechat')
  const [order, setOrder] = useState(null)
  const [qr, setQr] = useState('')
  const [error, setError] = useState('')
  const [payStatus, setPayStatus] = useState(null)
  const pollRef = useRef(null)

  // 读取后端支付配置状态：决定页面显示「演示模式」还是「正式模式」
  useEffect(() => {
    let cancelled = false
    fetch('/api/pay/status')
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setPayStatus(d) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const isDemo = !payStatus || payStatus.mode === 'demo'

  const createOrder = async (planKey, payMethod) => {
    setError('')
    try {
      const r = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, method: payMethod })
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || '创建订单失败')
      setOrder(d)
    } catch (e) {
      setError(e.message || '网络异常，请稍后再试')
    }
  }

  const handleSelect = (p) => {
    if (p.enterprise) {
      window.location.href = 'mailto:business@artic.cn?subject=ARTIC 企业版咨询'
      return
    }
    setPlan(p)
    setStep('pay')
    setQr('')
    createOrder(p.key, method)
  }

  const handleMethodChange = (m) => {
    if (m === method) return
    setMethod(m)
    if (plan) createOrder(plan.key, m)
  }

  const handleForcePaid = async () => {
    if (!order) return
    try {
      const r = await fetch('/api/order/forcepaid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId })
      })
      if (!r.ok) throw new Error('模拟支付失败')
      setStep('success')
    } catch (e) {
      setError(e.message)
    }
  }

  const backToSelect = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    setStep('select')
    setOrder(null)
    setQr('')
    setPlan(null)
    setError('')
  }

  // 生成二维码
  useEffect(() => {
    if (!order?.payUrl) return
    let cancelled = false
    QRCode.toDataURL(order.payUrl, {
      width: 240, margin: 1,
      color: { dark: '#0F172A', light: '#FFFFFF' }
    }).then((url) => { if (!cancelled) setQr(url) }).catch(() => {})
    return () => { cancelled = true }
  }, [order?.payUrl])

  // 轮询订单状态
  useEffect(() => {
    if (step !== 'pay' || !order) return
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/order/status?orderId=${order.orderId}`)
        const d = await r.json()
        if (d.status === 'paid') {
          clearInterval(pollRef.current)
          setStep('success')
        }
      } catch (e) { /* 忽略单次轮询错误 */ }
    }, 1500)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, order])

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

      {/* 支付模式提示：演示模式说明，正式模式显示安全说明 */}
      <div className="pay-mode-wrap">
        <div className="container">
          {payStatus && (
            <div className={`pay-mode-bar ${isDemo ? 'is-demo' : 'is-live'}`}>
              <span className="pay-mode-dot" />
              {isDemo ? (
                <span>
                  <strong>演示模式</strong>：当前未接入商户号，扫码支付流程为演示。
                  取得微信商户号与支付宝应用后，把证件号填入 <code>.env</code>，本页将自动切换为正式收款，无需改动代码。
                </span>
              ) : (
                <span>
                  <strong>正式模式</strong>：已接入官方支付通道，支付结果由微信 / 支付宝异步回调确认。
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 方案选择 */}
      <section className="page-section pay-plans">
        <div className="container">
          <div className="plan-grid">
            {PLANS.map((p, i) => (
              <Reveal key={p.key} delay={(i % 3) + 1} variant={['up', 'scale', 'up'][i % 3]}>
                <div className={`plan-card ${p.popular ? 'plan-popular' : ''} ${plan?.key === p.key ? 'plan-active' : ''}`}>
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

      {/* 支付面板 */}
      {step !== 'select' && (
        <section className="page-section pay-section">
          <div className="container">
            <Reveal variant="scale">
              <div className="pay-panel">
                {step === 'pay' && order && (
                  <div className="pay-grid">
                    <div className="pay-left">
                      <span className="pay-kicker">ORDER · 订单确认</span>
                      <h3 className="pay-plan-name">{plan?.name}</h3>
                      <div className="pay-amount">
                        <span>应付金额</span>
                        <strong>¥{order.amount}</strong>
                      </div>

                      <div className="pay-methods">
                        {Object.entries(METHOD_META).map(([key, m]) => (
                          <button
                            key={key}
                            className={`pay-method ${method === key ? 'active' : ''}`}
                            style={method === key ? { '--m-color': m.color } : undefined}
                            onClick={() => handleMethodChange(key)}
                          >
                            <BrandIcon icon={m.icon} color={m.color} />
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {error && <p className="pay-error">{error}</p>}

                      <div className="pay-status">
                        <span className="pay-dot" />
                        {`等待${METHOD_META[method].label}扫码支付…`}
                      </div>

                      {isDemo && (
                        <button className="pay-demo" onClick={handleForcePaid}>
                          演示：模拟扫码支付成功
                        </button>
                      )}
                      <button className="pay-back" onClick={backToSelect}>← 重新选择方案</button>
                    </div>

                    <div className="pay-right">
                      <div className="pay-qr-frame">
                        {qr ? (
                          <img src={qr} alt="支付二维码" className="pay-qr" />
                        ) : (
                          <div className="pay-qr-loading">二维码生成中…</div>
                        )}
                      </div>
                      <p className="pay-qr-tip">
                        请使用<strong>{METHOD_META[method].label}</strong>扫一扫完成支付
                      </p>
                      <p className="pay-qr-order">订单号 {order.orderId}</p>
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="pay-success">
                    <div className="pay-success-icon">
                      <svg viewBox="0 0 48 48" aria-hidden>
                        <path d="M14 24.5l7 7L34 17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3>支付成功</h3>
                    <p>已为你开通 <strong>{plan?.name}</strong>，去体验更聪明的表达吧。</p>
                    <div className="pay-success-actions">
                      <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('download')}>
                        下载体验
                      </button>
                      <button className="btn btn-ghost" onClick={backToSelect}>
                        返回方案
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

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
