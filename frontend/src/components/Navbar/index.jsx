// components/Navbar/index.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation }  from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import './styles.css';

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const Navbar = ({ showToast }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="#00e87a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">SkillSwap</span>
        </Link>

      {/* Center nav links */}
      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/search?q="
          className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
        >
          Search
        </Link>
        <Link
          to="/register"
          className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
        >
          Sign Up
        </Link>
      </div>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
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
              <Link to="/offers/new" className="btn-nav-cta">
                <span>+</span> Post Offer
              </Link>
              <div className="navbar-user" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="avatar avatar-sm">{getInitials(user.name)}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{color:'var(--text-muted)'}}>
                  <path d="M5 7L1 3h8z"/>
                </svg>
                {menuOpen && (
                  <div className="navbar-dropdown">
                    <div className="dropdown-user-info">
                      <div className="avatar avatar-sm">{getInitials(user.name)}</div>
                      <div>
                        <div className="dropdown-name">{user.name}</div>
                        <div className="dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to={`/users/${user.id}`} className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/offers/new" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      Post an Offer
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/register" className="btn-nav-cta">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;