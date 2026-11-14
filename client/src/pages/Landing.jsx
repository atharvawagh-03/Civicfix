import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';
import civicHeroImg from '../assets/civic-hero.jpg';
import {
  IconUser,
  IconShield,
  IconCamera,
  IconPin,
  IconTruck,
  IconCheckCircle,
  IconBuilding,
  IconMail,
  IconPhone,
  IconAlertTriangle,
  IconArrowRight,
  IconLayers,
  IconCheck,
} from '../components/Icons.jsx';

export default function Landing() {
  useDocumentTitle('Public Issue Reporting & Resolution Platform');
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('general');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Close mobile menu on scroll or resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 860) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSending(true);
    setTimeout(() => {
      setContactSending(false);
      setContactSubmitted(true);
      setReferenceId(`CF-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 450);
  }

  function handleResetContact() {
    setContactSubmitted(false);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setReferenceId('');
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-shell-designed" style={{ overflowX: 'hidden', width: '100%' }}>
      {/* Background Atmosphere: Controlled Scrim */}
      <div className="landing-ambient-layer" />

      {/* Primary Top Header */}
      <header className="landing-header-clean">
        <div className="landing-header-inner">
          {/* Clickable Logo */}
          <Link to="/" onClick={scrollToTop} className="brand-group" title="CivicFix Home">
            <span className="brand-symbol" />
            <span className="brand-name">CivicFix</span>
            <span className="brand-version-badge">Operations 2.0</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-menu">
            <a href="#how-it-works" className="nav-menu-link">How It Works</a>
            <a href="#about" className="nav-menu-link">Architecture</a>
            <a href="#contact" className="nav-menu-link">Municipal Contact</a>
          </nav>

          {/* Desktop Actions */}
          <div className="nav-actions-group">
            {user && (
              <div className="session-status-badge">
                <span className="status-indicator-dot" />
                <span className="session-user-name">{user.name}</span>
                <span className="session-role-pill">{user.role}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="btn-link-action"
                  title="Sign out of current account"
                >
                  Sign Out
                </button>
              </div>
            )}

            <Link to="/login?role=citizen" className="btn-nav-citizen">
              <IconUser size={15} />
              <span>Citizen Portal</span>
            </Link>

            <Link to="/login?role=admin" className="btn-nav-admin">
              <IconShield size={15} />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            className="landing-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <nav className="landing-mobile-nav">
              <a
                href="#how-it-works"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#about"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Architecture
              </a>
              <a
                href="#contact"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Municipal Contact
              </a>
            </nav>

            <div className="landing-mobile-actions">
              {user && (
                <div className="mobile-session-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="status-indicator-dot" />
                    <strong>{user.name}</strong>
                    <span className="session-role-pill">{user.role}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-link-action"
                    style={{ marginTop: 6 }}
                  >
                    Sign Out
                  </button>
                </div>
              )}

              <Link
                to="/login?role=citizen"
                className="btn-portal btn-citizen-primary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ justifyContent: 'center' }}
              >
                <IconUser size={16} />
                <span>Citizen Portal</span>
              </Link>

              <Link
                to="/login?role=admin"
                className="btn-portal btn-admin-primary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ justifyContent: 'center' }}
              >
                <IconShield size={16} />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section: Engineered for Clarity & Utility */}
      <section className="hero-section-designed">
        <div className="hero-container">
          <div className="hero-headline-block">
            <div className="kicker-badge">
              <span className="kicker-status-indicator" />
              <span>Public Infrastructure & Hazard Management</span>
            </div>

            <h1 className="hero-title">
              Fix city problems faster.
              <br />
              <span className="hero-title-secondary">Track every street repair live.</span>
            </h1>

            <p className="hero-lead">
              CivicFix bridges municipal authorities and residents. Capture potholes,
              damaged lighting, and sanitation hazards with auto-detected GPS location &mdash;
              then monitor maintenance crews as repairs are dispatched and resolved in real time.
            </p>
          </div>

          {/* Dedicated Login Gateways */}
          <div className="portals-grid-designed">
            {/* Citizen Gateway */}
            <div className="portal-card-designed portal-citizen">
              <div className="portal-top">
                <div className="portal-icon-box citizen-accent">
                  <IconUser size={20} />
                </div>
                <div>
                  <h3 className="portal-heading">Citizen Reporting</h3>
                  <span className="portal-meta">Public resident portal</span>
                </div>
              </div>

              <p className="portal-description">
                Submit street defects, upload photographic evidence, and track status milestones directly from your smartphone.
              </p>

              <div className="portal-action-block">
                <Link to="/login?role=citizen" className="btn-portal btn-citizen-primary">
                  <span>Sign in as Citizen</span>
                  <IconArrowRight size={16} />
                </Link>
                <Link to="/register?role=citizen" className="portal-secondary-link">
                  New resident? Register an account
                </Link>
              </div>
            </div>

            {/* Admin / Authority Gateway */}
            <div className="portal-card-designed portal-admin">
              <div className="portal-top">
                <div className="portal-icon-box admin-accent">
                  <IconShield size={20} />
                </div>
                <div>
                  <h3 className="portal-heading">Municipal Operations</h3>
                  <span className="portal-meta">City engineers & dispatchers</span>
                </div>
              </div>

              <p className="portal-description">
                Manage ticket triage, deploy asphalt machinery and field crews, update repair timelines, and verify completion photos.
              </p>

              <div className="portal-action-block">
                <Link to="/login?role=admin" className="btn-portal btn-admin-primary">
                  <span>Sign in as Administrator</span>
                  <IconArrowRight size={16} />
                </Link>
                <div className="portal-institutional-tag">
                  <IconShield size={13} />
                  <span>Authorized Municipal Staff Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Row */}
          <div className="hero-telemetry-row">
            <div className="telemetry-cell">
              <IconCamera size={18} className="cell-icon" />
              <div>
                <strong>Photo + GPS Coordinate</strong>
                <span>Instant geo-stamped report</span>
              </div>
            </div>

            <div className="telemetry-cell">
              <IconTruck size={18} className="cell-icon" />
              <div>
                <strong>Workforce Dispatch</strong>
                <span>Machinery & repair crews</span>
              </div>
            </div>

            <div className="telemetry-cell">
              <IconCheckCircle size={18} className="cell-icon" />
              <div>
                <strong>Auditable Progression</strong>
                <span>Pending &rarr; In Progress &rarr; Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Canvas: Framed Live Operations Window */}
      <section id="how-it-works" className="operations-monitor-section">
        <div className="operations-monitor-container reveal-on-scroll">
          <div className="window-frame">
            <div className="window-chrome-bar">
              <div className="window-controls">
                <span className="window-circle" />
                <span className="window-circle" />
                <span className="window-circle" />
              </div>
              <div className="window-title-tag">
                LIVE MUNICIPAL OPERATIONS FEED &mdash; METROPOLITAN SECTOR
              </div>
              <div className="window-status-pill">
                <span className="status-live-dot" />
                <span>FIELD TEAMS ACTIVE</span>
              </div>
            </div>

            <div
              className="window-canvas-wrapper"
              onClick={() => setIsModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true);
              }}
              title="Click to view full-resolution city infrastructure overview"
            >
              <img
                src={civicHeroImg}
                alt="CivicFix operations overview showing citizen reporting and municipal road repair crews"
                className="window-canvas-img"
                loading="lazy"
                decoding="async"
              />
              <div className="window-canvas-overlay-hint">
                <span>View Full Resolution</span>
              </div>
            </div>
          </div>

          {/* 3-Stage Resolution Pipeline */}
          <div className="pipeline-stages-grid">
            <div className="pipeline-card reveal-on-scroll delay-1">
              <div className="pipeline-number">01</div>
              <h4 className="pipeline-title">Spot & Document</h4>
              <p className="pipeline-desc">
                Citizens photograph road defects, overflowing waste, or broken streetlights. The client detects GPS coordinates automatically.
              </p>
              <div className="pipeline-badge">Citizen Action</div>
            </div>

            <div className="pipeline-card reveal-on-scroll delay-2">
              <div className="pipeline-number">02</div>
              <h4 className="pipeline-title">Triage & Dispatch</h4>
              <p className="pipeline-desc">
                Municipal administrators review incoming tickets, categorize hazard severity, and dispatch specialized equipment and repair technicians.
              </p>
              <div className="pipeline-badge">Authority Action</div>
            </div>

            <div className="pipeline-card reveal-on-scroll delay-3">
              <div className="pipeline-number">03</div>
              <h4 className="pipeline-title">Resolution & Audit</h4>
              <p className="pipeline-desc">
                Upon job completion, crews upload verification photos. Status transitions to Resolved live on the public transparency map.
              </p>
              <div className="pipeline-badge">Verified Resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Institutional Accountability Section */}
      <section id="about" className="institutional-section">
        <div className="institutional-container reveal-on-scroll">
          <div className="section-header-block">
            <div className="section-kicker">INSTITUTIONAL ARCHITECTURE</div>
            <h2 className="section-title">Designed for public accountability</h2>
            <p className="section-subtitle">
              Traditional municipal reporting gets lost in bureaucratic queues. CivicFix establishes an open,
              auditable pipeline where every citizen report is treated as a verifiable work ticket.
            </p>
          </div>

          <div className="pillars-grid-designed">
            <div className="pillar-item reveal-on-scroll delay-1">
              <div className="pillar-icon">
                <IconShield size={20} />
              </div>
              <h4>Public Audit Trail</h4>
              <p>
                Every status update is immutable and timestamped. Progress cannot be marked completed without photographic resolution evidence.
              </p>
            </div>

            <div className="pillar-item reveal-on-scroll delay-2">
              <div className="pillar-icon">
                <IconPin size={20} />
              </div>
              <h4>Precision Geo-Location</h4>
              <p>
                Integrated mapping ensures maintenance contractors arrive at the exact meter of the defect, reducing search delays.
              </p>
            </div>

            <div className="pillar-item reveal-on-scroll delay-3">
              <div className="pillar-icon">
                <IconTruck size={20} />
              </div>
              <h4>Departmental Queue Control</h4>
              <p>
                Filter tickets by sanitation, civil roadway, electrical, or drainage departments with dedicated role-based administration.
              </p>
            </div>

            <div className="pillar-item reveal-on-scroll delay-4">
              <div className="pillar-icon">
                <IconLayers size={20} />
              </div>
              <h4>Multi-Tenant Ward Scaling</h4>
              <p>
                Architected to operate across multiple city wards, metropolitan regions, or local councils with centralized reporting metrics.
              </p>
            </div>
          </div>

          {/* Performance & Operating Benchmarks */}
          <div className="metrics-strip reveal-on-scroll delay-2">
            <div className="metric-cell">
              <span className="metric-val">100%</span>
              <span className="metric-lbl">Auditable Ticket Lifecycle</span>
            </div>
            <div className="metric-cell">
              <span className="metric-val">24/7</span>
              <span className="metric-lbl">Intake & Coordinate Logging</span>
            </div>
            <div className="metric-cell">
              <span className="metric-val">4+</span>
              <span className="metric-lbl">Civil Infrastructure Sectors</span>
            </div>
            <div className="metric-cell">
              <span className="metric-val">&lt; 24h</span>
              <span className="metric-lbl">Target Initial Triage SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Municipal Contact & Liaison Section */}
      <section id="contact" className="contact-section-designed">
        <div className="contact-container reveal-on-scroll">
          <div className="section-header-block">
            <div className="section-kicker">MUNICIPAL SUPPORT & LIAISON</div>
            <h2 className="section-title">Contact Operations</h2>
            <p className="section-subtitle">
              Inquiries regarding platform onboarding, administrative access, or municipal partnerships.
            </p>
          </div>

          <div className="contact-layout-split">
            {/* Institutional Information */}
            <div className="contact-info-panel reveal-on-scroll delay-1">
              <div className="info-entry">
                <div className="info-entry-icon">
                  <IconBuilding size={18} />
                </div>
                <div>
                  <h4>Operations Directorate</h4>
                  <p>Municipal Infrastructure Directorate, City Civil Center, Suite 400</p>
                </div>
              </div>

              <div className="info-entry">
                <div className="info-entry-icon">
                  <IconMail size={18} />
                </div>
                <div>
                  <h4>Electronic Inquiries</h4>
                  <p>
                    General Help Desk:{' '}
                    <a href="mailto:support@civicfix.org" className="contact-link" title="Send email to support@civicfix.org">
                      support@civicfix.org
                    </a>
                    <br />
                    Authority Liaison:{' '}
                    <a href="mailto:admin@civicfix.gov" className="contact-link" title="Send email to admin@civicfix.gov">
                      admin@civicfix.gov
                    </a>
                  </p>
                </div>
              </div>

              <div className="info-entry">
                <div className="info-entry-icon">
                  <IconPhone size={18} />
                </div>
                <div>
                  <h4>Public Helpline</h4>
                  <p>
                    <a href="tel:18002484234" className="contact-link" title="Call CivicFix Public Helpline">
                      1800-CIVIC-FIX (1800-248-4234)
                    </a>
                    <br />
                    <span className="subtext">Operating Hours: Mon &ndash; Sat, 08:00 &ndash; 20:00 IST</span>
                  </p>
                </div>
              </div>

              {/* Protocol Advisory for Hazards */}
              <div className="emergency-advisory-box">
                <IconAlertTriangle size={20} className="emergency-icon-svg" />
                <div>
                  <strong>Critical Hazard Protocol</strong>
                  <p>
                    For active life-threatening emergencies (e.g. fallen high-voltage cables, open gas mains, or structural collapse), contact emergency services (112 / 100) immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Form */}
            <div className="contact-form-panel reveal-on-scroll delay-2">
              <h3 className="form-panel-title">Submit Inquiry</h3>
              <p className="form-panel-sub">Official communication dispatch. Response within one business day.</p>

              {contactSubmitted ? (
                <div className="submission-success-card">
                  <IconCheck size={20} className="success-icon-svg" />
                  <div style={{ flex: 1 }}>
                    <strong>Inquiry Received Successfully</strong>
                    <p style={{ margin: '4px 0 8px 0' }}>
                      Your communication has been dispatched to the municipal desk.
                    </p>
                    <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700 }}>
                      Tracking Reference: {referenceId}
                    </div>
                    <button
                      type="button"
                      onClick={handleResetContact}
                      className="btn btn-secondary"
                      style={{ marginTop: 12, fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="contact-form-designed">
                  <div className="form-field-group">
                    <label className="field-label">Full Name</label>
                    <input
                      required
                      type="text"
                      className="text-input-clean"
                      placeholder="e.g. Ramesh Patil"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Email Address</label>
                    <input
                      required
                      type="email"
                      className="text-input-clean"
                      placeholder="e.g. ramesh.patil@nashik.gov.in"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Department / Inquiry Category</label>
                    <select
                      className="select-input-clean"
                      value={contactCategory}
                      onChange={(e) => setContactCategory(e.target.value)}
                    >
                      <option value="general">General Operations Inquiry</option>
                      <option value="citizen-support">Resident Portal Support</option>
                      <option value="admin-partnership">Municipal Integration / Ward Deployment</option>
                      <option value="technical">Technical Report / Defect</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Message Specification</label>
                    <textarea
                      required
                      rows={4}
                      className="textarea-input-clean"
                      placeholder="Provide detailed description of the road defect, query, or civic requirement..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSending}
                    className="btn-submit-action"
                  >
                    {contactSending ? 'Dispatching…' : 'Submit Communication'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Platform Footer */}
      <footer className="designed-footer">
        <div className="designed-footer-inner">
          <div className="footer-brand-col">
            <Link to="/" onClick={scrollToTop} className="brand-group" title="CivicFix Home">
              <span className="brand-symbol" />
              <span className="brand-name">CivicFix</span>
            </Link>
            <p className="footer-tagline">
              Civil infrastructure tracking & municipal field dispatch framework.
              Built for transparent public accountability.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4>Access Portals</h4>
            <ul>
              <li><Link to="/login?role=citizen">Citizen Reporting</Link></li>
              <li><Link to="/register?role=citizen">Resident Registration</Link></li>
              <li><Link to="/login?role=admin">Authority Console</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Specifications</h4>
            <ul>
              <li><a href="#how-it-works">Pipeline Architecture</a></li>
              <li><a href="#about">Verification Standards</a></li>
              <li><a href="#contact">Emergency Protocols</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Administration</h4>
            <ul>
              <li>
                <a href="mailto:support@civicfix.org" className="contact-link">
                  support@civicfix.org
                </a>
              </li>
              <li>
                <a href="tel:18002484234" className="contact-link">
                  1800-CIVIC-FIX
                </a>
              </li>
              <li><span>Civic Center, Suite 400</span></li>
            </ul>
          </div>
        </div>

        <div className="designed-footer-bottom">
          <span>&copy; {new Date().getFullYear()} CivicFix Municipal Platform. All rights reserved.</span>
          <span className="footer-compliance-text">Audited Municipal Framework &bull; Verified Dispatch</span>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="modal-lightbox-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-lightbox-header">
              <span>Civic Infrastructure Overview &mdash; Real-Time Urban Resolution</span>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <img
              src={civicHeroImg}
              alt="CivicFix Fullscreen View"
              className="modal-lightbox-image"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )}
    </div>
  );
}
