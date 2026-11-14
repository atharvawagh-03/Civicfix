import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fetchIssues } from '../api/client.js';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';

export default function CitizenDashboard() {
  useDocumentTitle('Citizen Dashboard');
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
          <section className="card card-hero card-pad hero-dashboard-responsive" style={{ marginBottom: '1.75rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Thanks for fixing your city</h2>
              <p style={{ marginTop: 8, color: 'var(--muted)', maxWidth: 460 }}>
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

            <div className="dashboard-quick-actions">
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Quick actions</p>
              <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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

            <div className="card card-pad">
              <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 12 }}>Impact score</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
                Resolution efficiency based on your reported issues.
              </p>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent)', marginTop: 8 }}>
                {resolutionRate}%
              </div>
              <div className="progress-track" style={{ marginTop: 8 }}>
                <span style={{ width: `${resolutionRate}%` }} />
              </div>

              <div style={{ marginTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Focus</div>
                <div style={{ fontWeight: 750, marginTop: 4 }}>{focusArea}</div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggested Action</div>
                <p style={{ fontSize: '0.86rem', margin: '4px 0 0 0', color: 'var(--text)' }}>
                  {pending > 0
                    ? `You have ${pending} pending issue${pending > 1 ? 's' : ''} awaiting municipal triage.`
                    : 'Great work! Keep reporting local improvements to help maintain city infrastructure.'}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="card card-pad" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.85rem', fontWeight: 900, color: accent || 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
  );
}
