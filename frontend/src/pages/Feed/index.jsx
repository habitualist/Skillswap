// pages/Feed/index.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi/index';
import OfferCard from '../../components/OfferCard/index';
import Footer from '../../components/Footer/index';
import './styles.css';

const LEVELS  = ['All', 'Beginner', 'Intermediate', 'Expert'];
const FORMATS = ['All', 'Video Call', 'Async', 'In-person'];

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton avatar-skeleton" />
      <div className="skeleton-lines">
        <div className="skeleton line-short" />
        <div className="skeleton line-shorter" />
      </div>
    </div>
    <div className="skeleton skills-skeleton" />
    <div className="skeleton line-long" />
    <div className="skeleton line-medium" />
  </div>
);

// Floating skill exchange card component
const FloatingCard = ({ name, teaches, wants, delay, position }) => (
  <div className="floating-card" style={{ animationDelay: delay, ...position }}>
    <div className="fc-avatar">{name[0]}</div>
    <div className="fc-content">
      <div className="fc-name">{name}</div>
      <div className="fc-skills">
        <span className="fc-teaches">{teaches}</span>
        <span className="fc-arrow">⇄</span>
        <span className="fc-wants">{wants}</span>
      </div>
    </div>
  </div>
);

const Feed = ({ showToast }) => {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [level, setLevel]     = useState('All');
  const [format, setFormat]   = useState('All');
  const navigate = useNavigate();

  useEffect(() => { fetchOffers(); }, [level, format]);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (level !== 'All')  params.level  = level;
      if (format !== 'All') params.format = format;
      const res = await api.get('/api/offers', { params });
      setOffers(res.data);
    } catch (err) {
      setError('Failed to load offers.');
      showToast('Failed to load offers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feed-page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>

        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Free forever. No fees. Just skills.
            </div>

            <h1 className="hero-title">
              Learn anything.<br />
              <span className="hero-title-accent">Teach what you love.</span>
            </h1>

            <p className="hero-subtitle">
              A peer-to-peer platform where people exchange skills
              instead of money. No fees, no gatekeeping — just human
              connection and meaningful growth.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn-hero-primary">
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <button
                className="btn-hero-secondary"
                onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Offers
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">{offers.length}+</span>
                <span className="hero-stat-label">Active Offers</span>
              </div>
              <div className="hero-stat-sep" />
              <div className="hero-stat">
                <span className="hero-stat-num">3+</span>
                <span className="hero-stat-label">Skill Traders</span>
              </div>
              <div className="hero-stat-sep" />
              <div className="hero-stat">
                <span className="hero-stat-num">100%</span>
                <span className="hero-stat-label">Free Forever</span>
              </div>
            </div>
          </div>

          {/* Floating cards visual */}
          <div className="hero-visual">
            <div className="hero-visual-bg" />
            <FloatingCard
              name="Alex J."
              teaches="React"
              wants="Figma"
              delay="0s"
              position={{ top: '10%', left: '5%' }}
            />
            <FloatingCard
              name="Maria S."
              teaches="Spanish"
              wants="Python"
              delay="0.5s"
              position={{ top: '35%', right: '2%' }}
            />
            <FloatingCard
              name="David C."
              teaches="Guitar"
              wants="Photography"
              delay="1s"
              position={{ bottom: '20%', left: '10%' }}
            />
            <FloatingCard
              name="Jane D."
              teaches="UI Design"
              wants="Node.js"
              delay="1.5s"
              position={{ bottom: '5%', right: '8%' }}
            />
            <div className="hero-visual-center">
              <div className="hero-visual-logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="#00e87a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>SkillSwap</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="container">
          <div className="section-label">How it works</div>
          <h2 className="section-heading">Three steps to your next skill</h2>
          <div className="steps-grid">
            {[
              { num:'01', emoji:'📝', title:'Post Your Offer', desc:'Share what you can teach and what you want to learn in return. Takes 2 minutes to set up.' },
              { num:'02', emoji:'🔍', title:'Find Your Match', desc:'Browse skill offers or search by keyword. Send a swap request with a personal message.' },
              { num:'03', emoji:'🤝', title:'Start Learning', desc:'The offer owner reviews requests and marks a match. Both people start exchanging knowledge.' },
            ].map(step => (
              <div key={step.num} className="step-card">
                <div className="step-num">{step.num}</div>
                <div className="step-emoji">{step.emoji}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERS FEED ── */}
      <section className="offers-section" id="offers">
        <div className="container">
          <div className="offers-header">
            <div>
              <div className="section-label">Live Feed</div>
              <h2 className="section-heading">Latest Skill Offers</h2>
            </div>
            <Link to="/offers/new" className="btn btn-primary">
              + Post Your Offer
            </Link>
          </div>

          {/* Filters */}
          <div className="feed-filters">
            <div className="filter-group">
              <span className="filter-label">Level</span>
              <div className="filter-pills">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    className={`filter-pill ${level === l ? 'active' : ''}`}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Format</span>
              <div className="filter-pills">
                {FORMATS.map(f => (
                  <button
                    key={f}
                    className={`filter-pill ${format === f ? 'active' : ''}`}
                    onClick={() => setFormat(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!loading && !error && (
            <p className="offers-count">{offers.length} offer{offers.length !== 1 ? 's' : ''} available</p>
          )}

          {loading ? (
            <div className="offers-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="empty-state-icon">⚠</span>
              <h3>{error}</h3>
              <button className="btn btn-primary" onClick={fetchOffers}>Try Again</button>
            </div>
          ) : offers.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🔍</span>
              <h3>No offers found</h3>
              <p>Try adjusting your filters or be the first to post!</p>
            </div>
          ) : (
            <div className="offers-grid">
              {offers.map(offer => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-label">Features</div>
          <h2 className="section-heading">Everything you need to trade skills</h2>
          <div className="bento-grid">
            <div className="bento-card bento-large">
              <div className="bento-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>Sign up with email and password or use Google OAuth. JWT tokens keep your session secure across all devices.</p>
            </div>
            <div className="bento-card">
              <div className="bento-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find exactly what you need with full-text search across skills and descriptions.</p>
            </div>
            <div className="bento-card">
              <div className="bento-icon">📸</div>
              <h3>Profile Photos</h3>
              <p>Upload a photo to your offer. Stored securely on Cloudinary.</p>
            </div>
            <div className="bento-card">
              <div className="bento-icon">⚡</div>
              <h3>Swap Requests</h3>
              <p>Send a personal message with your swap request. Offer owners review and choose their match.</p>
            </div>
            <div className="bento-card bento-accent">
              <div className="bento-icon">🛡️</div>
              <h3>Rate Limited API</h3>
              <p>Protected endpoints with smart rate limiting per user and IP to prevent abuse.</p>
            </div>
            <div className="bento-card">
              <div className="bento-icon">✓</div>
              <h3>Matching System</h3>
              <p>Mark your offer as matched once you find your partner. Blocks further requests automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-label">Community</div>
          <h2 className="section-heading">Trusted by skill sharers</h2>
          <div className="testimonials-grid">
            {[
              { name:'Alex J.', role:'React Developer', text:'I traded React lessons for Spanish classes. Found someone the same day. Best decision ever.' },
              { name:'Maria S.', role:'UI Designer', text:'As a designer I wanted to learn Node.js. Found a perfect match in minutes. No money, just knowledge.' },
              { name:'David C.', role:'Musician', text:'SkillSwap feels more human than any course platform. You learn from a real person, not a video.' },
              { name:'Jane D.', role:'Data Scientist', text:'I taught Python to 3 people and learned Figma in return. This platform actually works.' },
            ].map(t => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="avatar avatar-sm">{t.name[0]}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb" />
            <h2 className="cta-title">Ready to start trading skills?</h2>
            <p className="cta-subtitle">
              Join hundreds of people exchanging knowledge every day.
              Free forever — no credit card required.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn-hero-primary">
                Get Started Free →
              </Link>
              <button
                className="btn-hero-secondary"
                onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Offers
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Feed;