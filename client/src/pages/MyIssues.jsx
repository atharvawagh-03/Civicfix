import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fetchIssues } from '../api/client.js';

export default function MyIssues() {
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
          <span style={{ color: 'var(--muted)', fontWeight: 750 }}>Filter:</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control" style={{ width: 240 }}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {issues.length === 0 && <p style={{ color: 'var(--muted)' }}>No issues match this filter.</p>}
          {issues.map((i) => (
            <Link
              key={i.issueId}
              to={`/issue/${i.issueId}`}
              className="list-item"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 900 }}>{i.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
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
