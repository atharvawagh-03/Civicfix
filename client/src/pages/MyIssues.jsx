import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fetchIssues } from '../api/client.js';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';

export default function MyIssues() {
  useDocumentTitle('My Reported Issues');
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = status ? { status } : {};
    fetchIssues(params)
      .then(setIssues)
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <Layout>
      <TopNav title="My issues" />
      <div className="card card-pad">
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--muted)', fontWeight: 750 }}>Filter by status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: 180 }}
          >
            <option value="">All ({issues.length})</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <Link to="/report" className="btn btn-primary" style={{ marginLeft: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
            + Report new issue
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading your tickets…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {issues.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <p style={{ color: 'var(--muted)', margin: '0 0 12px 0' }}>No issues match this filter.</p>
                <Link to="/report" className="btn btn-primary">
                  Report a new city issue
                </Link>
              </div>
            )}
            {issues.map((i) => (
              <Link
                key={i.issueId}
                to={`/issue/${i.issueId}`}
                className="list-item"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>{i.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                    Updated {new Date(i.updatedAt).toLocaleString()}
                  </div>
                </div>
                <StatusBadge status={i.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
