import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

// 品牌标识：用户提供的官方 logo（已去底处理为透明 PNG，见 public/artic-logo.png）
// 用 BASE_URL 拼接，保证在子路径部署（如 /Artic/）下也能正确加载
const LOGO_SRC = `${import.meta.env.BASE_URL}artic-logo.png`

export default function Navbar({ onStartDemo, onOpenAuth, currentPage = 'home', onNavigate }) {
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { key: 'home', label: '首页', page: 'home' },
    { key: 'features', label: '功能', page: 'features' },
    { key: 'pricing', label: '定价', page: 'pricing' },
    { key: 'download', label: '下载', page: 'download' },
    { key: 'about', label: '关于', page: 'about' }
  ]

  const handleNav = (page) => {
    setOpen(false)
    if (onNavigate) {
      onNavigate(page)
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenu(false)
    setOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#" className="navbar-logo" onClick={(e) => { e.preventDefault(); handleNav('home') }}>
          <img className="brand-mark" src={LOGO_SRC} alt="ARTIC" width="30" height="30" />
          <span className="navbar-brand">ARTIC</span>
        </a>

        <nav className={`navbar-links ${open ? 'open' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.key}
              className={`navbar-link ${currentPage === item.page ? 'active' : ''}`}
              onClick={() => handleNav(item.page)}
            >
              {item.label}
            </button>
          ))}

          {user ? (
            <div className="navbar-user" onClick={() => setUserMenu(!userMenu)}>
              <span className="navbar-avatar">{user.username?.charAt(0).toUpperCase()}</span>
              <span className="navbar-username">{user.username}</span>
              {userMenu && (
                <div className="navbar-user-menu">
                  <span className="navbar-user-email">@{user.username}</span>
                  <button onClick={handleLogout}>退出登录</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-on-ink navbar-login" onClick={() => { setOpen(false); onOpenAuth() }}>
                登录
              </button>
              <button className="btn btn-primary navbar-cta" onClick={() => { setOpen(false); onStartDemo('pricing') }}>
                开始使用
              </button>
            </>
          )}
        </nav>

        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  )
}
