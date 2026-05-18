// pages/Feed/index.jsx
import { useState, useEffect } from 'react';
import api from '../../hooks/useApi/index';
import OfferCard from '../../components/OfferCard/index';
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

  useEffect(() => {
    fetchOffers();
  }, [level, format]);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (level  !== 'All') params.level  = level;
      if (format !== 'All') params.format = format;

      const res = await api.get('/api/offers', { params });
      setOffers(res.data);
    } catch (err) {
      setError('Failed to load offers. Please try again.');
      showToast('Failed to load offers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page feed-page">
      <div className="container">

        {/* Hero */}
        <div className="feed-hero">
          <h1 className="feed-title">
            Trade Skills.<br />
            <span className="accent-text">Grow Together.</span>
          </h1>
          <p className="feed-subtitle">
            Connect with people who have what you want to learn —
            and teach what you know in return.
          </p>
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

        {/* Stats bar */}
        {!loading && !error && (
          <div className="feed-stats">
            <span>{offers.length} offer{offers.length !== 1 ? 's' : ''} available</span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="offers-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="error-state">
            <span className="empty-state-icon">⚠</span>
            <h3>{error}</h3>
            <button className="btn btn-primary" onClick={fetchOffers}>
              Try Again
            </button>
          </div>
        ) : offers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h3>No offers found</h3>
            <p>Try adjusting your filters or be the first to post an offer!</p>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Feed;