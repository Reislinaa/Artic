/**
 * ARTIC 支付链路
 * ------------------------------------------------------------------
 * 设计目标：**填入证件号即可上线，无需改代码**。
 *
 *   · 未配置商户参数时 → 演示模式（demo）：本地模拟下单与支付成功，用于展示与联调。
 *   · 配置齐全时       → 正式模式（live）：走微信支付 APIv3 / 支付宝当面付真实下单，
 *                        并接收官方异步回调，验签通过后把订单置为已支付。
 *
 * 模式判定与缺失参数清单通过 GET /api/pay/status 暴露给前端，页面会自动显示当前模式。
 *
 * 依赖（均为 GitHub 高星 / 官方实现）：
 *   · wechatpay-node-v3  微信支付 APIv3（Native 扫码）
 *   · alipay-sdk         支付宝官方 Node SDK（当面付 precreate）
 */
import fs from 'fs'
import crypto from 'crypto'

// ============================================================
// 价格表（服务端为准，防止前端篡改金额）
// ============================================================
export const PLANS = {
  'pro-monthly': { amount: 29.9, months: 1, subject: 'ARTIC 专业版 · 月付' },
  'pro-yearly': { amount: 299, months: 12, subject: 'ARTIC 专业版 · 年付' }
}

// ============================================================
// 配置读取
// ============================================================
function safeRead(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch (e) {
    return ''
  }
}

export function getConfig() {
  return {
    siteUrl: process.env.SITE_URL || '',
    wechat: {
      appid: process.env.WECHAT_APPID || '',
      mchid: process.env.WECHAT_MCHID || '',
      apiV3Key: process.env.WECHAT_APIV3_KEY || '',
      serialNo: process.env.WECHAT_SERIAL_NO || '',
      privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH || '',
      publicKeyPath: process.env.WECHAT_PUBLIC_KEY_PATH || '',
      platformCertPath: process.env.WECHAT_PLATFORM_CERT_PATH || '',
      notifyUrl: process.env.WECHAT_NOTIFY_URL || ''
    },
    alipay: {
      appId: process.env.ALIPAY_APP_ID || '',
      privateKeyPath: process.env.ALIPAY_PRIVATE_KEY_PATH || '',
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
      notifyUrl: process.env.ALIPAY_NOTIFY_URL || ''
    }
  }
}

/** 某个渠道是否已具备正式收款条件 */
function checkChannel(kind) {
  const c = getConfig()
  const missing = []

  if (kind === 'wechat') {
    const w = c.wechat
    if (!w.mchid) missing.push('WECHAT_MCHID')
    if (!w.appid) missing.push('WECHAT_APPID')
    if (!w.apiV3Key) missing.push('WECHAT_APIV3_KEY')
    if (!w.serialNo) missing.push('WECHAT_SERIAL_NO')
    if (!w.privateKeyPath || !safeRead(w.privateKeyPath)) missing.push('WECHAT_PRIVATE_KEY_PATH')
    if (!w.publicKeyPath || !safeRead(w.publicKeyPath)) missing.push('WECHAT_PUBLIC_KEY_PATH')
    if (!w.notifyUrl) missing.push('WECHAT_NOTIFY_URL')
  } else {
    const a = c.alipay
    if (!a.appId) missing.push('ALIPAY_APP_ID')
    if (!a.privateKeyPath || !safeRead(a.privateKeyPath)) missing.push('ALIPAY_PRIVATE_KEY_PATH')
    if (!a.alipayPublicKey) missing.push('ALIPAY_PUBLIC_KEY')
    if (!a.notifyUrl) missing.push('ALIPAY_NOTIFY_URL')
  }

  return { configured: missing.length === 0, missing }
}

/** 供前端读取：当前处于演示还是正式模式，以及每个渠道还缺什么 */
export function getPayStatus() {
  const channels = {
    wechat: checkChannel('wechat'),
    alipay: checkChannel('alipay')
  }
  const anyLive = channels.wechat.configured || channels.alipay.configured
  return {
    mode: anyLive ? 'live' : 'demo',
    channels,
    // 提示前端：正式模式下哪些渠道可选
    available: {
      wechat: channels.wechat.configured ? 'live' : 'demo',
      alipay: channels.alipay.configured ? 'live' : 'demo'
    }
  }
}

// ============================================================
// 订单存储（演示用内存实现；生产建议落库并加唯一索引）
// ============================================================
const orders = new Map()

export function createOrderRecord({ planKey, method }) {
  const plan = PLANS[planKey]
  if (!plan) return null
  const orderId =
    'ARTIC' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  const order = {
    orderId,
    planKey,
    method,
    amount: plan.amount,
    subject: plan.subject,
    status: 'pending',
    createdAt: Date.now()
  }
  orders.set(orderId, order)
  return order
}

export function getOrder(orderId) {
  return orders.get(orderId) || null
}

export function markPaid(orderId) {
  const o = orders.get(orderId)
  if (o && o.status !== 'paid') {
    o.status = 'paid'
    o.paidAt = Date.now()
    return true
  }
  return false
}

// ============================================================
// 微信支付 APIv3（Native 扫码）
// ============================================================
let wechatClient = null

