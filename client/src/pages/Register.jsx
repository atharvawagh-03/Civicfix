import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';
import { IconCheck, IconAlertTriangle } from '../components/Icons.jsx';

export default function Register() {
  useDocumentTitle('Create Account');
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const defaultRole = searchParams.get('role') === 'admin' ? 'admin' : 'citizen';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
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
      const data = await register({ name, email, password, role });
      const user = data.user;

      if (!user) {
        setError('Registration could not be completed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully! Preparing your dashboard…');
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin' : '/dashboard', {
          replace: true,
        });
      }, 500);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed. Please check the details provided.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
            &larr; Back to Home
          </Link>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>CivicFix Portal</span>
        </div>

        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Create account</h1>
        <p style={{ marginTop: 2, marginBottom: '1.2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Join CivicFix to report issues or manage municipal responses.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                alignItems: 'center',
                gap: 8,
              }}
              role="alert"
            >
              <IconAlertTriangle size={16} style={{ flexShrink: 0 }} />
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
            <span className="field-label">Full Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="e.g. Ramesh Patil"
            />
          </label>

          <label className="field">
            <span className="field-label">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="e.g. ramesh.patil@nashik.gov.in"
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="At least 6 characters"
            />
          </label>

          <label className="field">
            <span className="field-label">Account Type / Portal</span>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
              <option value="citizen">Citizen (Resident reporting & tracking)</option>
              <option value="admin">Administrator (Municipal staff & supervisor)</option>
            </select>
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
            {loading ? 'Creating…' : 'Register Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.15rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Already have an account? <Link to={`/login?role=${role}`} style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
