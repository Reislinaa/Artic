import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'artic_token'

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

const writeToken = (t) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* localStorage 不可用时静默降级 */
  }
}

/** 读取一次地址栏里的第三方登录回跳参数（读取后由 effect 清理） */
const readAuthParams = () => {
  try {
    const url = new URL(window.location.href)
    return {
      token: url.searchParams.get('auth_token') || '',
      error: url.searchParams.get('auth_error') || '',
      provider: url.searchParams.get('auth_provider') || ''
    }
  } catch {
    return { token: '', error: '', provider: '' }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  // 第三方登录失败时的提示（来自回调跳转）
  const [oauthError, setOauthError] = useState(() => readAuthParams().error)

  const login = useCallback((userData, token) => {
    if (token) writeToken(token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    writeToken('')
    setUser(null)
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  }, [])

  // 启动时：处理第三方登录回跳的 token，并恢复已有会话
  useEffect(() => {
    const { token: urlToken, error, provider } = readAuthParams()

    if (urlToken) writeToken(urlToken)

    // 立即从地址栏清除敏感参数，避免 token 被复制/留存
    if (urlToken || error || provider) {
      const url = new URL(window.location.href)
      url.searchParams.delete('auth_token')
      url.searchParams.delete('auth_error')
      url.searchParams.delete('auth_provider')
      window.history.replaceState({}, '', url.pathname + url.search + url.hash)
    }

    if (error) setOauthError(error)

    const token = urlToken || readToken()
    if (!token) {
      setReady(true)
      return
    }

    let cancelled = false
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('unauthorized'))))
      .then((d) => {
        if (!cancelled) setUser(d.user)
      })
      .catch(() => {
        writeToken('')
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const clearOauthError = useCallback(() => setOauthError(''), [])

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, oauthError, clearOauthError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
