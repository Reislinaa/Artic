import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateSuggestion } from './aiService.js'
import { findUser, findUserByEmail, createUser, addLog } from './store.js'
import {
  PLANS,
  getPayStatus,
  createOrderRecord,
  getOrder,
  markPaid,
  wechatNativePay,
  alipayPrecreate,
  handleWechatNotify,
  handleAlipayNotify,
  scheduleDemoPaid,
  demoQrContent
} from './pay.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
// 保留原始报文：微信支付回调验签必须使用未经解析的 raw body
app.use(express.json({
  verify: (req, res, buf) => {
    if (buf && buf.length) req.rawBody = buf.toString('utf8')
  }
}))
// 支付宝异步通知为 form-urlencoded
app.use(express.urlencoded({ extended: true }))

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI 输入法 API 服务运行正常' })
})

// AI 输入补全接口
app.post('/api/ai/complete', async (req, res) => {
  const { text, mode = 'complete' } = req.body
  if (!text) {
    return res.status(400).json({ error: '缺少输入文本' })
  }
  try {
    const candidates = await generateSuggestion(text, mode)
    // 记录日志
    addLog(text, JSON.stringify(candidates), mode)
    res.json({ candidates, mode })
  } catch (err) {
    console.error('AI 处理出错:', err)
    res.status(500).json({ error: 'AI 服务处理失败，请稍后再试' })
  }
})

// 用户注册（简单版）
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ error: '请填写完整信息' })
  }
  if (findUser(username)) {
    return res.status(409).json({ error: '用户名已存在' })
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: '邮箱已存在' })
  }
  const user = createUser(username, email, password)
  res.json({ success: true, message: '注册成功', user: { id: user.id, username: user.username } })
})

// 用户登录（简单版，仅演示）
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const user = findUser(username)
  if (!user || user.password !== password) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }
  res.json({ success: true, message: '登录成功', user: { id: user.id, username: user.username } })
})

// ===== 支付链路（演示 / 正式 双模式：证件号填进 .env 即自动切换） =====

// 前端读取支付模式与各渠道配置状态
app.get('/api/pay/status', (req, res) => {
  res.json(getPayStatus())
})

// 创建订单：渠道已配置走真实下单，未配置走演示流程
app.post('/api/order/create', async (req, res) => {
  const { plan = 'pro-monthly', method = 'wechat' } = req.body || {}
  if (!PLANS[plan]) return res.status(400).json({ error: '未知的订阅方案' })
  if (!['wechat', 'alipay'].includes(method)) return res.status(400).json({ error: '不支持的支付方式' })

  const order = createOrderRecord({ planKey: plan, method })
  const status = getPayStatus()

  let payUrl
  let mode
  try {
    if (status.channels[method].configured) {
      mode = 'live'
      payUrl = method === 'wechat' ? await wechatNativePay(order) : await alipayPrecreate(order)
    } else {
      mode = 'demo'
      payUrl = demoQrContent(method, order.orderId)
      scheduleDemoPaid(order.orderId)
    }
  } catch (e) {
    console.error('[pay] 下单失败:', e.message)
    // 正式模式下单失败时明确报错，不静默降级为演示，避免「看似付款成功实则未进账」
    return res.status(502).json({ error: '支付下单失败：' + e.message })
  }

  res.json({
    orderId: order.orderId,
    planKey: order.planKey,
    method: order.method,
    amount: order.amount,
    subject: order.subject,
    payUrl,
    mode
  })
})

// 订单状态（前端轮询；正式模式的支付结果由官方回调写入）
app.get('/api/order/status', (req, res) => {
  const o = getOrder(req.query.orderId)
  if (!o) return res.status(404).json({ error: '订单不存在' })
  res.json({
    orderId: o.orderId,
    status: o.status,
    amount: o.amount,
    planKey: o.planKey,
    paidAt: o.paidAt || null
  })
})

// 仅演示模式可用：正式模式下拒绝，防止绕过真实支付
app.post('/api/order/forcepaid', (req, res) => {
  if (getPayStatus().mode === 'live') {
    return res.status(403).json({ error: '正式模式下不允许模拟支付' })
  }
  const ok = markPaid((req.body || {}).orderId)
  if (!ok) return res.status(404).json({ error: '订单不存在' })
  res.json({ ok: true })
})

// 微信支付结果通知（需返回 200 + SUCCESS，否则微信会重试）
app.post('/api/pay/wechat/notify', (req, res) => {
  try {
    const r = handleWechatNotify(req.headers, req.rawBody || JSON.stringify(req.body || {}))
    if (!r.ok) {
      console.warn('[pay] 微信回调校验失败:', r.reason)
      return res.status(400).json({ code: 'FAIL', message: r.reason })
    }
    console.log(`[pay] 微信支付成功 ${r.orderId}（验签：${r.verified ? '已验签' : '未配置平台证书'}）`)
    res.json({ code: 'SUCCESS', message: '成功' })
  } catch (e) {
    console.error('[pay] 微信回调异常:', e)
    res.status(500).json({ code: 'FAIL', message: '处理异常' })
  }
})

// 支付宝异步通知（成功需返回纯文本 success）
app.post('/api/pay/alipay/notify', async (req, res) => {
  try {
    const r = await handleAlipayNotify(req.body || {})
    if (!r.ok) {
      console.warn('[pay] 支付宝回调校验失败:', r.reason)
      return res.send('failure')
    }
    console.log(`[pay] 支付宝支付成功 ${r.orderId}`)
    res.send('success')
  } catch (e) {
    console.error('[pay] 支付宝回调异常:', e)
    res.send('failure')
  }
})

// 生产环境静态资源
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  const pay = getPayStatus()
  console.log(`ARTIC 后端服务已启动: http://localhost:${PORT}`)
  console.log(`支付模式: ${pay.mode === 'live' ? '正式（已接入官方支付通道）' : '演示（填入 .env 商户参数后自动切换）'}`)
  if (pay.mode === 'demo') {
    if (pay.channels.wechat.missing.length) {
      console.log(`  微信支付待配置: ${pay.channels.wechat.missing.join(', ')}`)
    }
    if (pay.channels.alipay.missing.length) {
      console.log(`  支付宝待配置: ${pay.channels.alipay.missing.join(', ')}`)
    }
  }
})
