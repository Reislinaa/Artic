/**
 * 第三方登录（OAuth 2.0）—— 预留式实现
 * ------------------------------------------------------------------
 * 设计目标：**凭据填进 .env 即自动启用，无需改代码**。
 *
 *   · 未配置 → 前端按钮显示「即将支持」且不可点
 *   · 配置齐全 → 按钮自动可点，走真实授权流程
 *
 * 已实现对接（端点与字段映射均按各家官方文档书写）：
 *   wechat    微信开放平台「网站应用」扫码登录
 *   qq        QQ 互联
 *   feishu    飞书开放平台（网页应用）
 *   dingtalk  钉钉（新版 OAuth2）
 *
 * 预留未对接（仅占位，UI 会显示为「即将支持」）：
 *   企业微信 / 支付宝 / GitHub / Google / Apple
 *   接入方式：在 PROVIDERS 里按同样的结构补一条即可，前端无需改动。
 *
 * 流程（统一）：
 *   GET /api/auth/:id/start     → 302 跳转到服务商授权页（带签名 state）
 *   GET /api/auth/:id/callback  → 校验 state → code 换 token → 拉用户信息
 *                                 → 落库 upsert → 签发会话 token → 跳回站点
 */
import crypto from 'crypto'

const env = (k) => process.env[k] || ''

// ============================================================
// 签名工具：state 防篡改、会话 token 无状态校验
// ============================================================
const sessionSecret = () => env('SESSION_SECRET') || 'artic-dev-secret-change-me'

const b64url = (buf) => Buffer.from(buf).toString('base64url')

function sign(payload) {
  const data = b64url(JSON.stringify(payload))
  const sig = crypto.createHmac('sha256', sessionSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null
  const [data, sig] = token.split('.')
  const expect = crypto.createHmac('sha256', sessionSecret()).update(data).digest('base64url')
  if (sig.length !== expect.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

/** 签发会话 token（默认 30 天） */
export const createSession = (user) => sign({ uid: user.id, exp: Date.now() + 30 * 864e5 })
/** 校验会话 token，返回 { uid } */
export const readSession = (token) => verify(token)
/** 签发 OAuth state（10 分钟有效，防 CSRF） */
export const createState = (providerId) =>
  sign({ p: providerId, n: crypto.randomBytes(8).toString('hex'), exp: Date.now() + 10 * 60e3 })
/** 校验 OAuth state */
export const readState = (state, providerId) => {
  const s = verify(state)
  if (!s || s.p !== providerId) return null
  return s
}

// ============================================================
// HTTP 小工具
// ============================================================
async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`返回非 JSON: ${text.slice(0, 160)}`)
  }
}

async function getText(url, headers = {}) {
  const res = await fetch(url, { headers })
  return res.text()
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`返回非 JSON: ${text.slice(0, 160)}`)
  }
}

