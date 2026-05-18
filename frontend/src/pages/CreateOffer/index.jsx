// pages/CreateOffer/index.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import api from '../../hooks/useApi/index';
import './styles.css';

const LEVELS  = ['Beginner', 'Intermediate', 'Expert'];
const FORMATS = ['Video Call', 'Async', 'In-person'];

const CreateOffer = ({ showToast }) => {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({
    offering_skill: '',
    seeking_skill:  '',
    level:          'Beginner',
    format:         'Video Call',
    description:    '',
  });
  const [photo, setPhoto]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <span className="empty-state-icon">🔒</span>
            <h3>Sign in required</h3>
            <p>You need to be logged in to post an offer.</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (photo) formData.append('photo', photo);

      const res = await api.post('/api/offers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('Offer posted successfully!', 'success');
      navigate(`/offers/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create offer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page create-offer-page">
      <div className="container">
        <div className="create-offer-layout">

          {/* Header */}
          <div className="create-offer-header">
            <h1 className="create-offer-title">Post a Skill Offer</h1>
            <p className="create-offer-subtitle">
              Share what you can teach and what you want to learn in return.
            </p>
          </div>

          {/* Form */}
          <div className="card create-offer-card">
            <form onSubmit={handleSubmit} className="create-offer-form">
              {error && <div className="auth-error">{error}</div>}

              {/* Photo upload */}
              <div className="photo-upload-group">
                <div
                  className="photo-upload-area"
                  onClick={() => document.getElementById('photo-input').click()}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="photo-preview" />
                  ) : (
                    <div className="photo-placeholder">
                      <span className="photo-icon">📷</span>
                      <span>Add profile photo</span>
                      <span className="photo-hint">Optional — JPG, PNG, WebP</span>
                    </div>
                  )}
                </div>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Skills */}
              <div className="skills-row">
                <div className="form-group">
                  <label className="form-label">I can teach</label>
                  <input
                    type="text"
                    name="offering_skill"
                    className="form-input"
                    placeholder="e.g. React, Python, Guitar..."
                    value={form.offering_skill}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="skills-row-arrow">⇄</div>
                <div className="form-group">
                  <label className="form-label">I want to learn</label>
                  <input
                    type="text"
                    name="seeking_skill"
                    className="form-input"
                    placeholder="e.g. Figma, Spanish, Guitar..."
                    value={form.seeking_skill}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Level & Format */}
              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">My Level</label>
                  <select
                    name="level"
                    className="form-input form-select"
                    value={form.level}
                    onChange={handleChange}
                  >
                    {LEVELS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Format</label>
                  <select
                    name="format"
                    className="form-input form-select"
                    value={form.format}
                    onChange={handleChange}
                  >
                    {FORMATS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input create-textarea"
                  placeholder="Tell people about your experience, availability, and what makes you a great swap partner..."
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              {/* Actions */}
              <div className="create-offer-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;