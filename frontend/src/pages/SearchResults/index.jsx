// pages/SearchResults/index.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../hooks/useApi/index';
import OfferCard from '../../components/OfferCard/index';
import './styles.css';

const SearchResults = ({ showToast }) => {
  const [searchParams]          = useSearchParams();
  const q                       = searchParams.get('q') || '';
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (q) fetchResults();
  }, [q]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/offers/search?q=${encodeURIComponent(q)}`);
      setResults(res.data.results);
    } catch (err) {
      showToast('Search failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page search-page">
      <div className="container">

        <div className="search-header">
          <h1 className="search-title">
            {loading ? 'Searching...' : (
              <>
                {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
                <span className="accent-text">"{q}"</span>
              </>
            )}
          </h1>
          <Link to="/" className="btn btn-ghost btn-sm">
            ← All Offers
          </Link>
        </div>

        {loading ? (
          <div className="offers-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '280px', borderRadius: '18px' }} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h3>No offers found for "{q}"</h3>
            <p>Try a different keyword or browse all offers.</p>
            <Link to="/" className="btn btn-primary">Browse All Offers</Link>
          </div>
        ) : (
          <div className="offers-grid">
            {results.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResults;