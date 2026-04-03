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
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
  const focusArea =
    pending >= progress && pending >= resolved ? 'Backlog clear-up' : progress >= resolved ? 'Active operations' : 'Final verification';

  return (
    <Layout>
      <TopNav title="Your impact overview" />
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : (
        <>
          {/* Hero summary card */}
          <section className="card card-hero card-pad" style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.4fr)', gap: 20, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Thanks for fixing your city</h2>
              <p style={{ marginTop: 8, color: 'var(--muted)', maxWidth: 420 }}>
                Track every report you raise, see progress in real time, and help local authorities prioritise what matters most.
              </p>

              <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <div className="card-hero-stat">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total reports</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>{total}</div>
                </div>
                <div className="card-hero-stat">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Resolved</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--success)' }}>{resolved}</div>
                </div>
                <div className="card-hero-stat">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>In progress</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent)' }}>{progress}</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Quick actions</p>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/report" className="btn btn-primary">
                  + Report new issue
                </Link>
                <Link to="/my-issues" className="btn btn-secondary">
                  View all my issues
                </Link>
              </div>
            </div>
          </section>

          {/* Stat bar */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 14,
              marginBottom: '1.75rem',
            }}
          >
            <StatCard label="Total reported" value={total} />
            <StatCard label="Pending" value={pending} accent="var(--warning)" />
            <StatCard label="In progress" value={progress} accent="var(--accent)" />
            <StatCard label="Resolved" value={resolved} accent="var(--success)" />
          </section>

          <section className="dashboard-grid">
            <div className="card card-pad">
              <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 12 }}>Recent issues</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recent.length === 0 && <p style={{ color: 'var(--muted)' }}>No issues yet. Report one to get started.</p>}
                {recent.map((i) => (
                  <Link key={i.issueId} to={`/issue/${i.issueId}`} className="list-item">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontWeight: 800, color: 'var(--text)' }}>{i.title}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                        Updated {new Date(i.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <StatusBadge status={i.status} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="insight-list">
              <div className="card card-pad">
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Impact score</h3>
                <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Resolution efficiency based on your reported issues.
                </p>
                <div style={{ marginTop: 10, fontSize: '1.6rem', fontWeight: 900, color: 'var(--success)' }}>
                  {resolutionRate}%
                </div>
                <div className="progress-track">
                  <span style={{ width: `${resolutionRate}%` }} />
                </div>
              </div>

              <div className="insight-item">
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.11em' }}>
                  Current focus
                </div>
                <div style={{ marginTop: 4, fontWeight: 800 }}>{focusArea}</div>
              </div>
              <div className="insight-item">
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.11em' }}>
                  Suggested action
                </div>
                <div style={{ marginTop: 4, fontWeight: 700 }}>
                  {pending > 0 ? 'Add photos and exact map pin for pending issues.' : 'Great work! Keep reporting local improvements.'}
                </div>
              </div>
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
