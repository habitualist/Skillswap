// pages/Feed/index.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const Feed = ({ showToast }) => {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [level, setLevel]     = useState('All');
  const [format, setFormat]   = useState('All');

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
          <div className="hero-glow" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">✦ Free. No money. Just skills.</div>
          <h1 className="hero-title">
            Learn anything.<br />
            <span className="hero-accent">Teach what you love.</span>
          </h1>
          <p className="hero-subtitle">
            A peer-to-peer platform where people exchange skills instead of money.
            No fees, no gatekeeping — just human connection and meaningful growth.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-hero-primary">Get Started →</Link>
           <button 
  className="btn-hero-secondary" 
  onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
>
  Browse Offers
</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">{offers.length}+</span>
              <span className="stat-lbl">Active Offers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-num">3+</span>
              <span className="stat-lbl">Skill Traders</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-num">100%</span>
              <span className="stat-lbl">Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="container">
          <div className="section-label">How it works</div>
          <h2 className="section-title-lg">Three steps to your next skill</h2>
          <div className="steps-grid">
            {[
              { num: '01', icon: '📝', title: 'Post Your Offer', desc: 'Share what you can teach and what you want to learn in return. Takes 2 minutes.' },
              { num: '02', icon: '🔍', title: 'Find Your Match', desc: 'Browse offers or search by skill. Send a swap request with a personal message.' },
              { num: '03', icon: '🤝', title: 'Start Learning', desc: 'Connect with your match and start exchanging knowledge. No money involved.' },
            ].map(step => (
              <div key={step.num} className="step-card">
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
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
          <div className="offers-section-header">
            <div>
              <div className="section-label">Skill Exchange Feed</div>
              <h2 className="section-title-lg">Latest Offers</h2>
            </div>
            <Link to="/offers/new" className="btn btn-primary">+ Post Offer</Link>
          </div>

          {/* Filters */}
          <div className="feed-filters">
            <div className="filter-group">
              <span className="filter-label">Level</span>
              <div className="filter-pills">
                {LEVELS.map(l => (
                  <button key={l} className={`filter-pill ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Format</span>
              <div className="filter-pills">
                {FORMATS.map(f => (
                  <button key={f} className={`filter-pill ${format === f ? 'active' : ''}`} onClick={() => setFormat(f)}>{f}</button>
                ))}
              </div>
            </div>
          </div>

          {!loading && !error && (
            <div className="feed-stats-bar">
              <span>{offers.length} offer{offers.length !== 1 ? 's' : ''} available</span>
            </div>
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

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-label">Community</div>
          <h2 className="section-title-lg">Trusted by skill sharers</h2>
          <div className="testimonials-grid">
            {[
              { name: 'Alex J.', text: 'I traded React lessons for Spanish classes. Best decision ever — I found someone the same day!' },
              { name: 'Maria S.', text: 'As a designer I wanted to learn Node.js. Found a perfect match in minutes. No money, just knowledge.' },
              { name: 'David C.', text: 'SkillSwap feels more human than any course platform. You are learning from a real person, not a video.' },
            ].map(t => (
              <div key={t.name} className="testimonial-card">
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="avatar avatar-sm testimonial-avatar">
                    {t.name[0]}
                  </div>
                  <span className="testimonial-name">{t.name}</span>
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
            <div className="cta-glow" />
            <h2 className="cta-title">Ready to start trading skills?</h2>
            <p className="cta-subtitle">Join hundreds of people exchanging knowledge every day. Free forever.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn-hero-primary">Get Started Free →</Link>
              <Link to="/" className="btn-hero-secondary">Browse Offers</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default Feed;