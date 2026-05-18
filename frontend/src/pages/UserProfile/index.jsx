// pages/UserProfile/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi/index';
import OfferCard from '../../components/OfferCard/index';
import './styles.css';

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const UserProfile = ({ showToast }) => {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [user, setUser]     = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/users/${id}`);
      setUser(res.data.user);
      setOffers(res.data.offers);
    } catch (err) {
      showToast('User not found.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="page">
      <div className="container">
        <div className="profile-skeleton">
          <div className="skeleton" style={{ width: '96px', height: '96px', borderRadius: '50%' }} />
          <div className="skeleton" style={{ width: '200px', height: '24px' }} />
          <div className="skeleton" style={{ width: '150px', height: '16px' }} />
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="page profile-page">
      <div className="container">

        {/* Profile header */}
        <div className="profile-header">
          <div className="avatar avatar-xl">
            {getInitials(user.name)}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-joined">
              Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-number">{offers.length}</span>
            <span className="stat-label">Offers Posted</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {offers.reduce((acc, o) => acc + parseInt(o.swap_request_count || 0), 0)}
            </span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {offers.filter(o => o.is_matched).length}
            </span>
            <span className="stat-label">Matched</span>
          </div>
        </div>

        {/* Offers */}
        <div className="profile-offers-section">
          <h2 className="profile-section-title">
            Skill Offers
          </h2>
          {offers.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📭</span>
              <h3>No offers yet</h3>
              <p>This user hasn't posted any skill offers.</p>
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
    </div>
  );
};

export default UserProfile;