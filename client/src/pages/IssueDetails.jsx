import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { IssueMap } from '../components/MapView.jsx';
import { fetchIssue, deleteIssue } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useDocumentTitle(issue?.title ? `${issue.title}` : 'Issue Details');

  useEffect(() => {
    setLoading(true);
    fetchIssue(id)
      .then(setIssue)
      .catch((e) => setError(e.response?.data?.message || 'Issue not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this issue permanently?')) return;
    setDeleting(true);
    try {
      await deleteIssue(id);
      navigate(isAdmin ? '/manage' : '/my-issues');
    } catch (e) {
      alert(e.response?.data?.message || 'Delete operation failed');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <TopNav title="Issue Details" />
        <p style={{ color: 'var(--muted)' }}>Loading ticket information…</p>
      </Layout>
    );
  }

  if (error || !issue) {
    return (
      <Layout>
        <TopNav title="Issue Not Found" />
        <div className="card card-pad" style={{ maxWidth: 500 }}>
          <p style={{ color: 'var(--danger)', margin: '0 0 16px 0' }}>{error || 'Issue record could not be found.'}</p>
          <Link to={isAdmin ? '/manage' : '/dashboard'} className="btn btn-primary">
            &larr; Return to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const timeline = [...(issue.statusHistory || [])].sort(
    (a, b) => new Date(a.at) - new Date(b.at)
  );

  return (
    <Layout>
      <div style={{ marginBottom: 12 }}>
        <Link
          to={isAdmin ? '/manage' : '/my-issues'}
          style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          <span>&larr;</span>
          <span>Back to {isAdmin ? 'Management Queue' : 'My Issues'}</span>
        </Link>
      </div>

      <TopNav title={issue.title} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <StatusBadge status={issue.status} />
        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          Ticket #{issue.issueId || issue._id?.slice(-6)}
        </span>
        {isAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              marginLeft: 'auto',
              padding: '0.4rem 0.85rem',
              borderRadius: 8,
              border: '1px solid var(--danger)',
              background: 'transparent',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              fontWeight: 650,
            }}
          >
            {deleting ? 'Deleting…' : 'Delete Issue'}
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="issue-detail-grid"
      >
        <div className="card card-pad">
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 0 }}>
            Reported by <strong>{issue.createdBy?.name || 'Citizen'}</strong> &bull; {new Date(issue.createdAt).toLocaleString()}
          </p>
          {issue.assignedTo && (
            <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 14, fontSize: '0.88rem' }}>
              Assigned Field Engineer:{' '}
              <strong style={{ color: 'var(--accent)' }}>{issue.assignedTo.name}</strong>
              {issue.assignedTo.email && (
                <a href={`mailto:${issue.assignedTo.email}`} style={{ marginLeft: 8, fontSize: '0.82rem', color: 'var(--muted)' }}>
                  ({issue.assignedTo.email})
                </a>
              )}
            </div>
          )}

          <h2 style={{ fontSize: '0.98rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Description
          </h2>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: '6px 0 18px 0' }}>{issue.description}</p>

          <h2 style={{ fontSize: '0.98rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Photographic Evidence
          </h2>
          {issue.image && (
            <img
              src={issue.image}
              alt={issue.title}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                marginTop: 6,
                marginBottom: 18,
              }}
            />
          )}

          <h2 style={{ fontSize: '0.98rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Location
          </h2>
          {issue.address && (
            <p style={{
              margin: '6px 0 12px 0',
              padding: '0.65rem 0.9rem',
              borderRadius: 10,
              background: 'rgba(14, 165, 164, 0.08)',
              border: '1px solid rgba(14, 165, 164, 0.25)',
              fontSize: '0.92rem',
              lineHeight: 1.5,
            }}>
              📍 {issue.address}
            </p>
          )}

          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <IssueMap
              latitude={issue.location?.latitude}
              longitude={issue.location?.longitude}
              title={issue.title}
            />
          </div>
        </div>

        <div className="card card-pad">
          <h2 style={{ fontSize: '1.05rem', margin: '0 0 14px 0', fontWeight: 800 }}>Resolution Timeline</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {timeline.map((ev, idx) => (
              <li
                key={idx}
                style={{
                  padding: '0.75rem 0',
                  borderLeft: '2px solid rgba(20, 184, 166, 0.4)',
                  paddingLeft: 16,
                  marginLeft: 6,
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', left: -5, top: 16, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                <StatusBadge status={ev.status} />
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 6 }}>
                  {new Date(ev.at).toLocaleString()}
                  {ev.by?.name && ` · ${ev.by.name}`}
                </div>
                {ev.note && <div style={{ marginTop: 6, fontSize: '0.88rem', color: 'var(--text)' }}>{ev.note}</div>}
              </li>
            ))}
          </ul>

          <h2 style={{ fontSize: '1.05rem', margin: '1.75rem 0 12px 0', fontWeight: 800 }}>Internal Comments</h2>
          {(issue.comments || []).length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>No comments logged yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {(issue.comments || []).map((c) => (
                <li
                  key={c._id}
                  style={{
                    padding: '0.75rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.88rem',
                  }}
                >
                  <strong>{c.userId?.name || 'Authorized Staff'}</strong>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}> · {new Date(c.createdAt).toLocaleString()}</span>
                  <div style={{ marginTop: 4, lineHeight: 1.5 }}>{c.text}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .issue-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}
