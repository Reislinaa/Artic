import { useState, useEffect } from 'react'
import { siWechat, siQq } from 'simple-icons'
import { useAuth } from '../context/AuthContext'
import { FALLBACK_PROVIDERS } from '../data/auth-providers'

// 微信 / QQ：simple-icons 官方矢量路径，按品牌色着色
const ICON_MAP = {
  wechat: siWechat,
  qq: siQq
}

// 飞书 / 钉钉：simple-icons v16 已下架，改用 App Store 官方图标
// （开发者分别为 DingTalk Technology / Beijing Feishu Technology），
// 已转存到 public/brand/ 自托管，避免外链依赖。
const IMG_MAP = {
  feishu: 'brand/feishu.png',
  dingtalk: 'brand/dingtalk.png'
}

const BASE = import.meta.env.BASE_URL || '/'

function ProviderButton({ p, onSelect }) {
  const icon = ICON_MAP[p.id]
  const img = IMG_MAP[p.id]
  return (
    <button
      type="button"
      className={`auth-provider ${p.configured ? '' : 'is-off'}`}
      disabled={!p.configured}
      title={p.configured ? `使用${p.name}登录` : `${p.name}：${p.tip || '即将支持'}`}
      onClick={() => p.configured && onSelect(p.id)}
    >
      {img ? (
        <img className="auth-provider-img" src={`${BASE}${img}`} alt="" />
      ) : icon ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={icon.path} fill={p.color} />
        </svg>
      ) : (
        <span className="auth-provider-initial" style={{ color: p.color }}>
          {p.name.charAt(0)}
        </span>
      )}
      <span className="auth-provider-name">{p.name}</span>
    </button>
  )
}

export default function AuthModal({ open, onClose }) {
  const { login, oauthError, clearOauthError } = useAuth()
  const [tab, setTab] = useState('login') // login | register
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  // 先用兜底列表渲染预留入口，再用后端真实配置状态覆盖
  const [providers, setProviders] = useState(FALLBACK_PROVIDERS)

  // 读取各第三方渠道的可用状态：已配置 → 按钮可点；未配置 → 灰显（预留位）
  // 静态部署（无后端）时保持兜底列表，保证预留窗口依然可见
  useEffect(() => {
    if (!open) return
    let cancelled = false
    fetch('/api/auth/providers')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no backend'))))
      .then((d) => {
        if (!cancelled && Array.isArray(d.providers) && d.providers.length) setProviders(d.providers)
      })
      .catch(() => { /* 保留兜底列表 */ })
    return () => {
      cancelled = true
    }
  }, [open])

  // 把第三方登录失败信息带入弹窗
  useEffect(() => {
    if (open && oauthError) setError(oauthError)
  }, [open, oauthError])

  if (!open) return null

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleThirdParty = (providerId) => {
    // 交由后端 302 跳转到服务商授权页（state 由后端签名）
    window.location.href = `/api/auth/${providerId}/start`
  }

  const handleClose = () => {
    clearOauthError()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const url = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = tab === 'login'
        ? { username: form.username, password: form.password }
        : form
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '操作失败')
      if (tab === 'login') {
        login(data.user, data.token)
        setSuccess('登录成功！')
        setTimeout(onClose, 800)
      } else {
        setSuccess('注册成功，请登录！')
        setTab('login')
        setForm({ username: '', email: '', password: '' })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hasThirdParty = providers.length > 0

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={handleClose} aria-label="关闭">×</button>
        <h3 className="auth-title">{tab === 'login' ? '欢迎回来' : '创建账号'}</h3>
        <p className="auth-subtitle">
          {tab === 'login' ? '登录后同步你的词库与偏好' : '加入 ARTIC，让每句话都能直接发出去'}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
            登录
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError('') }}>
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>用户名</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInput}
              placeholder="请输入用户名"
              required
            />
          </div>

          {tab === 'register' && (
            <div className="auth-field">
              <label>邮箱</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInput}
                placeholder="请输入邮箱"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>密码</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInput}
              placeholder={tab === 'register' ? '至少 6 位密码' : '请输入密码'}
              minLength={tab === 'register' ? 6 : undefined}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? '请稍候…' : tab === 'login' ? '登 录' : '注 册'}
          </button>
        </form>

        {hasThirdParty && (
          <>
            <div className="auth-divider"><span>或使用以下方式</span></div>
            <div className="auth-providers">
              {providers.map((p) => (
                <ProviderButton key={p.id} p={p} onSelect={handleThirdParty} />
              ))}
            </div>
            <p className="auth-note">
              灰显渠道为预留入口，接入凭据后自动开启，无需更新页面。
            </p>
          </>
        )}
      </div>
    </div>
  )
}
