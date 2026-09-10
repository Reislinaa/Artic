const LOGO_SRC = `${import.meta.env.BASE_URL}artic-logo.png`

export default function Footer({ onOpenLegal, onNavigate }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img className="brand-mark" src={LOGO_SRC} alt="ARTIC" width="28" height="28" />
            <span>ARTIC</span>
          </div>
          <p className="footer-tagline">Say what you mean, but better.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>产品</h4>
            <button className="footer-link-btn" onClick={() => onNavigate('features')}>功能</button>
            <button className="footer-link-btn" onClick={() => onNavigate('pricing')}>定价</button>
            <button className="footer-link-btn" onClick={() => onNavigate('download')}>下载</button>
            <button className="footer-link-btn" onClick={() => onNavigate('about')}>关于我们</button>
          </div>
          <div className="footer-col">
            <h4>支持</h4>
            <button className="footer-link-btn" onClick={() => onOpenLegal('privacy')}>隐私政策</button>
            <button className="footer-link-btn" onClick={() => onOpenLegal('terms')}>服务条款</button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 ARTIC. 保留所有权利.</span>
      </div>
    </footer>
  )
}
