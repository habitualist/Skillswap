// pages/SingleOffer/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import api from '../../hooks/useApi/index';
import './styles.css';

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const levelClass = {
  'Beginner':     'badge-beginner',
  'Intermediate': 'badge-intermediate',
  'Expert':       'badge-expert',
};

const formatIcon = {
  'Video Call': '🎥',
  'Async':      '💬',
  'In-person':  '🤝',
};

const SingleOffer = ({ showToast }) => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [offer, setOffer]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [message, setMessage]     = useState('');
  const [sending, setSending]     = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [toggling, setToggling]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      const res = await api.get(`/api/offers/${id}`);
      setOffer(res.data);
    } catch (err) {
      showToast('Offer not found.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSending(true);
    try {
      await api.post(`/api/offers/${id}/request`, { message });
      showToast('Swap request sent!', 'success');
      setMessage('');
      setShowModal(false);
      fetchOffer();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to send request.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/offers/${id}`);
      showToast('Offer deleted.', 'info');
      navigate('/');
    } catch (err) {
      showToast('Failed to delete offer.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleMatch = async () => {
    setToggling(true);
    try {
      const res = await api.patch(`/api/offers/${id}/match`);
      setOffer(prev => ({ ...prev, is_matched: res.data.is_matched }));
      showToast(
        res.data.is_matched ? 'Marked as matched!' : 'Unmarked as matched.',
        'success'
      );
    } catch (err) {
      showToast('Failed to update status.', 'error');
    } finally {
      setToggling(false);
    }
  };

  const isOwner = user && offer && user.id === offer.user_id;

  if (loading) return (
    <div className="page single-offer-page">
      <div className="container">
        <div className="single-offer-skeleton">
          <div className="skeleton" style={{ height: '200px', borderRadius: '18px' }} />
          <div className="skeleton" style={{ height: '120px', borderRadius: '18px' }} />
          <div className="skeleton" style={{ height: '80px', borderRadius: '18px' }} />
        </div>
      </div>
    </div>
  );

  if (!offer) return null;

  return (
    <div className="page single-offer-page">
      <div className="container">

        {/* Back */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="single-offer-layout">

          {/* Main content */}
          <div className="single-offer-main">

            {/* Header card */}
            <div className="card single-offer-header-card">
              <div className="single-offer-header">
                <div className="single-offer-author">
                  <div className="avatar avatar-lg">
                    {offer.photo_url ? (
                      <img src={offer.photo_url} alt={offer.author_name} />
                    ) : (
                      getInitials(offer.author_name)
                    )}
                  </div>
                  <div>
                    <Link
                      to={`/users/${offer.user_id}`}
                      className="single-offer-author-name"
                    >
                      {offer.author_name}
                    </Link>
                    <div className="single-offer-badges">
                      <span className={`badge ${levelClass[offer.level]}`}>
                        {offer.level}
                      </span>
                      <span className="badge badge-format">
                        {formatIcon[offer.format]} {offer.format}
                      </span>
                      {offer.is_matched && (
                        <span className="badge badge-matched">✓ Matched</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Owner actions */}
                {isOwner && (
                  <div className="owner-actions">
                    <Link
                      to={`/offers/${id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/offers/${id}/requests`}
                      className="btn btn-secondary btn-sm"
                    >
                      Requests ({offer.swap_request_count})
                    </Link>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleToggleMatch}
                      disabled={toggling}
                    >
                      {offer.is_matched ? 'Unmatch' : 'Mark Matched'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              {/* Skills exchange */}
              <div className="single-offer-skills">
                <div className="skill-block-lg">
                  <span className="skill-label-lg">Teaches</span>
                  <span className="skill-name-lg accent">{offer.offering_skill}</span>
                </div>
                <div className="skill-exchange-arrow">⇄</div>
                <div className="skill-block-lg">
                  <span className="skill-label-lg">Wants to Learn</span>
                  <span className="skill-name-lg">{offer.seeking_skill}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {offer.description && (
              <div className="card single-offer-desc">
                <h3 className="section-title">About this offer</h3>
                <p>{offer.description}</p>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="single-offer-sidebar">
            <div className="card swap-request-card">
              <div className="swap-count-display">
                <span className="swap-count-number">{offer.swap_request_count}</span>
                <span className="swap-count-label">swap requests</span>
              </div>

              {isOwner ? (
                <Link
                  to={`/offers/${id}/requests`}
                  className="btn btn-primary btn-full"
                >
                  View All Requests
                </Link>
              ) : offer.is_matched ? (
                <button className="btn btn-secondary btn-full" disabled>
                  ✓ Already Matched
                </button>
              ) : user ? (
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => setShowModal(true)}
                >
                  Send Swap Request
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary btn-full">
                  Sign in to Request
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Swap Request Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Send Swap Request</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSwapRequest} className="modal-body">
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  className="form-input modal-textarea"
                  placeholder="Introduce yourself and explain why you'd be a great swap partner..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={5}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleOffer;