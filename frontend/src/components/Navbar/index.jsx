// components/Navbar/index.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import './styles.css';

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const Navbar = ({ showToast }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⟁</span>
          <span className="logo-text">SkillSwap</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <Link
                to="/offers/new"
                className="btn btn-primary btn-sm"
              >
                + Post Offer
              </Link>
              <div
                className="navbar-avatar"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="avatar avatar-sm">
                  {getInitials(user.name)}
                </div>
                {menuOpen && (
                  <div className="navbar-dropdown">
                    <Link
                      to={`/users/${user.id}`}
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      className="dropdown-item dropdown-item-danger"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;