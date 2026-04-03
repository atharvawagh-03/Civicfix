import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="landing-brand">CivicFix</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" className="btn btn-secondary">
            Sign in
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get started
          </Link>
        </div>
      </header>

      <main className="landing-hero-wrap">
        <section className="landing-hero">
          <p className="landing-kicker">Public issue reporting platform</p>
          <h1>Report city problems in seconds. Track every fix in real time.</h1>
          <p className="landing-sub">
            CivicFix helps citizens report potholes, garbage, and infrastructure issues with photos and map location,
            while authorities manage assignments and status updates from one modern dashboard.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            <Link to="/register" className="btn btn-primary">
              Report your first issue
            </Link>
            <Link to="/login" className="btn btn-secondary">
              I already have an account
            </Link>
          </div>
          <div className="landing-stats">
            <div>
              <strong>Image + map</strong>
              <span>Precise issue reporting</span>
            </div>
            <div>
              <strong>Role-based</strong>
              <span>Citizen and Admin dashboards</span>
            </div>
            <div>
              <strong>Live lifecycle</strong>
              <span>Pending → In Progress → Resolved</span>
            </div>
          </div>
        </section>

        <aside className="landing-panel card">
          <h3>Why people love CivicFix</h3>
          <ul>
            <li>Simple issue form with photo upload and map pin selection.</li>
            <li>Transparent status timeline so citizens always know progress.</li>
            <li>Authority tools for assignment, comments, and analytics.</li>
          </ul>
          <div className="landing-mini-grid">
            <div className="landing-mini-card">
              <span>Citizen</span>
              <strong>Quick report</strong>
            </div>
            <div className="landing-mini-card">
              <span>Admin</span>
              <strong>Manage queue</strong>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

