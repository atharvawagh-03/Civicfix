import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import civicHeroImg from '../assets/civic-hero.jpg';

export default function Landing() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('general');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);

  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSending(true);
    // Simulate swift submission handling
    setTimeout(() => {
      setContactSending(false);
      setContactSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 600);
  }

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

      {/* Floating Top Navbar with Navigation Links & Separate Portals */}
      <header className="landing-nav-floating">
        <div className="landing-brand">
          <span className="brand-dot" /> CivicFix
        </div>

        {/* Anchor Navigation Links */}
        <nav className="landing-nav-links">
          <a href="#about" className="landing-nav-link">About</a>
          <a href="#workflow" className="landing-nav-link">How It Works</a>
          <a href="#contact" className="landing-nav-link">Contact Us</a>
        </nav>

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
      <section id="workflow" className="landing-workflow-section">
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

      {/* About Us Section */}
      <section id="about" className="landing-about-section">
        <div className="landing-about-card">
          <div className="landing-about-header">
            <span className="landing-badge-pill">Who We Are & What We Do</span>
            <h2>About CivicFix</h2>
            <p>
              CivicFix is a modern public infrastructure management platform designed to eliminate the barrier
              between city residents and municipal maintenance departments. We empower every citizen to be the eyes of their city,
              ensuring public streets, lighting, sanitation, and utilities are fixed swiftly and transparently.
            </p>
          </div>

          <div className="landing-about-pillars">
            <div className="about-pillar-card">
              <div className="pillar-icon-wrap">🛡️</div>
              <h4>Radical Transparency</h4>
              <p>
                No more lost complaints or bureaucratic black holes. Every ticket is publicly tracked with timestamped status changes from Pending to In Progress to Resolved.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="pillar-icon-wrap">📍</div>
              <h4>Precise Geo-Tagging</h4>
              <p>
                Interactive maps and GPS coordinates ensure municipal teams know the exact pothole, broken streetlight, or illegal dump site without guessing.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="pillar-icon-wrap">🚜</div>
              <h4>Direct Municipal Dispatch</h4>
              <p>
                Authorities have access to tailored queue filters, severity indicators, and machinery assignment tools to dispatch field crews where they are needed most.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="pillar-icon-wrap">🤝</div>
              <h4>Community Collaboration</h4>
              <p>
                When citizens and authorities work together, neighborhoods become cleaner, safer, and more resilient. CivicFix gives community members a direct stake in urban upkeep.
              </p>
            </div>
          </div>

          <div className="landing-about-stats">
            <div className="about-stat-item">
              <span className="about-stat-number">100%</span>
              <span className="about-stat-label">Real-Time Tracking Transparency</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">24/7</span>
              <span className="about-stat-label">Citizen Reporting Accessibility</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">4+</span>
              <span className="about-stat-label">Municipal Sectors (Roads, Waste, Lights, Water)</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">&lt; 24h</span>
              <span className="about-stat-label">Average Ticket Review & Queue Triage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="landing-contact-section">
        <div className="landing-contact-card">
          <div className="landing-contact-header">
            <span className="landing-badge-pill">We’re Here To Help</span>
            <h2>Contact Us</h2>
            <p>
              Have a question about using CivicFix, need administrative support, or want to deploy CivicFix in your municipal corporation? Reach out to our team below.
            </p>
          </div>

          <div className="landing-contact-grid">
            {/* Contact Information Cards */}
            <div className="contact-info-col">
              <div className="contact-info-item">
                <div className="contact-item-icon">🏢</div>
                <div>
                  <h4>Municipal Operations Hub</h4>
                  <p>CivicFix Directorate, City Infrastructure Center, Civic Center Road</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-item-icon">✉️</div>
                <div>
                  <h4>Email Support</h4>
                  <p>
                    General Support: <a href="mailto:support@civicfix.org">support@civicfix.org</a>
                    <br />
                    Authority Desk: <a href="mailto:admin@civicfix.gov">admin@civicfix.gov</a>
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-item-icon">📞</div>
                <div>
                  <h4>Toll-Free Civic Helpline</h4>
                  <p>
                    <a href="tel:18002484234">1800-CIVIC-FIX (1800-248-4234)</a>
                    <br />
                    <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
                  </p>
                </div>
              </div>

              {/* Emergency Hazard Notice */}
              <div className="emergency-hazard-card">
                <span className="emergency-icon">🚨</span>
                <div>
                  <strong>Urgent Life-Threatening Hazards</strong>
                  <p>
                    For immediate emergencies like live fallen power cables, gas line leaks, or severe flooding, please call your local emergency dispatch service (911 / 112) immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Contact & Feedback Form */}
            <div className="contact-form-col">
              <h3>Send us a Message</h3>
              <p className="form-sub">Fill out the form below and our municipal help desk will respond within 24 hours.</p>

              {contactSubmitted ? (
                <div className="contact-success-banner">
                  <span>✅</span>
                  <div>
                    <strong>Message Sent Successfully!</strong>
                    <div style={{ fontSize: '0.84rem', marginTop: 2, opacity: 0.9 }}>
                      Thank you for contacting CivicFix. A representative will get in touch with you shortly.
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="contact-form">
                  <label className="field">
                    <span className="field-label">Your Full Name</span>
                    <input
                      required
                      type="text"
                      className="form-control"
                      placeholder="e.g. Maya Sharma"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Email Address</span>
                    <input
                      required
                      type="email"
                      className="form-control"
                      placeholder="e.g. maya@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Subject / Inquiry Type</span>
                    <select
                      className="form-control"
                      value={contactCategory}
                      onChange={(e) => setContactCategory(e.target.value)}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="citizen-support">Citizen Portal Assistance</option>
                      <option value="admin-partnership">Municipal Authority Onboarding</option>
                      <option value="technical">Technical Issue / Bug Report</option>
                      <option value="feedback">Platform Feedback & Suggestions</option>
                    </select>
                  </label>

                  <label className="field">
                    <span className="field-label">Message Details</span>
                    <textarea
                      required
                      rows={4}
                      className="form-control"
                      placeholder="Describe your inquiry, suggestion, or question in detail..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={contactSending}
                    className="btn btn-primary btn-full"
                    style={{ marginTop: 6 }}
                  >
                    {contactSending ? 'Submitting Message…' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Landing Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            <h3>
              <span className="brand-dot" /> CivicFix
            </h3>
            <p>
              Transforming urban maintenance into a transparent, community-driven partnership.
              Empowering citizens to report issues and municipal teams to resolve them faster.
            </p>
          </div>

          <div className="footer-col">
            <h4>Portals</h4>
            <ul>
              <li><Link to="/login?role=citizen">Citizen Login</Link></li>
              <li><Link to="/register?role=citizen">Citizen Registration</Link></li>
              <li><Link to="/login?role=admin">Admin & Authority Login</Link></li>
              <li><Link to="/report">Report an Issue</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#about">About CivicFix</a></li>
              <li><a href="#workflow">How It Works</a></li>
              <li><a href="#contact">Contact Support</a></li>
              <li><a href="#workflow">Civic Highlights</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <ul>
              <li><a href="#contact">Emergency Help Desk</a></li>
              <li><a href="#about">Public Transparency</a></li>
              <li><a href="mailto:support@civicfix.org">support@civicfix.org</a></li>
              <li><a href="tel:18002484234">1800-CIVIC-FIX</a></li>
            </ul>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>&copy; {new Date().getFullYear()} CivicFix Public Infrastructure Platform. All rights reserved.</span>
          <span>Building cleaner, safer communities together.</span>
        </div>
      </footer>

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
