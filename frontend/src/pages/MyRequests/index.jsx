// pages/MyRequests/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import api from '../../hooks/useApi/index';
import './styles.css';

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const MyRequests = ({ showToast }) => {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [offer, setOffer]       = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchRequests();
  }, [id]);

  const fetchRequests = async () => {
    try {
      const [offerRes, reqRes] = await Promise.all([
        api.get(`/api/offers/${id}`),
        api.get(`/api/offers/${id}/requests`)
      ]);
      setOffer(offerRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to load requests.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <div className="skeleton" style={{ width: '200px', height: '20px' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="page requests-page">
      <div className="container">

        <button className="back-btn" onClick={() => navigate(`/offers/${id}`)}>
          ← Back to offer
        </button>

        {/* Header */}
        <div className="requests-header">
          <div>
            <h1 className="requests-title">Swap Requests</h1>
            {offer && (
              <p className="requests-subtitle">
                For your offer:{' '}
                <span className="accent-text">{offer.offering_skill}</span>
                {' '}⇄{' '}
                {offer.seeking_skill}
              </p>
            )}
          </div>
          <div className="requests-count-badge">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'}
          </div>
        </div>

        {/* Requests list */}
        {requests.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📭</span>
            <h3>No requests yet</h3>
            <p>When people send swap requests to this offer they'll appear here.</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map(req => (
              <div key={req.id} className="request-card card">
                <div className="request-card-header">
                  <div className="avatar avatar-md">
                    {getInitials(req.sender_name)}
                  </div>
                  <div className="request-sender-info">
                    <span className="request-sender-name">{req.sender_name}</span>
                    <span className="request-sender-email">{req.sender_email}</span>
                  </div>
                  <span className="request-date">
                    {new Date(req.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="request-message">{req.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;