// ============================================================
// Provider 注册表
// 每个 provider：
//   envKeys      必需的环境变量（缺任意一项 → 视为未配置）
//   authorizeUrl 生成授权地址
//   exchange     code → token（返回 { accessToken, openId? }）
//   user         token → 归一化用户信息 { openId, unionId, name, avatar, email }
// ============================================================
export const PROVIDERS = [
  // ---------------- 微信（开放平台 网站应用）----------------
  {
    id: 'wechat',
    name: '微信',
    color: '#07C160',
    tip: '需微信开放平台「网站应用」',
    envKeys: ['WECHAT_OPEN_APPID', 'WECHAT_OPEN_SECRET'],
    authorizeUrl: ({ redirectUri, state }) =>
      'https://open.weixin.qq.com/connect/qrconnect' +
      `?appid=${env('WECHAT_OPEN_APPID')}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      '&response_type=code&scope=snsapi_login' +
      `&state=${state}#wechat_redirect`,
    async exchange({ code }) {
      const d = await getJson(
        'https://api.weixin.qq.com/sns/oauth2/access_token' +
          `?appid=${env('WECHAT_OPEN_APPID')}&secret=${env('WECHAT_OPEN_SECRET')}` +
          `&code=${code}&grant_type=authorization_code`
      )
      if (!d.access_token) throw new Error(d.errmsg || '微信换取 token 失败')
      return { accessToken: d.access_token, openId: d.openid, unionId: d.unionid || '' }
    },
    async user({ accessToken, openId }) {
      const d = await getJson(
        'https://api.weixin.qq.com/sns/userinfo' +
          `?access_token=${accessToken}&openid=${openId}&lang=zh_CN`
      )
      if (d.errcode) throw new Error(d.errmsg || '微信获取用户信息失败')
      return { name: d.nickname || '', avatar: d.headimgurl || '', unionId: d.unionid || '' }
    }
  },

  // ---------------- QQ 互联 ----------------
  {
    id: 'qq',
    name: 'QQ',
    color: '#1EBAFC',
    tip: '需 QQ 互联开发者资质',
    envKeys: ['QQ_APP_ID', 'QQ_APP_KEY'],
    authorizeUrl: ({ redirectUri, state }) =>
      'https://graph.qq.com/oauth2.0/authorize' +
      `?response_type=code&client_id=${env('QQ_APP_ID')}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}&scope=get_user_info`,
    async exchange({ code, redirectUri }) {
      const raw = await getText(
        'https://graph.qq.com/oauth2.0/token' +
          '?grant_type=authorization_code' +
          `&client_id=${env('QQ_APP_ID')}&client_secret=${env('QQ_APP_KEY')}` +
          `&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}&fmt=json`
      )
      // QQ 历史上返回 urlencoded（非 JSON），两种格式都兼容
      let accessToken = ''
      try {
        accessToken = JSON.parse(raw).access_token || ''
      } catch {
        accessToken = new URLSearchParams(raw).get('access_token') || ''
      }
      if (!accessToken) throw new Error('QQ 换取 token 失败: ' + raw.slice(0, 120))

      // openid 需单独获取，返回值是 JSONP：callback( {...} );
      const meRaw = await getText(`https://graph.qq.com/oauth2.0/me?access_token=${accessToken}&fmt=json`)
      let openId = ''
      try {
        openId = JSON.parse(meRaw).openid || ''
      } catch {
        const m = meRaw.match(/"openid"\s*:\s*"([^"]+)"/)
        openId = m ? m[1] : ''
      }
      if (!openId) throw new Error('QQ 获取 openid 失败: ' + meRaw.slice(0, 120))
      return { accessToken, openId }
    },
    async user({ accessToken, openId }) {
      const d = await getJson(
        'https://graph.qq.com/user/get_user_info' +
          `?access_token=${accessToken}&oauth_consumer_key=${env('QQ_APP_ID')}&openid=${openId}`
      )
      if (d.ret !== 0) throw new Error(d.msg || 'QQ 获取用户信息失败')
      return { name: d.nickname || '', avatar: d.figureurl_qq_2 || d.figureurl_2 || '' }
    }
  },

  // ---------------- 飞书 / Lark ----------------
  {
    id: 'feishu',
    name: '飞书',
    color: '#3370FF',
    tip: '需飞书开放平台网页应用',
    envKeys: ['FEISHU_APP_ID', 'FEISHU_APP_SECRET'],
    // FEISHU_DOMAIN=lark 可切换到国际版 Lark
    authorizeUrl: ({ redirectUri, state }) => {
      const host = env('FEISHU_DOMAIN') === 'lark' ? 'https://accounts.larksuite.com' : 'https://accounts.feishu.cn'
      return (
        `${host}/open-apis/authen/v1/authorize` +
        `?client_id=${env('FEISHU_APP_ID')}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code&state=${state}`
      )
    },
    async exchange({ code, redirectUri }) {
      const host = env('FEISHU_DOMAIN') === 'lark' ? 'https://open.larksuite.com' : 'https://open.feishu.cn'
      const d = await postJson(`${host}/open-apis/authen/v2/oauth/token`, {
        grant_type: 'authorization_code',
        client_id: env('FEISHU_APP_ID'),
        client_secret: env('FEISHU_APP_SECRET'),
        code,
        redirect_uri: redirectUri
      })
      if (!d.access_token) throw new Error(d.error_description || d.msg || '飞书换取 token 失败')
      return { accessToken: d.access_token }
    },
    async user({ accessToken }) {
      const host = env('FEISHU_DOMAIN') === 'lark' ? 'https://open.larksuite.com' : 'https://open.feishu.cn'
      const d = await getJson(`${host}/open-apis/authen/v1/user_info`, {
        Authorization: `Bearer ${accessToken}`
      })
      if (d.code !== 0 || !d.data) throw new Error(d.msg || '飞书获取用户信息失败')
      return {
        openId: d.data.open_id,
        unionId: d.data.union_id || '',
        name: d.data.name || '',
        avatar: d.data.avatar_url || '',
        email: d.data.email || ''
      }
    }
  },

  // ---------------- 钉钉（新版 OAuth2）----------------
  {
    id: 'dingtalk',
    name: '钉钉',
    color: '#1677FF',
    tip: '需钉钉开放平台应用',
    envKeys: ['DINGTALK_CLIENT_ID', 'DINGTALK_CLIENT_SECRET'],
    authorizeUrl: ({ redirectUri, state }) =>
      'https://login.dingtalk.com/oauth2/auth' +
      `?redirect_uri=${encodeURIComponent(redirectUri)}` +
      '&response_type=code' +
      `&client_id=${env('DINGTALK_CLIENT_ID')}` +
      `&scope=openid&state=${state}&prompt=consent`,
    async exchange({ code }) {
      const d = await postJson('https://api.dingtalk.com/v1.0/oauth2/userAccessToken', {
        clientId: env('DINGTALK_CLIENT_ID'),
        clientSecret: env('DINGTALK_CLIENT_SECRET'),
        code,
        grantType: 'authorization_code'
      })
      if (!d.accessToken) throw new Error(d.message || '钉钉换取 token 失败')
      return { accessToken: d.accessToken }
    },
    async user({ accessToken }) {
      const d = await getJson('https://api.dingtalk.com/v1.0/contact/users/me', {
        'x-acs-dingtalk-access-token': accessToken
      })
      return {
        openId: d.openId,
        unionId: d.unionId || '',
        name: d.nick || '',
        avatar: d.avatarUrl || '',
        email: d.email || ''
      }
    }
  }
]

/**
 * 预留位：结构性占位，前端会渲染为不可点的「即将支持」按钮。
 * 未来接入时，把对应项从 RESERVED 移到 PROVIDERS 并按上面的结构补全即可。
 */
export const RESERVED_PROVIDERS = [
  { id: 'wecom', name: '企业微信', color: '#2F7DFF' },
  { id: 'alipay', name: '支付宝', color: '#1677FF' },
  { id: 'github', name: 'GitHub', color: '#181717' },
  { id: 'google', name: 'Google', color: '#4285F4' },
  { id: 'apple', name: 'Apple', color: '#000000' }
]

export const getProvider = (id) => PROVIDERS.find((p) => p.id === id) || null

/** 某 provider 是否已配置齐全（缺哪些 env） */
export function checkProvider(provider) {
  const missing = provider.envKeys.filter((k) => !env(k))
  return { configured: missing.length === 0, missing }
}

/** 供前端调用：返回全部 provider 的可用状态 */
export function getProvidersStatus() {
  const implemented = PROVIDERS.map((p) => {
    const { configured, missing } = checkProvider(p)
    return { id: p.id, name: p.name, color: p.color, tip: p.tip, implemented: true, configured, missing }
  })
  const reserved = RESERVED_PROVIDERS.map((p) => ({
    id: p.id, name: p.name, color: p.color, tip: '即将支持', implemented: false, configured: false, missing: []
  }))
  return { providers: [...implemented, ...reserved] }
}

/** 计算回调地址：优先 SITE_URL，否则按请求头推导 */
export function buildRedirectUri(req, providerId) {
  const base = (env('SITE_URL') || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
  return `${base}/api/auth/${providerId}/callback`
}
