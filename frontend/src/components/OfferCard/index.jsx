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
    id,
    offering_skill,
    seeking_skill,
    level,
    format,
    description,
    photo_url,
    is_matched,
    author_name,
    swap_request_count,
  } = offer;

  return (
    <Link to={`/offers/${id}`} className="offer-card">
      {/* Matched badge */}
      {is_matched && (
        <div className="offer-card-matched-banner">
          <span>✓ Matched</span>
        </div>
      )}

      {/* Header */}
      <div className="offer-card-header">
        <div className="offer-card-avatar">
          {photo_url ? (
            <img
              src={photo_url}
              alt={author_name}
              className="avatar avatar-md"
            />
          ) : (
            <div className="avatar avatar-md">
              {getInitials(author_name)}
            </div>
          )}
        </div>
        <div className="offer-card-author">
          <span className="author-name">{author_name}</span>
          <div className="offer-card-badges">
            <span className={`badge ${levelClass[level] || 'badge-beginner'}`}>
              {level}
            </span>
            <span className="badge badge-format">
              {formatIcon[format]} {format}
            </span>
          </div>
        </div>
      </div>

      {/* Skills exchange */}
      <div className="offer-card-skills">
        <div className="skill-block skill-offering">
          <span className="skill-label">Teaches</span>
          <span className="skill-name">{offering_skill}</span>
        </div>
        <div className="skill-arrow">⇄</div>
        <div className="skill-block skill-seeking">
          <span className="skill-label">Wants</span>
          <span className="skill-name">{seeking_skill}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="offer-card-description">{description}</p>
      )}

      {/* Footer */}
      <div className="offer-card-footer">
        <span className="swap-count">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {swap_request_count} {swap_request_count == 1 ? 'request' : 'requests'}
        </span>
        <span className="card-cta">View offer →</span>
      </div>
    </Link>
  );
};

export default OfferCard;