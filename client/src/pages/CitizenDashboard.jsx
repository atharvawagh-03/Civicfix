import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fetchIssues } from '../api/client.js';

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues()
      .then(setIssues)
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, []);

  const total = issues.length;
  const pending = issues.filter((i) => i.status === 'pending').length;
  const progress = issues.filter((i) => i.status === 'in_progress').length;
  const resolved = issues.filter((i) => i.status === 'resolved').length;
  const recent = [...issues].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  return (
    <Layout>
      <TopNav title="Dashboard" />
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 14,
              marginBottom: '1.5rem',
            }}
          >
            <StatCard label="Total reported" value={total} />
            <StatCard label="Pending" value={pending} accent="var(--warning)" />
            <StatCard label="In progress" value={progress} accent="var(--accent)" />
            <StatCard label="Resolved" value={resolved} accent="var(--success)" />
          </div>
          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Recent issues</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recent.length === 0 && <p style={{ color: 'var(--muted)' }}>No issues yet. Report one to get started.</p>}
              {recent.map((i) => (
                <Link
                  key={i.issueId}
                  to={`/issue/${i.issueId}`}
                  className="list-item"
                >
                  <span style={{ fontWeight: 800, color: 'var(--text)' }}>{i.title}</span>
                  <StatusBadge status={i.status} />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

function StatCard({ label, value, accent = 'var(--text)' }) {
  return (
    <div className="card card-pad">
      <div style={{ fontSize: '1.55rem', fontWeight: 900, color: accent }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
