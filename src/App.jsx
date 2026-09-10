import { useState, useEffect } from 'react'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StepsSection from './components/StepsSection'
import FeatureShowcase from './components/FeatureShowcase'
import EverywhereSection from './components/EverywhereSection'
import PlatformSection from './components/PlatformSection'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import LegalPage from './components/LegalPage'
import PageGlow from './components/PageGlow'
import IntroPage from './pages/IntroPage'
import DownloadPage from './pages/DownloadPage'
import AboutPage from './pages/AboutPage'
import PaymentPage from './pages/PaymentPage'
import CheckoutPage from './pages/CheckoutPage'

const PAGE_KEYS = ['home', 'features', 'pricing', 'checkout', 'download', 'about', 'privacy', 'terms']

// 极简 hash 路由：让每个页面都有真实 URL，浏览器前进/后退可用
// 例：#/pricing、#/checkout?plan=pro-yearly
function parseHash(hash) {
  const raw = (hash || '').replace(/^#\/?/, '')
  const [path, query] = raw.split('?')
  const page = PAGE_KEYS.includes(path) ? path : 'home'
  const plan = new URLSearchParams(query || '').get('plan')
  return { page, plan }
}

function buildHash(page, plan) {
  if (page === 'home') return '#/'
  return `#/${page}${plan ? `?plan=${plan}` : ''}`
}

function Home({ onStartDemo }) {
  return (
    <>
      <PageGlow />
      <Hero onNavigate={onStartDemo} />
      {/* 顺序（v15）：先讲「你凭什么不一样」，再讲「怎么开始」。
          上一版把「四步开始」放在首屏之后 —— 下载 / 授权 / 按住说话是任何输入法
          都有的内容，却占了最贵的位置，直接稀释了产品特色（用户反馈：看不出特色）。 */}
      <FeatureShowcase />
      <StepsSection />
      <EverywhereSection />
      <PlatformSection onNavigate={onStartDemo} />
    </>
  )
}

function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  const [authOpen, setAuthOpen] = useState(false)
  const { page, plan } = route

  // 监听 hash 变化（浏览器前进/后退、手改地址）
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleNavigate = (target, opts = {}) => {
    const hash = buildHash(target, opts.plan)
    if (window.location.hash === hash) {
      // 同一地址：直接切换，避免 hashchange 不触发
      setRoute({ page: target, plan: opts.plan || null })
      window.scrollTo({ top: 0 })
    } else {
      window.location.hash = hash
    }
  }

  const renderContent = () => {
    switch (page) {
      case 'features':
        return <IntroPage onNavigate={handleNavigate} />
      case 'download':
        return <DownloadPage />
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />
      case 'pricing':
        return <PaymentPage onNavigate={handleNavigate} />
      case 'checkout':
        return <CheckoutPage planKey={plan} onNavigate={handleNavigate} />
      case 'privacy':
      case 'terms':
        return <LegalPage type={page} onBack={() => handleNavigate('home')} />
      default:
        return <Home onStartDemo={handleNavigate} />
    }
  }

  // 收银台属于「定价 → 支付」流程，导航高亮保持定价；并隐藏页脚以减少干扰
  const navHighlight = page === 'checkout' ? 'pricing' : page
  const hideFooter = page === 'privacy' || page === 'terms' || page === 'checkout'

  return (
    <AuthProvider>
      <div className="app">
        <Navbar
          onStartDemo={handleNavigate}
          onOpenAuth={() => setAuthOpen(true)}
          currentPage={navHighlight}
          onNavigate={handleNavigate}
        />
        <main key={page} className="page-transition">{renderContent()}</main>
        {!hideFooter && (
          <Footer onOpenLegal={handleNavigate} onNavigate={handleNavigate} />
        )}
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </AuthProvider>
  )
}

export default App