async function getWechatClient() {
  if (wechatClient) return wechatClient
  const c = getConfig().wechat
  const mod = await import('wechatpay-node-v3')
  const WxPay = mod.default || mod
  wechatClient = new WxPay({
    appid: c.appid,
    mchid: c.mchid,
    key: c.apiV3Key, // APIv3 密钥
    publicKey: Buffer.from(safeRead(c.publicKeyPath)), // 商户证书 apiclient_cert.pem
    privateKey: Buffer.from(safeRead(c.privateKeyPath)) // 商户私钥 apiclient_key.pem
  })
  return wechatClient
}

/** 微信 Native 下单，返回可生成二维码的 code_url */
export async function wechatNativePay(order) {
  const pay = await getWechatClient()
  const res = await pay.transactions_native({
    description: order.subject,
    out_trade_no: order.orderId,
    notify_url: getConfig().wechat.notifyUrl,
    amount: { total: Math.round(order.amount * 100), currency: 'CNY' }
  })
  const codeUrl = res?.code_url || res?.data?.code_url
  if (!codeUrl) throw new Error('微信下单未返回 code_url：' + JSON.stringify(res))
  return codeUrl
}

/** 解密微信回调 resource（AES-256-GCM） */
function decryptWechatResource(resource, apiV3Key) {
  const { ciphertext, nonce, associated_data: aad } = resource
  const buf = Buffer.from(ciphertext, 'base64')
  const authTag = buf.subarray(buf.length - 16)
  const data = buf.subarray(0, buf.length - 16)
  const decipher = crypto.createDecipheriv('aes-256-gcm', apiV3Key, nonce)
  decipher.setAuthTag(authTag)
  decipher.setAAD(Buffer.from(aad || ''))
  const plain = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
  return JSON.parse(plain)
}

/**
 * 校验微信回调签名（使用微信支付平台证书公钥）。
 * 生产环境请配置 WECHAT_PLATFORM_CERT_PATH，否则仅解密不验签（存在伪造回调风险）。
 */
function verifyWechatSignature(headers, rawBody) {
  const certPath = getConfig().wechat.platformCertPath
  const cert = safeRead(certPath)
  if (!cert) return { ok: true, verified: false } // 未配置平台证书：放行但标记未验签

  const timestamp = headers['wechatpay-timestamp']
  const nonce = headers['wechatpay-nonce']
  const signature = headers['wechatpay-signature']
  if (!timestamp || !nonce || !signature) return { ok: false, verified: false }

  const message = `${timestamp}\n${nonce}\n${rawBody}\n`
  const verify = crypto.createVerify('RSA-SHA256')
  verify.update(message)
  const ok = verify.verify(cert, signature, 'base64')
  return { ok, verified: true }
}

/** 处理微信支付结果通知 */
export function handleWechatNotify(headers, rawBody) {
  const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody
  const sig = verifyWechatSignature(headers, typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
  if (!sig.ok) return { ok: false, reason: '签名校验失败' }

  const resource = body?.resource
  if (!resource) return { ok: false, reason: '缺少 resource' }

  const data = decryptWechatResource(resource, getConfig().wechat.apiV3Key)
  if (data.trade_state === 'SUCCESS') {
    markPaid(data.out_trade_no)
  }
  return { ok: true, orderId: data.out_trade_no, state: data.trade_state, verified: sig.verified }
}

// ============================================================
// 支付宝当面付（扫码）
// ============================================================
let alipayClient = null

async function getAlipayClient() {
  if (alipayClient) return alipayClient
  const c = getConfig().alipay
  const mod = await import('alipay-sdk')
  const AlipaySdk = mod.default || mod
  alipayClient = new AlipaySdk({
    appId: c.appId,
    privateKey: safeRead(c.privateKeyPath),
    alipayPublicKey: c.alipayPublicKey,
    gateway: 'https://openapi.alipay.com/gateway.do'
  })
  return alipayClient
}

/** 支付宝当面付预下单，返回二维码内容 qr_code */
export async function alipayPrecreate(order) {
  const sdk = await getAlipayClient()
  const res = await sdk.exec('alipay.trade.precreate', {
    notifyUrl: getConfig().alipay.notifyUrl,
    bizContent: {
      out_trade_no: order.orderId,
      total_amount: order.amount.toFixed(2),
      subject: order.subject
    }
  })
  if (!res?.qrCode) throw new Error('支付宝预下单未返回 qrCode：' + JSON.stringify(res))
  return res.qrCode
}

/** 处理支付宝异步通知（验签 + 处理交易状态） */
export async function handleAlipayNotify(params) {
  const sdk = await getAlipayClient()
  const signOk = sdk.checkNotifySign(params)
  if (!signOk) return { ok: false, reason: '验签失败' }

  if (params.trade_status === 'TRADE_SUCCESS' || params.trade_status === 'TRADE_FINISHED') {
    // 金额核对，防止篡改
    const order = getOrder(params.out_trade_no)
    if (order && Number(params.total_amount) !== Number(order.amount)) {
      return { ok: false, reason: '金额不一致' }
    }
    markPaid(params.out_trade_no)
  }
  return { ok: true, orderId: params.out_trade_no, state: params.trade_status }
}

// ============================================================
// 演示模式：8 秒后自动置为已支付，用于预览完整支付流程
// ============================================================
export function scheduleDemoPaid(orderId, delayMs = 8000) {
  setTimeout(() => markPaid(orderId), delayMs)
}

/** 演示模式下的二维码内容 */
export function demoQrContent(method, orderId) {
  return method === 'wechat'
    ? `weixin://wxpay/bizpayurl?pr=${orderId}`
    : `alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fm.alipay.com%2F%3ForderId%3D${orderId}`
}
