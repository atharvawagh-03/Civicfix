import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { IssueMap } from '../components/MapView.jsx';
import { fetchIssue, deleteIssue } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchIssue(id)
      .then(setIssue)
      .catch((e) => setError(e.response?.data?.message || 'Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this issue permanently?')) return;
    try {
      await deleteIssue(id);
      navigate('/manage');
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  }

  if (loading) {
    return (
      <Layout>
        <TopNav title="Issue" />
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      </Layout>
    );
  }

  if (error || !issue) {
    return (
      <Layout>
        <TopNav title="Issue" />
        <p style={{ color: 'var(--danger)' }}>{error || 'Not found'}</p>
      </Layout>
    );
  }

  const timeline = [...(issue.statusHistory || [])].sort(
    (a, b) => new Date(a.at) - new Date(b.at)
  );

  return (
    <Layout>
      <TopNav title={issue.title} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <StatusBadge status={issue.status} />
        {isAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            style={{
              marginLeft: 'auto',
              padding: '0.4rem 0.75rem',
              borderRadius: 8,
              border: '1px solid var(--danger)',
              background: 'transparent',
              color: 'var(--danger)',
              fontSize: '0.85rem',
            }}
          >
            Delete issue
          </button>
        )}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 360px)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="issue-detail-grid"
      >
        <div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 0 }}>
            Reported by {issue.createdBy?.name} · {new Date(issue.createdAt).toLocaleString()}
          </p>
          {issue.assignedTo && (
            <p style={{ fontSize: '0.9rem' }}>
              Assigned to: <strong>{issue.assignedTo.name}</strong>
            </p>
          )}
          <h2 style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Description</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{issue.description}</p>
          <h2 style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 600, marginTop: '1.5rem' }}>Photo</h2>
          <img
            src={issue.image}
            alt=""
            style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid var(--surface2)' }}
          />
          <h2 style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 600, marginTop: '1.5rem' }}>Location</h2>
          <IssueMap
            latitude={issue.location.latitude}
            longitude={issue.location.longitude}
            title={issue.title}
          />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Status timeline</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {timeline.map((ev, idx) => (
              <li
                key={idx}
                style={{
                  padding: '0.75rem 0',
                  borderLeft: '2px solid var(--surface2)',
                  paddingLeft: 16,
                  marginLeft: 8,
                }}
              >
                <StatusBadge status={ev.status} />
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 6 }}>
                  {new Date(ev.at).toLocaleString()}
                  {ev.by?.name && ` · ${ev.by.name}`}
                </div>
                {ev.note && <div style={{ marginTop: 6, fontSize: '0.9rem' }}>{ev.note}</div>}
              </li>
            ))}
          </ul>
          <h2 style={{ fontSize: '1rem', marginTop: '1.5rem' }}>Comments</h2>
          {(issue.comments || []).length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No comments yet.</p>
          )}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {(issue.comments || []).map((c) => (
              <li
                key={c._id}
                style={{
                  padding: '0.65rem 0',
                  borderBottom: '1px solid var(--surface2)',
                  fontSize: '0.9rem',
                }}
              >
                <strong>{c.userId?.name || 'User'}</strong>
                <span style={{ color: 'var(--muted)' }}> · {new Date(c.createdAt).toLocaleString()}</span>
                <div style={{ marginTop: 4 }}>{c.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .issue-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}
