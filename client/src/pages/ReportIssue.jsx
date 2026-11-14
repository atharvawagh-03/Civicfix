import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import { LocationPickerMap } from '../components/MapView.jsx';
import { createIssue } from '../api/client.js';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';
import { IconCheck, IconAlertTriangle } from '../components/Icons.jsx';

export default function ReportIssue() {
  useDocumentTitle('Report an Issue');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState('');
  const [locationMode, setLocationMode] = useState('map'); // 'map' or 'manual'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (locationMode === 'map' && (lat == null || lng == null)) {
      setError('Please click on the map to pin the issue location.');
      return;
    }
    if (locationMode === 'manual' && !address.trim()) {
      setError('Please provide the physical street address or landmark.');
      return;
    }
    if (!file) {
      setError('Please attach a clear photo of the issue for municipal inspection.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('latitude', String(lat ?? 0));
      fd.append('longitude', String(lng ?? 0));
      fd.append('address', address);
      fd.append('image', file);
      const issue = await createIssue(fd);
      setSuccess('Issue reported successfully! Dispatching ticket to municipal queue…');
      setTimeout(() => {
        navigate(`/issue/${issue.issueId}`);
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <Layout>
      <TopNav title="Report a city issue" />
      <form onSubmit={handleSubmit} style={{ maxWidth: 680, width: '100%' }}>
        <div className="card card-pad" style={{ width: '100%' }}>
          {error && (
            <div
              style={{
                color: '#fca5a5',
                fontSize: '0.88rem',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
              role="alert"
            >
              <IconAlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                color: '#86efac',
                fontSize: '0.88rem',
                padding: '10px 14px',
                background: 'rgba(34, 197, 94, 0.12)',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
              role="status"
            >
              <IconCheck size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <label className="field">
            <span className="field-label">Issue Title</span>
            <input
              className="form-control"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole causing traffic obstruction"
            />
          </label>

          <label className="field">
            <span className="field-label">Detailed Description</span>
            <textarea
              className="form-control"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the severity, exact landmark, road lane, or potential hazard to vehicles and pedestrians…"
              style={{ resize: 'vertical' }}
            />
          </label>

          <label className="field">
            <span className="field-label">Photo Verification Evidence</span>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ padding: '0.55rem 0.75rem' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4, display: 'block' }}>
              Upload a clear JPEG/PNG image showing the defect and surroundings.
            </span>
          </label>

          {/* ── Location section ── */}
          <div style={{ marginBottom: 14 }}>
            <span className="field-label">Defect Location</span>

            {/* Toggle tabs */}
            <div className="location-toggle" style={{ marginTop: 6 }}>
              <button
                type="button"
                className={`location-toggle-btn${locationMode === 'map' ? ' active' : ''}`}
                onClick={() => setLocationMode('map')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Pick on Map (Nashik)
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
              <div className="location-panel" style={{ marginTop: 8 }}>
                <LocationPickerMap
                  latitude={lat}
                  longitude={lng}
                  onChange={(la, lo) => {
                    setLat(la);
                    setLng(lo);
                  }}
                />
                {lat != null && lng != null ? (
                  <p className="form-help" style={{ color: 'var(--accent)', fontWeight: 650 }}>
                    📍 Pinned Coordinates: {lat.toFixed(5)}, {lng.toFixed(5)}
                  </p>
                ) : (
                  <p className="form-help" style={{ color: 'var(--muted)' }}>
                    💡 Click anywhere on the map to pin the exact street location.
                  </p>
                )}
              </div>
            )}

            {/* Manual address input */}
            {locationMode === 'manual' && (
              <div className="location-panel" style={{ marginTop: 8 }}>
                <textarea
                  className="form-control"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Big Bazaar, College Road, Canada Corner, Nashik, Maharashtra 422005"
                  style={{ resize: 'vertical' }}
                />
                <p className="form-help" style={{ fontSize: '0.82rem', opacity: 0.75 }}>
                  💡 Include street name, nearby landmark, ward or area, and PIN code for fast field crew dispatch.
                </p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: 12 }}>
            {loading ? 'Submitting report…' : 'Submit Report to Municipal Queue'}
          </button>
        </div>
      </form>
    </Layout>
  );
}
