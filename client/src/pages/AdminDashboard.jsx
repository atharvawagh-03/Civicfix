import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fetchIssues, fetchAnalytics } from '../api/client.js';

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchIssues(), fetchAnalytics()])
      .then(([iss, an]) => {
        setIssues(iss);
        setAnalytics(an);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recent = [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  return (
    <Layout>
      <TopNav title="City operations overview" />
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : (
        <>
          <section className="card card-hero card-pad" style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'minmax(0,2.2fr) minmax(0,1.4fr)', gap: 22, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Live complaint snapshot</h2>
              <p style={{ marginTop: 8, color: 'var(--muted)', maxWidth: 460 }}>
                Monitor backlog, track progress across statuses and keep citizens informed with timely updates.
              </p>
              <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <div className="card-hero-stat">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total issues</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>{analytics?.totalIssues ?? issues.length}</div>
                </div>
                <div className="card-hero-stat">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Pending</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--warning)' }}>
                    {analytics?.statusDistribution?.pending ?? 0}
                  </div>
                </div>
                <div className="card-hero-stat">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>In progress</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent)' }}>
                    {analytics?.statusDistribution?.in_progress ?? 0}
                  </div>
                </div>
                <div className="card-hero-stat">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Resolved</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--success)' }}>
                    {analytics?.statusDistribution?.resolved ?? 0}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Workboard shortcuts</p>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/manage" className="btn btn-primary">
                  Open manage queue
                </Link>
              </div>
              {analytics?.monthly?.length > 0 && (
                <p style={{ marginTop: 14, fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Last {analytics.monthly.length} months:{' '}
                  {analytics.monthly.map((m) => `${String(m.month).padStart(2, '0')}/${m.year}`).join(' · ')}
                </p>
              )}
            </div>
          </section>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 12,
              marginBottom: '1.5rem',
            }}
          >
            <StatCard label="Total issues" value={analytics?.totalIssues ?? issues.length} />
            <StatCard label="Pending" value={analytics?.statusDistribution?.pending ?? 0} color="var(--warning)" />
            <StatCard label="In progress" value={analytics?.statusDistribution?.in_progress ?? 0} color="var(--accent)" />
            <StatCard label="Resolved" value={analytics?.statusDistribution?.resolved ?? 0} color="var(--success)" />
          </div>
          {analytics?.monthly?.length > 0 && (
            <section style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Time-based (recent months)</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                {analytics.monthly.map((m) => `${m.year}-${String(m.month).padStart(2, '0')}: ${m.count}`).join(' · ')}
              </p>
            </section>
          )}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Recent complaints</h2>
              <Link to="/manage" style={{ fontSize: '0.9rem' }}>
                Manage all →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Reporter</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((i) => (
                    <tr key={i.issueId}>
                      <td>
                        <Link to={`/issue/${i.issueId}`} style={{ color: 'var(--text)', fontWeight: 900 }}>
                          {i.title}
                        </Link>
                      </td>
                      <td>{i.createdBy?.name || '—'}</td>
                      <td>
                        <StatusBadge status={i.status} />
                      </td>
                      <td>{new Date(i.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recent.length === 0 && <p style={{ color: 'var(--muted)', padding: '1rem 0' }}>No issues yet.</p>}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="card card-pad">
      <div style={{ fontSize: '1.55rem', fontWeight: 900, color: color || 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// th/td inline styles removed in favor of `.table`
