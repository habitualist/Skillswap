// components/Footer/index.jsx
import { Link } from 'react-router-dom';
import './styles.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-dot">✦</span>
            <span className="logo-text">SkillSwap</span>
          </Link>
          <p className="footer-tagline">
            We're bringing real learning back to real people.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link">𝕏</a>
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
        <<span className="footer-copy">All rights reserved.</span>
        <span className="footer-made">© 2026 SkillSwap — Trade Skills. Grow Together.</span>
      </div>
    </div>
  </footer>
);

export default Footer;