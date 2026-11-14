import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';
import { IconUser, IconShield, IconAlertTriangle, IconCheck } from '../components/Icons.jsx';

export default function Login() {
  useDocumentTitle('Sign In');
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'citizen';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'admin' || r === 'citizen') {
      setRole(r);
    }
  }, [location.search]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await login(email, password);
      const userRole = data.user?.role;

      if (role === 'admin' && userRole !== 'admin') {
        logout();
        setError('Access restricted: This account is registered as a Citizen. Please switch to the Citizen Portal.');
        setLoading(false);
        return;
      }

      setSuccess('Authenticated successfully. Redirecting…');

      setTimeout(() => {
        if (role === 'citizen' && userRole === 'admin') {
          navigate('/admin', { replace: true });
          return;
        }

        const to = userRole === 'admin' ? '/admin' : '/dashboard';
        navigate(location.state?.from?.pathname || to, { replace: true });
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>&larr;</span>
            <span>Back to Home</span>
          </Link>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            CivicFix Identity
          </span>
        </div>

        {/* Role Toggle Tabs */}
        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab-btn ${role === 'citizen' ? 'active citizen' : ''}`}
            onClick={() => {
              setRole('citizen');
              setError('');
              setSuccess('');
            }}
          >
            <IconUser size={15} />
            <span>Citizen Portal</span>
          </button>
          <button
            type="button"
            className={`role-tab-btn ${role === 'admin' ? 'active admin' : ''}`}
            onClick={() => {
              setRole('admin');
              setError('');
              setSuccess('');
            }}
          >
            <IconShield size={15} />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Role Context Notification */}
        {role === 'citizen' ? (
          <div className="role-portal-banner citizen">
            <IconUser size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong>Citizen Reporting Access</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Submit civic defects, attach geo-tagged photos, and monitor repair status.
              </div>
            </div>
          </div>
        ) : (
          <div className="role-portal-banner admin">
            <IconShield size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong>Municipal Authority Console</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Restricted access for city supervisors, engineers, and field workforce dispatch.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div
              style={{
                color: '#fca5a5',
                fontSize: '0.88rem',
                padding: '10px 12px',
                background: 'rgba(239, 68, 68, 0.12)',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
              role="alert"
            >
              <IconAlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                color: '#86efac',
                fontSize: '0.88rem',
                padding: '10px 12px',
                background: 'rgba(34, 197, 94, 0.12)',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              role="status"
            >
              <IconCheck size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <label className="field">
            <span className="field-label">Official Email Address</span>
            <input
              className="form-control"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder={role === 'admin' ? 'admin@civicfix.gov' : 'resident@nashik.gov.in'}
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="form-control"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your account password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`btn ${role === 'admin' ? 'btn-admin' : 'btn-primary'}`}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Authenticating…' : (role === 'admin' ? 'Sign in to Authority Console' : 'Sign in to Citizen Portal')}
          </button>
        </form>

        <div style={{ marginTop: '1.4rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', flexWrap: 'wrap', gap: 8 }}>
          {role === 'citizen' ? (
            <p style={{ margin: 0 }}>
              Need an account? <Link to="/register?role=citizen" style={{ color: '#38bdf8' }}>Register as Citizen</Link>
            </p>
          ) : (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.8rem' }}>
              Secured session. Access audited.
            </p>
          )}

          <Link
            to={role === 'admin' ? '/login?role=citizen' : '/login?role=admin'}
            style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.8rem' }}
          >
            Switch to {role === 'admin' ? 'Citizen' : 'Admin'} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
