import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import civicHeroImg from '../assets/civic-hero.jpg';

export default function Landing() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="landing-fullscreen-shell">
      {/* Full-Screen Hero Visual Backdrop */}
      <div className="landing-hero-backdrop">
        <img
          src={civicHeroImg}
          alt="CivicFix: Citizen reporting an issue while municipal crews repair roads and streetlights"
          className="landing-fullscreen-img"
        />
        <div className="landing-backdrop-overlay" />
      </div>

      {/* Floating Top Navbar with Separate Login Portals */}
      <header className="landing-nav-floating">
        <div className="landing-brand">
          <span className="brand-dot" /> CivicFix
        </div>

        <div className="landing-nav-actions">
          {user && (
            <div className="user-status-pill">
              <span>Signed in as:</span>
              <strong>{user.name} ({user.role})</strong>
              <button
                type="button"
                onClick={logout}
                className="btn btn-ghost"
                style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '6px' }}
                title="Sign out of current account"
              >
                Log out
              </button>
            </div>
          )}

          {/* Explicit Separate Logins */}
          <Link to="/login?role=citizen" className="btn btn-primary" title="Citizen portal login">
            👤 Citizen Login
          </Link>

          <Link to="/login?role=admin" className="btn btn-admin" title="Admin authority login">
            🛡️ Admin Login
          </Link>
        </div>
      </header>

      {/* Hero Content Floating Over Full-Screen Visual */}
      <main className="landing-fullscreen-content">
        <div className="landing-hero-card">
          <div className="landing-badge-pill">
            <span className="live-dot" /> Public Issue Reporting & Resolution Platform
          </div>

          <h1>Report city problems in seconds. Track every fix in real time.</h1>

          <p className="landing-sub">
            CivicFix connects citizens directly to municipal authorities. Snap a photo of a pothole,
            garbage pile, or street hazard with automatic GPS location — and watch city crews repair and resolve it live.
          </p>

          {/* Separate Portals for Citizen & Admin */}
          <div className="landing-portals-grid">
            {/* Citizen Access Portal */}
            <div className="portal-access-card citizen-portal">
              <div>
                <div className="portal-card-header">
                  <div className="portal-icon-badge">👤</div>
                  <div>
                    <h3>Citizen Portal</h3>
                    <span>For Residents & Public</span>
                  </div>
                </div>
                <p className="portal-card-desc" style={{ marginTop: '0.75rem' }}>
                  Report potholes, waste, and hazards with photo upload & live GPS. Track resolution milestones in real time.
                </p>
              </div>

              <div className="portal-actions">
                <Link to="/login?role=citizen" className="btn btn-primary btn-lg btn-full">
                  Citizen Login →
                </Link>
                <Link to="/register?role=citizen" className="portal-sub-link">
                  New citizen? Register here
                </Link>
              </div>
            </div>

            {/* Admin Access Portal */}
            <div className="portal-access-card admin-portal">
              <div>
                <div className="portal-card-header">
                  <div className="portal-icon-badge">🛡️</div>
                  <div>
                    <h3>Admin & Authority</h3>
                    <span>Municipal Staff & Supervisors</span>
                  </div>
                </div>
                <p className="portal-card-desc" style={{ marginTop: '0.75rem' }}>
                  Access municipal queues, assign maintenance crews & road rollers, update statuses, and verify completed fixes.
                </p>
              </div>

              <div className="portal-actions">
                <Link to="/login?role=admin" className="btn btn-admin btn-lg btn-full">
                  Admin Login →
                </Link>
                <div className="portal-secure-badge">
                  <span>🔒 Authorized Municipal Personnel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Feature Stats */}
          <div className="landing-stats-row">
            <div className="landing-stat-box">
              <span className="stat-icon">📸</span>
              <div>
                <strong>Photo + GPS</strong>
                <span>Instant geo-tagged report</span>
              </div>
            </div>
            <div className="landing-stat-box">
              <span className="stat-icon">🚜</span>
              <div>
                <strong>Field Crew Dispatch</strong>
                <span>Road, lighting & sanitation</span>
              </div>
            </div>
            <div className="landing-stat-box">
              <span className="stat-icon">🔄</span>
              <div>
                <strong>Live Progress</strong>
                <span>Pending → In Progress → Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Full-Width Showcase & Workflow Section */}
      <section className="landing-workflow-section">
        <div className="landing-workflow-card">
          <div className="landing-workflow-header">
            <span className="landing-badge-pill">Complete Community Workflow</span>
            <h2>From Citizen Report to Real-World Fix</h2>
            <p>
              CivicFix transforms civic maintenance into a collaborative, transparent experience for everyone in the city.
            </p>
          </div>

          <div
            className="landing-full-image-container"
            onClick={() => setIsModalOpen(true)}
            title="Click to view high-resolution full-screen image"
          >
            <img
              src={civicHeroImg}
              alt="CivicFix full panoramic illustration showing citizen reporting and crews repairing city streets"
            />
            <div className="landing-image-expand-hint">
              ⛶ Click to expand full size
            </div>
          </div>

          <div className="landing-workflow-grid">
            <div className="landing-workflow-item">
              <span className="landing-workflow-icon">📸</span>
              <h4>1. Citizen Portal: Spot & Report</h4>
              <p>
                Citizens snap a photo of any issue with exact GPS location in seconds. Automatic ticket creation.
              </p>
            </div>

            <div className="landing-workflow-item">
              <span className="landing-workflow-icon">🚜</span>
              <h4>2. Admin Portal: Dispatch & Repair</h4>
              <p>
                Municipal supervisors review the ticket, assign road rollers and technicians, and begin active work.
              </p>
            </div>

            <div className="landing-workflow-item">
              <span className="landing-workflow-icon">✨</span>
              <h4>3. Verified Resolution</h4>
              <p>
                Repairs are verified with photo proof, and the status changes to Resolved live for all neighbors to see.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Screen Lightbox Modal */}
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
              alt="CivicFix Fullscreen City Action Illustration"
              className="image-modal-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
