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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (lat == null || lng == null) {
      setError('Click the map to set a location.');
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
      fd.append('latitude', String(lat));
      fd.append('longitude', String(lng));
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

          <div style={{ marginBottom: 6 }}>
            <span className="field-label">Location — click on the map</span>
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
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </p>
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
