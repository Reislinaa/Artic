import { useState } from 'react'
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

function Home({ onStartDemo }) {
  return (
    <>
      <PageGlow />
      <Hero onNavigate={onStartDemo} />
      <StepsSection />
      <FeatureShowcase />
      <EverywhereSection />
      <PlatformSection onNavigate={onStartDemo} />
    </>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [authOpen, setAuthOpen] = useState(false)

  const handleNavigate = (target) => {
    setPage(target)
    window.scrollTo({ top: 0 })
  }

  const handleOpenLegal = (type) => setPage(type)

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
      case 'privacy':
      case 'terms':
        return <LegalPage type={page} onBack={() => setPage('home')} />
      default:
        return <Home onStartDemo={handleNavigate} />
    }
  }

  return (
    <AuthProvider>
      <div className="app">
        <Navbar
          onStartDemo={handleNavigate}
          onOpenAuth={() => setAuthOpen(true)}
          currentPage={page}
          onNavigate={handleNavigate}
        />
        <main key={page} className="page-transition">{renderContent()}</main>
        {page !== 'privacy' && page !== 'terms' && (
          <Footer onOpenLegal={handleOpenLegal} onNavigate={handleNavigate} />
        )}
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </AuthProvider>
  )
}

export default App
