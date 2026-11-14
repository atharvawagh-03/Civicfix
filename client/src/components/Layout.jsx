import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ChatBot from './ChatBot.jsx';

function navClass({ isActive }) {
  return `nav-link ${isActive ? 'nav-link-active' : ''}`;
}

export default function Layout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const citizenLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/report', label: 'Report issue', icon: '📝' },
    { to: '/my-issues', label: 'My issues', icon: '📋' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin dashboard', icon: '📊' },
    { to: '/manage', label: 'Manage issues', icon: '⚙️' },
  ];

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* Top Application Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          {/* Clickable Brand Logo */}
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="app-brand" title="Go to Dashboard">
            <span className="brand-symbol" style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5a4, #22c55e)' }} />
            <span>CivicFix</span>
          </Link>
        </div>

        {/* Clickable User Email & Quick Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className="app-user"
              title={`Signed in as ${user.name} (${user.email}) - Click to send email`}
            >
              {user.email}
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="header-logout-btn"
            title="Sign out of account"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Shell */}
      <div className="app-shell" style={{ flex: 1, position: 'relative' }}>
        {/* Desktop Sidebar */}
        <aside className="side-nav desktop-sidebar">
          <div className="side-title">
            <strong>CivicFix</strong>
            <div className="side-role">
              {user?.name}
              <span style={{ display: 'block', textTransform: 'capitalize' }}>
                {user?.role === 'admin' ? 'Municipal Admin' : 'Resident Citizen'}
              </span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass} end={l.to === '/dashboard' || l.to === '/admin'}>
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: 14 }}>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="btn btn-secondary btn-full"
            >
              Log out
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer & Backdrop */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="brand-symbol" style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5a4, #22c55e)' }} />
              <strong style={{ fontSize: '1.1rem' }}>CivicFix</strong>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: 16 }}>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>{user?.name}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'capitalize' }}>
                {user?.role === 'admin' ? 'Municipal Administrator' : 'Citizen Resident'}
              </span>
              <a
                href={`mailto:${user?.email}`}
                style={{ display: 'block', fontSize: '0.78rem', color: 'var(--accent)', marginTop: 4, textDecoration: 'none' }}
              >
                {user?.email}
              </a>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={navClass}
                  end={l.to === '/dashboard' || l.to === '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="btn btn-secondary btn-full"
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="main-area">{children}</div>
      </div>

      {user && <ChatBot />}
    </div>
  );
}

export function TopNav({ title }) {
  return (
    <header style={{ marginBottom: '1.25rem' }}>
      <h1 className="page-title">{title}</h1>
    </header>
  );
}
