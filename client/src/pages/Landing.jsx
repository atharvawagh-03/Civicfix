import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import civicHeroImg from '../assets/civic-hero.jpg';

export default function Landing() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [showDetails, setShowDetails] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dashPath = isAdmin ? '/admin' : '/dashboard';

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

      {/* Floating Top Navbar */}
      <header className="landing-nav-floating">
        <div className="landing-brand">
          <span className="brand-dot" /> CivicFix
        </div>

        <div className="landing-nav-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowDetails(!showDetails)}
            title="Toggle card overlay to see full unobstructed image"
          >
            {showDetails ? '👁️ View Image' : '📋 Show Details'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setIsModalOpen(true)}
            title="Open image in full-screen modal"
          >
            ⛶ Fullscreen
          </button>
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

      {/* Hero Content Floating Over Full-Screen Visual */}
      {showDetails && (
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

            <div className="landing-cta-row">
              {isAuthenticated ? (
                <Link to={dashPath} className="btn btn-primary btn-lg">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Report an Issue Now
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    I already have an account
                  </Link>
                </>
              )}
            </div>

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
      )}

      {/* Floating Toggle Button for Convenience */}
      <button
        type="button"
        className="view-image-pill"
        onClick={() => setShowDetails(!showDetails)}
        title="Toggle overlay to view the full screen illustration"
      >
        {showDetails ? '👁️ View Full Image' : '📋 Show Platform Info'}
      </button>

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
              <h4>1. Citizens Spot & Report</h4>
              <p>
                Take a photo directly from your smartphone. GPS coordinates and category are pinpointed automatically.
              </p>
            </div>

            <div className="landing-workflow-item">
              <span className="landing-workflow-icon">🚜</span>
              <h4>2. Municipal Dispatch</h4>
              <p>
                City departments receive the ticket in real time, deploy road rollers, repair crews, and prioritize urgent issues.
              </p>
            </div>

            <div className="landing-workflow-item">
              <span className="landing-workflow-icon">✨</span>
              <h4>3. Verified Resolution</h4>
              <p>
                Repairs are photo-verified upon completion and the public status timeline is updated live for all residents.
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
