import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CitizenDashboard from './pages/CitizenDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import MyIssues from './pages/MyIssues.jsx';
import ManageIssues from './pages/ManageIssues.jsx';
import IssueDetails from './pages/IssueDetails.jsx';
import Landing from './pages/Landing.jsx';

function PrivateRoute({ children, adminOnly }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: window.location.pathname } }} />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  if (!adminOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <CitizenDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/report"
        element={
          <PrivateRoute>
            <ReportIssue />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-issues"
        element={
          <PrivateRoute>
            <MyIssues />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage"
        element={
          <PrivateRoute adminOnly>
            <ManageIssues />
          </PrivateRoute>
        }
      />
      <Route
        path="/issue/:id"
        element={
          <IssueDetailsRoute />
        }
      />
      <Route path="/" element={<LandingRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function HomeRedirect() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
}

function LandingRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }
  return <Landing />;
}

function IssueDetailsRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: window.location.pathname } }} />;
  }
  return <IssueDetails />;
}
