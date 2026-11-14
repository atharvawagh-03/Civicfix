import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';
import { IconShield, IconArrowRight, IconUser } from '../components/Icons.jsx';

export default function NotFound() {
  useDocumentTitle('404 Page Not Found');
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="auth-shell" style={{ padding: '2rem 1rem' }}>
      <div className="auth-card card" style={{ maxWidth: 520, textAlign: 'center', padding: '2.5rem 2rem' }}>
        {/* Clickable Brand */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '1.5rem' }}>
          <span className="brand-symbol" style={{ width: 12, height: 12 }} />
          <strong style={{ fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>CivicFix</strong>
        </Link>

        {/* 404 Badge */}
        <div style={{
          display: 'inline-block',
          padding: '0.35rem 0.85rem',
          borderRadius: 999,
          background: 'rgba(239, 68, 68, 0.14)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          color: '#fca5a5',
          fontSize: '0.85rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          404 Error &bull; Record Not Found
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 0.75rem 0', letterSpacing: '-0.03em' }}>
          This page does not exist
        </h1>

        <p style={{ color: 'var(--muted)', fontSize: '0.96rem', lineHeight: 1.6, margin: '0 auto 2rem auto', maxWidth: 420 }}>
          The municipal record, ticket, or URL you are attempting to access could not be located or may have been relocated.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem 1.2rem', justifyContent: 'center' }}
          >
            <span>{isAuthenticated ? 'Go to Your Dashboard' : 'Return to CivicFix Home'}</span>
            <IconArrowRight size={16} />
          </Link>

          {isAuthenticated && (
            <Link
              to="/report"
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem 1.2rem', justifyContent: 'center' }}
            >
              Report a New Issue
            </Link>
          )}

          {!isAuthenticated && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
              <Link to="/login?role=citizen" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.65rem' }}>
                <IconUser size={14} />
                <span>Citizen Portal</span>
              </Link>
              <Link to="/login?role=admin" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.65rem' }}>
                <IconShield size={14} />
                <span>Admin Portal</span>
              </Link>
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.82rem', color: 'var(--muted)' }}>
          Need assistance? Contact <a href="mailto:support@civicfix.org" style={{ color: 'var(--accent)' }}>support@civicfix.org</a> or call <a href="tel:18002484234" style={{ color: 'var(--accent)' }}>1800-CIVIC-FIX</a>
        </div>
      </div>
    </div>
  );
}

