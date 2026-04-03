import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function navClass({ isActive }) {
  return `nav-link ${isActive ? 'nav-link-active' : ''}`;
}

export default function Layout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const citizenLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/report', label: 'Report issue' },
    { to: '/my-issues', label: 'My issues' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin dashboard' },
    { to: '/manage', label: 'Manage issues' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="app-header">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="app-brand">
          CivicFix
        </Link>
        <span className="app-user">{user?.email}</span>
      </header>

      <div className="app-shell" style={{ flex: 1 }}>
        <aside className="side-nav">
          <div className="side-title">
            <strong>CivicFix</strong>
            <div className="side-role">
              {user?.name}
              <span style={{ display: 'block', textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {!isAdmin &&
              citizenLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className={navClass} end={l.to === '/dashboard'}>
                  {l.label}
                </NavLink>
              ))}
            {isAdmin &&
              adminLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className={navClass}>
                  {l.label}
                </NavLink>
              ))}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: 10 }}>
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

        <div className="main-area">{children}</div>
      </div>
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
