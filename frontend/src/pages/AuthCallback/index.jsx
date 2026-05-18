// pages/AuthCallback/index.jsx
// This page handles the Google OAuth redirect
// Google sends the user here with a token in the URL

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import api from '../../hooks/useApi/index';

const AuthCallback = ({ showToast }) => {
  const [searchParams] = useSearchParams();
  const { login }      = useAuth();
  const navigate       = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      showToast('Authentication failed.', 'error');
      navigate('/login');
      return;
    }

    // Decode user from token and log them in
    const fetchUser = async () => {
      try {
        // Store token temporarily to make authenticated request
        localStorage.setItem('token', token);

        // Get user profile using the token
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const res = await api.get(`/api/users/${decoded.id}`);

        login(res.data.user, token);
        showToast(`Welcome, ${res.data.user.name}!`, 'success');
        navigate('/');
      } catch (err) {
        showToast('Authentication failed.', 'error');
        navigate('/login');
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--bg-elevated)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
        Completing sign in...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthCallback;