import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import { LocationPickerMap } from '../components/MapView.jsx';
import { createIssue } from '../api/client.js';

export default function ReportIssue() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState('');
  const [locationMode, setLocationMode] = useState('map'); // 'map' or 'manual'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (locationMode === 'map' && (lat == null || lng == null)) {
      setError('Click the map to set a location.');
      return;
    }
    if (locationMode === 'manual' && !address.trim()) {
      setError('Please enter the address.');
      return;
    }
    if (!file) {
      setError('Please choose an image.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      // When manual mode, send default coords (0, 0) and address text
      fd.append('latitude', String(lat ?? 0));
      fd.append('longitude', String(lng ?? 0));
      fd.append('address', address);
      fd.append('image', file);
      const issue = await createIssue(fd);
      navigate(`/issue/${issue.issueId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <TopNav title="Report an issue" />
      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="card card-pad" style={{ width: '100%' }}>
          {error && (
            <div style={{ color: 'var(--danger)', marginBottom: 12, fontWeight: 750 }} role="alert">
              {error}
            </div>
          )}

          <label className="field">
            <span className="field-label">Title</span>
            <input
              className="form-control"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pothole on Main St"
            />
          </label>

          <label className="field">
            <span className="field-label">Description</span>
            <textarea
              className="form-control"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue…"
              style={{ resize: 'vertical' }}
            />
          </label>

          <label className="field">
            <span className="field-label">Photo</span>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ padding: '0.55rem 0.75rem' }}
            />
          </label>

          {/* ── Location section ── */}
          <div style={{ marginBottom: 6 }}>
            <span className="field-label">Location</span>

            {/* Toggle tabs */}
            <div className="location-toggle">
              <button
                type="button"
                className={`location-toggle-btn${locationMode === 'map' ? ' active' : ''}`}
                onClick={() => setLocationMode('map')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Pick on Map
              </button>
              <button
                type="button"
                className={`location-toggle-btn${locationMode === 'manual' ? ' active' : ''}`}
                onClick={() => setLocationMode('manual')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="9" x2="20" y2="9" />
                  <line x1="4" y1="15" x2="20" y2="15" />
                  <line x1="10" y1="3" x2="8" y2="21" />
                  <line x1="16" y1="3" x2="14" y2="21" />
                </svg>
                Enter Address
              </button>
            </div>

            {/* Map picker */}
            {locationMode === 'map' && (
              <div className="location-panel">
                <LocationPickerMap
                  latitude={lat}
                  longitude={lng}
                  onChange={(la, lo) => {
                    setLat(la);
                    setLng(lo);
                  }}
                />
                {lat != null && lng != null && (
                  <p className="form-help">
                    📍 {lat.toFixed(5)}, {lng.toFixed(5)}
                  </p>
                )}
              </div>
            )}

            {/* Manual address input */}
            {locationMode === 'manual' && (
              <div className="location-panel">
                <textarea
                  className="form-control"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address, e.g. 123 Main Street, City, State, PIN"
                  style={{ resize: 'vertical' }}
                />
                <p className="form-help" style={{ fontSize: '0.82rem', opacity: 0.7 }}>
                  💡 Tip: Include landmark, street, area, city and PIN code for accurate location
                </p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: 12 }}>
            {loading ? 'Submitting…' : 'Submit report'}
          </button>
        </div>
      </form>
    </Layout>
  );
}
