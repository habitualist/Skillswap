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
    <div className="page create-page">
      <div className="container">
        <div className="create-layout">

          {/* Left — Form */}
          <div className="create-form-side">
            <div className="create-header">
              <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
              <h1 className="create-title">Post a Skill Offer</h1>
              <p className="create-subtitle">
                Share what you can teach and what you want to learn in return.
              </p>
            </div>

            <div className="card create-card">
              <form onSubmit={handleSubmit} className="create-form">
                {error && <div className="auth-error">{error}</div>}

                {/* Photo upload */}
                <div className="photo-section">
                  <div
                    className="photo-upload"
                    onClick={() => document.getElementById('photo-input').click()}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="photo-preview-img" />
                    ) : (
                      <div className="photo-placeholder">
                        <span className="photo-upload-icon">📷</span>
                        <span className="photo-upload-text">Add profile photo</span>
                        <span className="photo-upload-hint">JPG, PNG or WebP — optional</span>
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

                {/* Skills exchange */}
                <div className="skills-exchange">
                  <div className="form-group">
                    <label className="form-label">I can teach</label>
                    <input
                      type="text"
                      name="offering_skill"
                      className="form-input skill-input"
                      placeholder="e.g. React, Python, Guitar..."
                      value={form.offering_skill}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="exchange-arrow">
                    <div className="exchange-arrow-icon">⇄</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">I want to learn</label>
                    <input
                      type="text"
                      name="seeking_skill"
                      className="form-input skill-input"
                      placeholder="e.g. Figma, Spanish, Photography..."
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
                    <div className="option-pills">
                      {LEVELS.map(l => (
                        <button
                          key={l}
                          type="button"
                          className={`option-pill ${form.level === l ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, level: l })}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Format</label>
                    <div className="option-pills">
                      {FORMATS.map(f => (
                        <button
                          key={f}
                          type="button"
                          className={`option-pill ${form.format === f ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, format: f })}
                        >
                          {f === 'Video Call' ? '🎥' : f === 'Async' ? '💬' : '🤝'} {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-input create-textarea"
                    placeholder="Tell people about your experience, what you can teach, your availability, and what makes you a great swap partner..."
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>

                {/* Actions */}
                <div className="create-actions">
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
                    {loading ? 'Posting...' : '✓ Post Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right — Preview */}
          <div className="create-preview-side">
            <div className="preview-sticky">
              <p className="preview-label">Live Preview</p>
              <div className="preview-card card">
                <div className="preview-header">
                  <div className="avatar avatar-md">
                    {preview ? (
                      <img src={preview} alt="you" className="avatar avatar-md" style={{objectFit:'cover'}} />
                    ) : (
                      user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                    )}
                  </div>
                  <div>
                    <div className="preview-name">{user.name}</div>
                    <div className="preview-badges">
                      <span className={`badge badge-${form.level.toLowerCase()}`}>{form.level}</span>
                      <span className="badge badge-format">
                        {form.format === 'Video Call' ? '🎥' : form.format === 'Async' ? '💬' : '🤝'} {form.format}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="preview-skills">
                  <div className="preview-skill">
                    <span className="preview-skill-label">Teaches</span>
                    <span className="preview-skill-name preview-accent">
                      {form.offering_skill || 'Your skill'}
                    </span>
                  </div>
                  <div className="preview-arrow">⇄</div>
                  <div className="preview-skill">
                    <span className="preview-skill-label">Wants</span>
                    <span className="preview-skill-name">
                      {form.seeking_skill || 'Desired skill'}
                    </span>
                  </div>
                </div>
                {form.description && (
                  <p className="preview-desc">{form.description}</p>
                )}
                <div className="preview-footer">
                  <span className="preview-requests">0 requests</span>
                </div>
              </div>

              {/* Tips */}
              <div className="create-tips">
                <h4 className="tips-title">💡 Tips for a great offer</h4>
                <ul className="tips-list">
                  <li>Be specific about what you can teach</li>
                  <li>Mention your experience level</li>
                  <li>Say how much time you can commit</li>
                  <li>Add a photo to get more requests</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateOffer;