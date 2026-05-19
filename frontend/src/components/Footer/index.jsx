import { Link } from 'react-router-dom';
import './styles.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
           <Link to="/" className="footer-logo">
              <div style={{
                width: '28px',
                height: '28px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--border-accent)',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="#00e87a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="logo-text">SkillSwap</span>
            </Link>
            <p className="footer-tagline">
              Bringing real learning back to real people.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link">X</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">ig</a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4 className="footer-col-title">Platform</h4>
              <Link to="/" className="footer-link">Browse Offers</Link>
              <Link to="/offers/new" className="footer-link">Post an Offer</Link>
              <Link to="/register" className="footer-link">Sign Up</Link>
              <Link to="/login" className="footer-link">Log In</Link>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Resources</h4>
              <a href="#" className="footer-link">How it Works</a>
              <a href="#" className="footer-link">FAQ</a>
              <a href="#" className="footer-link">Community</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Legal</h4>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Use</a>
              <a href="#" className="footer-link">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">All rights reserved.</span>
          <span className="footer-made">2026 SkillSwap</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;