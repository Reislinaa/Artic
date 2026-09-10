import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateSuggestion } from './aiService.js'
import { findUser, findUserByEmail, createUser, addLog, findUserById, upsertOAuthUser, safeUser } from './store.js'
import {
  getProvider,
  checkProvider,
  getProvidersStatus,
  buildRedirectUri,
  createState,
  readState,
  createSession,
  readSession
} from './oauth.js'
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

// ===== 账号体系 =====

// 注册
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
  res.json({ success: true, message: '注册成功', user: safeUser(user) })
})

// 账号密码登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const user = findUser(username)
  // 第三方登录用户没有密码，禁止用密码登录
  if (!user || !user.password || user.password !== password) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }
  res.json({ success: true, message: '登录成功', user: safeUser(user), token: createSession(user) })
})

// 当前登录用户（Bearer token）
app.get('/api/auth/me', (req, res) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const session = readSession(token)
  if (!session) return res.status(401).json({ error: '未登录或登录已过期' })
  const user = findUserById(session.uid)
  if (!user) return res.status(401).json({ error: '用户不存在' })
  res.json({ user: safeUser(user) })
})

// 退出登录（token 为无状态签名，服务端无需处理；此接口仅作语义占位）
app.post('/api/auth/logout', (req, res) => {
  res.json({ ok: true })
})

// ===== 第三方登录（预留式：凭据填进 .env 即自动启用） =====

// 各渠道可用状态：前端据此决定按钮可点 / 灰显
app.get('/api/auth/providers', (req, res) => {
  res.json(getProvidersStatus())
})

// 发起授权：签名 state 后 302 跳转到服务商
app.get('/api/auth/:provider/start', (req, res) => {
  const provider = getProvider(req.params.provider)
  if (!provider) return res.status(404).send('未知的登录渠道')
  const { configured, missing } = checkProvider(provider)
  if (!configured) {
    return res.status(400).send(`「${provider.name}」登录尚未配置，缺少环境变量：${missing.join(', ')}`)
  }
  const redirectUri = buildRedirectUri(req, provider.id)
  const state = createState(provider.id)
  res.redirect(provider.authorizeUrl({ redirectUri, state }))
})

// 授权回调：校验 state → code 换 token → 拉用户 → 落库 → 签发会话 → 跳回站点
app.get('/api/auth/:provider/callback', async (req, res) => {
  const provider = getProvider(req.params.provider)
  if (!provider) return res.status(404).send('未知的登录渠道')

  const { code, state, error, error_description: errorDesc } = req.query
  if (error) return authFail(req, res, `${provider.name}授权被拒绝：${errorDesc || error}`)
  if (!code) return authFail(req, res, '缺少授权码 code')
  if (!readState(state, provider.id)) return authFail(req, res, 'state 校验失败，请重新登录')

  try {
    const redirectUri = buildRedirectUri(req, provider.id)
    const token = await provider.exchange({ code, redirectUri })
    const profile = await provider.user(token)
    const openId = profile.openId || token.openId
    if (!openId) throw new Error('未能获取用户唯一标识 openId')

    const user = upsertOAuthUser({
      provider: provider.id,
      openId,
      unionId: profile.unionId || token.unionId || '',
      name: profile.name,
      avatar: profile.avatar,
      email: profile.email
    })
    const session = createSession(user)

    console.log(`[auth] ${provider.name}登录成功: ${user.username}`)
    const site = (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
    // 通过查询参数回传 token，前端读取后会立即从地址栏清除
    res.redirect(`${site}/?auth_token=${session}&auth_provider=${provider.id}`)
  } catch (e) {
    console.error(`[auth] ${provider.id} 回调失败:`, e.message)
    authFail(req, res, `${provider.name}登录失败：${e.message}`)
  }
})

/** 登录失败统一回跳站点并带上错误信息 */
function authFail(req, res, message) {
  const site = (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
  res.redirect(`${site}/?auth_error=${encodeURIComponent(message)}`)
}

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
