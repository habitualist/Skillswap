// components/OfferCard/index.jsx
import { Link } from 'react-router-dom';
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

const OfferCard = ({ offer }) => {
  const {
    id, offering_skill, seeking_skill, level, format,
    description, photo_url, is_matched, author_name, swap_request_count,
  } = offer;

  return (
    <Link to={`/offers/${id}`} className="offer-card">
      {is_matched && (
        <div className="offer-matched-tag">✓ Matched</div>
      )}

      <div className="offer-card-top">
        <div className="offer-author">
          {photo_url ? (
            <img src={photo_url} alt={author_name} className="avatar avatar-md offer-photo" />
          ) : (
            <div className="avatar avatar-md">{getInitials(author_name)}</div>
          )}
          <div className="offer-author-info">
            <span className="offer-author-name">{author_name}</span>
            <div className="offer-badges">
              <span className={`badge ${levelClass[level] || 'badge-beginner'}`}>{level}</span>
              <span className="badge badge-format">{formatIcon[format]} {format}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="offer-skills">
        <div className="offer-skill offer-skill-left">
          <span className="offer-skill-label">Teaches</span>
          <span className="offer-skill-name offer-skill-accent">{offering_skill}</span>
        </div>
        <div className="offer-skill-divider">
          <div className="offer-skill-arrow">⇄</div>
        </div>
        <div className="offer-skill offer-skill-right">
          <span className="offer-skill-label">Wants</span>
          <span className="offer-skill-name">{seeking_skill}</span>
        </div>
      </div>

      {description && (
        <p className="offer-description">{description}</p>
      )}

      <div className="offer-card-footer">
        <div className="offer-requests">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {swap_request_count} {swap_request_count == 1 ? 'request' : 'requests'}
        </div>
        <span className="offer-cta">View offer →</span>
      </div>
    </Link>
  );
};

export default OfferCard;