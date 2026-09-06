import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Logo() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
      <defs>
        <linearGradient id="nl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E85D4E"/>
          <stop offset="100%" stopColor="#F59E0B"/>
        </linearGradient>
        <linearGradient id="nt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E85D4E" stopOpacity="0"/>
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9"/>
        </linearGradient>
      </defs>
      <circle cx="22" cy="9" r="3" fill="url(#nl)"/>
      <path d="M22 9 L7 24" stroke="url(#nt)" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="22" cy="9" r="6" fill="url(#nl)" opacity="0.16"/>
    </svg>
  )
}

export default function Navbar({ onStartDemo, onOpenAuth, currentPage = 'home', onNavigate }) {
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { key: 'home', label: '首页', page: 'home' },
    { key: 'features', label: '功能', page: 'features' },
    { key: 'download', label: '下载', page: 'download' },
    { key: 'pricing', label: '会员', page: 'pricing' },
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
          <Logo />
          <span className="navbar-brand">流星语</span>
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
              <button className="btn btn-ghost navbar-login" onClick={() => { setOpen(false); onOpenAuth() }}>
                登录
              </button>
              <button className="btn btn-primary navbar-cta" onClick={() => { setOpen(false); onStartDemo('download') }}>
                免费下载
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
