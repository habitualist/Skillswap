// components/Navbar/index.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import './styles.css';

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const Navbar = ({ showToast }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
        <Link to="/" className="navbar-logo">
          <span className="logo-dot">✦</span>
          <span className="logo-text">SkillSwap</span>
        </Link>

        <div className="navbar-links">
          <Link to="/#offers" className="nav-link" onClick={() => {
  setTimeout(() => {
    document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}}>Browse</Link>
          <Link to="/offers/new" className="nav-link">Post Offer</Link>
          <form onSubmit={handleSearch} className="nav-search-form">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
          </form>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="navbar-user" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="avatar avatar-sm">{getInitials(user.name)}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span className="chevron">▾</span>
                {menuOpen && (
                  <div className="navbar-dropdown">
                    <Link to={`/users/${user.id}`} className="dropdown-item" onClick={() => setMenuOpen(false)}>My Profile</Link>
                    <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>Log Out</button>
                  </div>
                )}
              </div>
              <Link to="/offers/new" className="btn-nav-cta">+ Post Offer</Link>
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