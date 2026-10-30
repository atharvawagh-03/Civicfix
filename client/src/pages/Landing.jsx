import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import civicHeroImg from '../assets/civic-hero.jpg';

export default function Landing() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dashPath = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="landing-brand">CivicFix</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAuthenticated ? (
            <Link to={dashPath} className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get started
              </Link>
            </>
          )}
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
            {isAuthenticated ? (
              <Link to={dashPath} className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Report your first issue
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  I already have an account
                </Link>
              </>
            )}
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
          <div
            className="landing-panel-image-wrap"
            onClick={() => setIsModalOpen(true)}
            title="Click to view full illustration"
          >
            <img
              src={civicHeroImg}
              alt="CivicFix in action: citizens reporting and crews repairing infrastructure"
              className="landing-panel-image"
            />
            <div className="landing-panel-badge">
              <span className="live-dot" /> CivicFix in Action
            </div>
          </div>
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

      <section className="landing-showcase-wrap">
        <div className="landing-showcase-card">
          <div className="landing-showcase-header">
            <span className="landing-kicker">End-to-End Civic Workflow</span>
            <h2>Bridging Citizens & Municipal Action</h2>
            <p className="landing-showcase-sub">
              From snapping a quick photo on your street to dispatching repair machinery and restoring public infrastructure.
            </p>
          </div>

          <div
            className="landing-showcase-media"
            onClick={() => setIsModalOpen(true)}
            title="Click to view full illustration"
          >
            <img
              src={civicHeroImg}
              alt="CivicFix in action: citizen photographing road pothole while municipal team repairs street infrastructure"
              className="landing-showcase-img"
            />
          </div>

          <div className="landing-showcase-features">
            <div className="landing-feature-chip">
              <span className="chip-icon">📸</span>
              <div>
                <strong>1. Snap & Pinpoint</strong>
                <p>Citizens capture photo proof and exact GPS map coordinates in seconds.</p>
              </div>
            </div>
            <div className="landing-feature-chip">
              <span className="chip-icon">🚜</span>
              <div>
                <strong>2. Dispatch & Repair</strong>
                <p>Authorities assign crews, asphalt machinery, and equipment straight to the site.</p>
              </div>
            </div>
            <div className="landing-feature-chip">
              <span className="chip-icon">✨</span>
              <div>
                <strong>3. Verified Resolution</strong>
                <p>Real-time timeline updates keep the neighborhood informed every step of the way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="image-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="image-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={civicHeroImg}
              alt="CivicFix Community Action Illustration"
            />
          </div>
        </div>
      )}
    </div>
  );
}
