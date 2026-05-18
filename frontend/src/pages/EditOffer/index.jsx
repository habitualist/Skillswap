// pages/EditOffer/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/index';
import api from '../../hooks/useApi/index';
import '../CreateOffer/styles.css';

const LEVELS  = ['Beginner', 'Intermediate', 'Expert'];
const FORMATS = ['Video Call', 'Async', 'In-person'];

const EditOffer = ({ showToast }) => {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    offering_skill: '',
    seeking_skill:  '',
    level:          'Beginner',
    format:         'Video Call',
    description:    '',
  });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      const res = await api.get(`/api/offers/${id}`);
      const o   = res.data;

      // Check ownership
      if (user && o.user_id !== user.id) {
        showToast('You can only edit your own offers.', 'error');
        navigate('/');
        return;
      }

      setForm({
        offering_skill: o.offering_skill,
        seeking_skill:  o.seeking_skill,
        level:          o.level,
        format:         o.format,
        description:    o.description || '',
      });
    } catch (err) {
      showToast('Offer not found.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.put(`/api/offers/${id}`, form);
      showToast('Offer updated successfully!', 'success');
      navigate(`/offers/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update offer.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <div className="skeleton" style={{ width: '200px', height: '20px' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="page create-offer-page">
      <div className="container">
        <div className="create-offer-layout">

          <div className="create-offer-header">
            <h1 className="create-offer-title">Edit Offer</h1>
            <p className="create-offer-subtitle">
              Update your skill exchange listing.
            </p>
          </div>

          <div className="card create-offer-card">
            <form onSubmit={handleSubmit} className="create-offer-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="skills-row">
                <div className="form-group">
                  <label className="form-label">I can teach</label>
                  <input
                    type="text"
                    name="offering_skill"
                    className="form-input"
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
                    value={form.seeking_skill}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input create-textarea"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <div className="create-offer-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate(`/offers/${id}`)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOffer;