import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateSuggestion } from './aiService.js'
import { findUser, findUserByEmail, createUser, addLog } from './store.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

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

// ===== 支付订单（演示用 Mock，接真实支付需替换为微信/支付宝 SDK） =====
// 真实接入：
//   微信支付 → 服务端调用「统一下单」拿到 code_url，前端用原生二维码展示，
//             通过「查询订单」或「支付结果通知」回调更新 status。
//   支付宝   → 服务端调用「alipay.trade.precreate」拿到 qr_code，同样轮询/异步通知。
const orders = new Map()

app.post('/api/order/create', (req, res) => {
  const { plan = 'pro', method = 'wechat' } = req.body || {}
  const orderId = 'LXY' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
  const amountMap = { free: 0, pro: 29, team: 99 }
  const amount = amountMap[plan] ?? 29
  // 真实场景此 payUrl 由对应支付 SDK 的下单接口返回
  const payUrl = method === 'wechat'
    ? `weixin://wxpay/bizpayurl?pr=${orderId}`
    : `alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fm.alipay.com%2F%3ForderId%3D${orderId}`
  orders.set(orderId, { orderId, plan, method, amount, status: 'pending', createdAt: Date.now() })
  // 演示：8 秒后自动置为已支付（模拟用户扫码完成）
  setTimeout(() => {
    const o = orders.get(orderId)
    if (o && o.status === 'pending') o.status = 'paid'
  }, 8000)
  res.json({ orderId, payUrl, amount, method, plan })
})

app.get('/api/order/status', (req, res) => {
  const { orderId } = req.query
  const o = orders.get(orderId)
  if (!o) return res.status(404).json({ error: '订单不存在' })
  res.json({ orderId, status: o.status, amount: o.amount, plan: o.plan })
})

// 演示：立即标记支付成功（无需等待 8 秒自动模拟）
app.post('/api/order/forcepaid', (req, res) => {
  const { orderId } = (req.body || {})
  const o = orders.get(orderId)
  if (!o) return res.status(404).json({ error: '订单不存在' })
  o.status = 'paid'
  res.json({ ok: true })
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
  console.log(`AI 输入法后端服务已启动: http://localhost:${PORT}`)
})
