import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'citizen';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    setLoading(true);

    try {
      const data = await login(email, password);
      const userRole = data.user?.role;

      if (role === 'admin' && userRole !== 'admin') {
        logout();
        setError('Access denied: This account is registered as a Citizen. Please switch to the Citizen Login tab.');
        setLoading(false);
        return;
      }

      if (role === 'citizen' && userRole === 'admin') {
        // Admin logging in on citizen portal - redirect to admin
        navigate('/admin', { replace: true });
        return;
      }

      const to = userRole === 'admin' ? '/admin' : '/dashboard';
      navigate(location.state?.from?.pathname || to, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>CivicFix Portal</span>
        </div>

        {/* Role Toggle Tabs */}
        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab-btn ${role === 'citizen' ? 'active citizen' : ''}`}
            onClick={() => {
              setRole('citizen');
              setError('');
            }}
          >
            👤 Citizen Login
          </button>
          <button
            type="button"
            className={`role-tab-btn ${role === 'admin' ? 'active admin' : ''}`}
            onClick={() => {
              setRole('admin');
              setError('');
            }}
          >
            🛡️ Admin Login
          </button>
        </div>

        {/* Role Portal Banner */}
        {role === 'citizen' ? (
          <div className="role-portal-banner citizen">
            <span>👤</span>
            <div>
              <strong>Citizen Sign In</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Report civic problems with photos, GPS, and track repair lifecycle in real time.
              </div>
            </div>
          </div>
        ) : (
          <div className="role-portal-banner admin">
            <span>🛡️</span>
            <div>
              <strong>Municipal Authority Sign In</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Restricted access for city supervisors, engineers, and municipal field crew dispatch.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.92rem', fontWeight: 700, padding: '8px 10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }} role="alert">
              {error}
            </div>
          )}

          <label className="field">
            <span className="field-label">Email address</span>
            <input
              className="form-control"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder={role === 'admin' ? 'admin@civicfix.gov' : 'citizen@example.com'}
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
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`btn ${role === 'admin' ? 'btn-admin' : 'btn-primary'}`}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Authenticating…' : (role === 'admin' ? 'Sign in to Admin Dashboard →' : 'Sign in to Citizen Portal →')}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
          {role === 'citizen' ? (
            <p style={{ margin: 0 }}>
              Don't have an account? <Link to="/register?role=citizen">Register as Citizen</Link>
            </p>
          ) : (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.82rem' }}>
              🔒 Authorized staff accounts only. Contact city IT for access.
            </p>
          )}

          <Link
            to={role === 'admin' ? '/login?role=citizen' : '/login?role=admin'}
            style={{ color: '#93c5fd', textDecoration: 'none', fontSize: '0.82rem' }}
          >
            Switch to {role === 'admin' ? 'Citizen' : 'Admin'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
