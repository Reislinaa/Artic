import { useState, useEffect, useRef, useCallback } from 'react'
import QRCode from 'qrcode'
import { siWechat, siAlipay } from 'simple-icons'
import './CheckoutPage.css'

// 服务端价格表为准（server/pay.js 的 PLANS），此处仅用于界面展示
const PLAN_META = {
  'pro-monthly': {
    key: 'pro-monthly',
    name: '专业版 · 月付',
    price: 29.9,
    cycle: '每月',
    features: ['无限次语音转写', '商务级润色成稿', '跨语言翻译 + 润色', '自定义热键一键唤起', '多设备云同步']
  },
  'pro-yearly': {
    key: 'pro-yearly',
    name: '专业版 · 年付',
    price: 299,
    cycle: '每年',
    features: ['包含月付全部功能', '合 ¥24.9/月，一年省 ¥59.8', '优先体验新功能', '专属客服通道', '年付锁定当前价格']
  }
}

const METHOD_META = {
  wechat: { label: '微信支付', icon: siWechat, color: '#07C160', hint: '请使用微信扫一扫' },
  alipay: { label: '支付宝', icon: siAlipay, color: '#1677FF', hint: '请使用支付宝扫一扫' }
}

// 订单有效期（前端展示用；后端为内存实现，正式环境请落库并加服务端过期）
const ORDER_TTL = 15 * 60

function fmtTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function CheckoutPage({ planKey, onNavigate }) {
  const plan = PLAN_META[planKey] || null
  const [method, setMethod] = useState('wechat')
  const [order, setOrder] = useState(null)
  const [qr, setQr] = useState('')
  const [error, setError] = useState('')
  // creating | pending | paid | expired | failed
  const [status, setStatus] = useState('creating')
  const [remain, setRemain] = useState(ORDER_TTL)
  const [payStatus, setPayStatus] = useState(null)
  const pollRef = useRef(null)

  const isDemo = !payStatus || payStatus.mode === 'demo'

  // 读取支付模式（演示 / 正式）
  useEffect(() => {
    let cancelled = false
    fetch('/api/pay/status')
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setPayStatus(d) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // 创建订单：进入页面、切换渠道、重新下单都会走这里
  const createOrder = useCallback(async (payMethod) => {
    setError('')
    setQr('')
    setStatus('creating')
    try {
      const r = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, method: payMethod })
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || '创建订单失败')
      setOrder(d)
      setStatus('pending')
      setRemain(ORDER_TTL)
    } catch (e) {
      setError(e.message || '网络异常，请稍后再试')
      setStatus('failed')
    }
  }, [planKey])

  useEffect(() => {
    if (!plan) return
    createOrder(method)
  }, [plan, method, createOrder])

  // 生成二维码
  useEffect(() => {
    if (!order?.payUrl) return
    let cancelled = false
    QRCode.toDataURL(order.payUrl, {
      width: 260, margin: 1,
      color: { dark: '#0A0A0A', light: '#FFFFFF' }
    }).then((url) => { if (!cancelled) setQr(url) }).catch(() => {})
    return () => { cancelled = true }
  }, [order?.payUrl])

  // 轮询订单状态
  useEffect(() => {
    if (status !== 'pending' || !order) return
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/order/status?orderId=${order.orderId}`)
        const d = await r.json()
        if (d.status === 'paid') {
          clearInterval(pollRef.current)
          setStatus('paid')
        }
      } catch (e) { /* 忽略单次轮询错误 */ }
    }, 1500)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [status, order])

  // 订单有效期倒计时
  useEffect(() => {
    if (status !== 'pending') return
    const deadline = Date.now() + ORDER_TTL * 1000
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemain(left)
      if (left === 0) {
        clearInterval(timer)
        setStatus('expired')
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [status, order?.orderId])

  const handleForcePaid = async () => {
    if (!order) return
    try {
      const r = await fetch('/api/order/forcepaid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId })
      })
      if (!r.ok) throw new Error('模拟支付失败')
      setStatus('paid')
    } catch (e) {
      setError(e.message)
    }
  }

  // 未选择方案（例如直接访问 #/checkout）
  if (!plan) {
    return (
      <div className="page co-page">
        <div className="co-shell">
          <div className="co-card co-empty">
            <h2>还没有选择订阅方案</h2>
            <p>请先选择月付或年付方案，再进行支付。</p>
            <button className="btn btn-primary" onClick={() => onNavigate('pricing')}>
              去选择方案
            </button>
          </div>
        </div>
      </div>
    )
  }

  const meta = METHOD_META[method]

  return (
    <div className="page co-page">
      <div className="co-shell">
        {/* 顶部：返回 + 标题 + 订单号 */}
        <div className="co-head">
          <button className="co-back" onClick={() => onNavigate('pricing')}>← 返回定价</button>
          <div className="co-head-title">
            <h1>收银台</h1>
            <span className="co-secure">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              安全支付 · 由官方支付通道处理
            </span>
          </div>
          {order && <span className="co-order-no">订单号 {order.orderId}</span>}
        </div>

        {/* 支付模式提示 */}
        {payStatus && (
          <div className={`co-mode-bar ${isDemo ? 'is-demo' : 'is-live'}`}>
            <span className="co-mode-dot" />
            {isDemo ? (
              <span>
                <strong>演示模式</strong>：当前未接入商户号，扫码流程为演示，可点下方「模拟扫码支付成功」查看完整流程。
                取得微信商户号与支付宝应用后填入 <code>.env</code>，本页自动切换为正式收款，无需改代码。
              </span>
            ) : (
              <span>
                <strong>正式模式</strong>：已接入官方支付通道，支付结果由微信 / 支付宝异步回调确认。
              </span>
            )}
          </div>
        )}

        {/* 支付成功 */}
        {status === 'paid' ? (
          <div className="co-card co-success">
            <div className="co-success-icon">
              <svg viewBox="0 0 48 48" aria-hidden>
                <path d="M14 24.5l7 7L34 17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>支付成功</h2>
            <p>已为你开通 <strong>{plan.name}</strong>，去体验更聪明的表达吧。</p>
            <div className="co-success-actions">
              <button className="btn btn-primary" onClick={() => onNavigate('download')}>下载体验</button>
              <button className="btn btn-ghost" onClick={() => onNavigate('home')}>返回首页</button>
            </div>
          </div>
        ) : (
          <div className="co-grid">
            {/* 左：支付方式 + 二维码 */}
            <div className="co-card co-main">
              <span className="co-label">支付方式</span>
              <div className="co-methods">
                {Object.entries(METHOD_META).map(([key, m]) => (
                  <button
                    key={key}
                    className={`co-method ${method === key ? 'active' : ''}`}
                    style={method === key ? { '--m-color': m.color } : undefined}
                    onClick={() => { if (key !== method) setMethod(key) }}
                    disabled={status === 'creating'}
                  >
                    <svg viewBox="0 0 24 24" fill={m.color} aria-hidden><path d={m.icon.path} /></svg>
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="co-qr-area">
                {status === 'expired' ? (
                  <div className="co-qr-state">
                    <p className="co-qr-state-title">订单已超时</p>
                    <p className="co-qr-state-desc">二维码已失效，请重新下单</p>
                    <button className="btn btn-primary" onClick={() => createOrder(method)}>重新下单</button>
                  </div>
                ) : status === 'failed' ? (
                  <div className="co-qr-state">
                    <p className="co-qr-state-title">下单失败</p>
                    <p className="co-qr-state-desc">{error || '请稍后重试'}</p>
                    <button className="btn btn-primary" onClick={() => createOrder(method)}>重试</button>
                  </div>
                ) : (
                  <>
                    <div className="co-qr-frame">
                      {qr ? (
                        <img src={qr} alt="支付二维码" className="co-qr" />
                      ) : (
                        <div className="co-qr-loading">二维码生成中…</div>
                      )}
                    </div>
                    <p className="co-qr-tip">
                      {meta.hint}，完成 <strong>¥{order?.amount ?? plan.price}</strong> 的支付
                    </p>
                    <div className="co-status">
                      <span className="co-dot" />
                      等待支付…
                      <span className="co-timer">二维码 {fmtTime(remain)} 后失效</span>
                    </div>
                    {isDemo && (
                      <button className="co-demo" onClick={handleForcePaid}>
                        演示：模拟扫码支付成功
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 右：订单摘要 */}
            <div className="co-card co-side">
              <span className="co-label">订单摘要</span>
              <div className="co-plan-name">{plan.name}</div>
              <div className="co-rows">
                <div className="co-row">
                  <span>计费周期</span>
                  <span>{plan.cycle}</span>
                </div>
                <div className="co-row">
                  <span>单价</span>
                  <span>¥{plan.price}</span>
                </div>
                <div className="co-row">
                  <span>数量</span>
                  <span>1</span>
                </div>
                <div className="co-row co-row-total">
                  <span>应付金额</span>
                  <strong>¥{order?.amount ?? plan.price}</strong>
                </div>
              </div>

              <ul className="co-benefits">
                {plan.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 20 20" className="co-check" aria-hidden>
                      <path d="M5 10.5l3.2 3.2L15 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <p className="co-note">
                订阅制 · 可随时取消。支付完成后由账户系统自动开通权益。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
