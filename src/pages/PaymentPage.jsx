import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { siWechat, siAlipay } from 'simple-icons'
import Reveal from '../components/Reveal'
import './PaymentPage.css'

const PLANS = [
  {
    id: 'free',
    name: '免费版',
    price: 0,
    period: '永久免费',
    tagline: '体验核心输入能力',
    features: ['每日 20 次语音转写', '基础智能润色', '单设备登录', '社区支持'],
    cta: '当前版本',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro 专业版',
    price: 29,
    period: '每月',
    tagline: '高频用户的全能之选',
    features: ['无限次语音转写', '长录音智能整理', '跨语言实时翻译', '多设备云同步', '优先客服'],
    cta: '选择并开通',
    popular: true
  },
  {
    id: 'team',
    name: '团队版',
    price: 99,
    period: '每月',
    tagline: '协作与团队管理',
    features: ['包含 Pro 全部能力', '5 个成员席位', '团队词库共享', '使用数据看板', '专属客户经理'],
    cta: '选择并开通',
    popular: false
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
  const pollRef = useRef(null)

  // 进入支付：创建订单（按方案 + 渠道）
  const createOrder = async (planId, payMethod) => {
    setError('')
    try {
      const r = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, method: payMethod })
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || '创建订单失败')
      setOrder(d)
    } catch (e) {
      setError(e.message || '网络异常，请稍后再试')
    }
  }

  const handleSelect = (p) => {
    if (p.id === 'free') return // 免费版无需开通
    setPlan(p)
    setStep('pay')
    setQr('')
    createOrder(p.id, method)
  }

  const handleMethodChange = (m) => {
    if (m === method) return
    setMethod(m)
    if (plan) createOrder(plan.id, m)
  }

  const handleForcePaid = async () => {
    if (!order) return
    try {
      await fetch('/api/order/forcepaid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId })
      })
      setStep('success')
    } catch (e) {
      setError('模拟支付失败，请重试')
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
      color: { dark: '#1C1C1E', light: '#FFFFFF' }
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
          <span className="page-hero-tag">MEMBERSHIP · 开通会员</span>
          <h1 className="page-hero-title">选择适合你的<em>流星语</em></h1>
          <p className="page-hero-sub">
            付费解锁更长的录音时长、更聪明的整理能力——说出来，即成文
          </p>
        </div>
      </div>

      {/* 方案选择 */}
      <section className="page-section">
        <div className="container">
          <Reveal variant="blur">
            <h2 className="page-title">三种方案，按需选择</h2>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <p className="page-subtitle">从免费体验到团队协作，平滑升级</p>
          </Reveal>

          <div className="plan-grid">
            {PLANS.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) + 1} variant={['up', 'scale', 'up'][i % 3]}>
                <div className={`plan-card ${p.popular ? 'plan-popular' : ''} ${plan?.id === p.id ? 'plan-active' : ''}`}>
                  {p.popular && <span className="plan-badge">最受欢迎</span>}
                  <h3 className="plan-name">{p.name}</h3>
                  <p className="plan-tagline">{p.tagline}</p>
                  <div className="plan-price">
                    <span className="plan-currency">¥</span>
                    <span className="plan-amount">{p.price}</span>
                    <span className="plan-period">/ {p.period}</span>
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
                    disabled={p.id === 'free'}
                    onClick={() => handleSelect(p)}
                  >
                    {p.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
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
                        {plan && order.amount > 0
                          ? `等待${METHOD_META[method].label}扫码支付…`
                          : '准备中…'}
                      </div>
                      <button className="pay-demo" onClick={handleForcePaid}>
                        演示：模拟扫码支付成功
                      </button>
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
                    <p>已为你开通 <strong>{plan?.name}</strong>，去体验更聪明的输入吧。</p>
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
              { q: '发票如何开具？', a: '支付成功后可在订单详情中申请电子发票，支持企业抬头。' },
              { q: '支付遇到问题？', a: '请联系客服邮箱 support@liuxingyu.cn，我们将尽快协助处理。' }
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
