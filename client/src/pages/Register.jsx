import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
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
      const data = await register({ name, email, password, role });
      const user = data.user;

      if (!user) {
        setError('Registration failed');
        return;
      }

      navigate(user.role === 'admin' ? '/admin' : '/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || 'Registration failed');
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

        <h1>Create account</h1>
        <p style={{ marginTop: 2, marginBottom: '1.2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Join CivicFix to report issues or manage municipal responses.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.95rem', fontWeight: 750 }} role="alert">
              {error}
            </div>
          )}

          <label className="field">
            <span className="field-label">Full Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="e.g. Alex Morgan"
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
              placeholder="name@example.com"
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
              <option value="citizen">👤 Citizen (Report & track civic issues)</option>
              <option value="admin">🛡️ Admin (Municipal authority & field supervisor)</option>
            </select>
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
            {loading ? 'Creating…' : 'Register Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.15rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to={`/login?role=${role}`}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
