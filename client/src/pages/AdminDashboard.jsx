import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fetchIssues, fetchAnalytics } from '../api/client.js';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';

export default function AdminDashboard() {
  useDocumentTitle('Admin Operations Console');
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
          <section className="card card-hero card-pad hero-dashboard-responsive" style={{ marginBottom: '1.75rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Live complaint snapshot</h2>
              <p style={{ marginTop: 8, color: 'var(--muted)', maxWidth: 460 }}>
                Monitor municipal backlog, track workforce progress across statuses and keep citizens informed with timely updates.
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
            <div className="dashboard-quick-actions">
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Workboard shortcuts</p>
              <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/manage" className="btn btn-primary">
                  Open manage queue &rarr;
                </Link>
              </div>
              {analytics?.monthly?.length > 0 && (
                <p style={{ marginTop: 14, fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Active periods:{' '}
                  {analytics.monthly.map((m) => `${String(m.month).padStart(2, '0')}/${m.year}`).join(' · ')}
                </p>
              )}
            </div>
          </section>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
              marginBottom: '1.5rem',
            }}
          >
            <StatCard label="Total issues" value={analytics?.totalIssues ?? issues.length} />
            <StatCard label="Pending" value={analytics?.statusDistribution?.pending ?? 0} color="var(--warning)" />
            <StatCard label="In progress" value={analytics?.statusDistribution?.in_progress ?? 0} color="var(--accent)" />
            <StatCard label="Resolved" value={analytics?.statusDistribution?.resolved ?? 0} color="var(--success)" />
          </div>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Recent citizen complaints</h2>
              <Link to="/manage" style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 600 }}>
                View all in queue &rarr;
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.length === 0 && <p style={{ color: 'var(--muted)' }}>No issues reported yet.</p>}
              {recent.map((i) => (
                <Link
                  key={i.issueId}
                  to={`/issue/${i.issueId}`}
                  className="list-item"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontWeight: 800 }}>{i.title}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      Reported by {i.createdBy?.name || 'Citizen'} · {new Date(i.createdAt).toLocaleString()}
                    </span>
                  </div>
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

function StatCard({ label, value, color }) {
  return (
    <div className="card card-pad" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.85rem', fontWeight: 900, color: color || 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
  );
}
