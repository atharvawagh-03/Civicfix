import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import api, { fetchIssues, updateIssue } from '../api/client.js';
import { useDocumentTitle } from '../utils/useDocumentTitle.js';
import { IconCheck, IconAlertTriangle } from '../components/Icons.jsx';

export default function ManageIssues() {
  useDocumentTitle('Manage City Issues');
  const [issues, setIssues] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status: 'pending', assignedTo: '', comment: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function load() {
    const params = statusFilter ? { status: statusFilter } : {};
    const [iss, adm] = await Promise.all([
      fetchIssues(params),
      api.get('/admin-users').then((r) => r.data).catch(() => []),
    ]);
    setIssues(iss);
    setAdmins(adm);
  }

  useEffect(() => {
    setLoading(true);
    load()
      .catch((err) => setErrorMsg(err.message || 'Failed to load issues'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  function openModal(issue) {
    setModal(issue);
    setErrorMsg('');
    setForm({
      status: issue.status,
      assignedTo: issue.assignedTo?._id || issue.assignedTo || '',
      comment: '',
    });
  }

  async function saveModal() {
    if (!modal) return;
    setSaving(true);
    setErrorMsg('');
    try {
      const body = {};
      if (form.status) body.status = form.status;
      body.assignedTo = form.assignedTo || null;
      if (form.comment.trim()) body.comment = form.comment.trim();
      await updateIssue(modal.issueId, body);
      setSuccessMsg(`Issue "${modal.title}" was updated successfully.`);
      setModal(null);
      await load();
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (e) {
      setErrorMsg(e.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <TopNav title="Manage issues" />

      {/* Success Notification Banner */}
      {successMsg && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: '#86efac',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem',
          }}
          role="status"
        >
          <IconCheck size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMsg && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem',
          }}
          role="alert"
        >
          <IconAlertTriangle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--muted)', fontWeight: 650 }}>Filter by status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto', minWidth: 160 }}
        >
          <option value="">All Statuses ({issues.length})</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading tickets…</p>
      ) : (
        <div className="card card-pad" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--muted)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={th}>Issue Title</th>
                  <th style={th}>Citizen Reporter</th>
                  <th style={th}>Status</th>
                  <th style={th}>Assigned Crew</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i) => (
                  <tr key={i.issueId} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={td}>
                      <Link to={`/issue/${i.issueId}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>
                        {i.title}
                      </Link>
                    </td>
                    <td style={td}>{i.createdBy?.name || 'Citizen'}</td>
                    <td style={td}>
                      <StatusBadge status={i.status} />
                    </td>
                    <td style={td}>{i.assignedTo?.name || '— Unassigned —'}</td>
                    <td style={td}>
                      <button type="button" onClick={() => openModal(i)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {issues.length === 0 && <p style={{ color: 'var(--muted)', padding: '1.5rem', textAlign: 'center' }}>No issues found matching this filter.</p>}
        </div>
      )}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            zIndex: 1000,
          }}
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div
            className="card card-pad"
            style={{
              maxWidth: 460,
              width: '100%',
              background: 'var(--bg2)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Update issue status</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>{modal.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="btn-modal-close"
                style={{ fontSize: '1.4rem', border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <label className="field" style={{ marginTop: 12 }}>
              <span className="field-label">Resolution Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="form-control"
              >
                <option value="pending">Pending Triage</option>
                <option value="in_progress">In Progress (Crews Dispatched)</option>
                <option value="resolved">Resolved (Repairs Verified)</option>
              </select>
            </label>

            <label className="field" style={{ marginTop: 12 }}>
              <span className="field-label">Assign Municipal Engineer / Crew</span>
              <select
                value={form.assignedTo}
                onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                className="form-control"
              >
                <option value="">— Unassigned —</option>
                {admins.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </label>

            <label className="field" style={{ marginTop: 12 }}>
              <span className="field-label">Internal Dispatch Note / Update</span>
              <textarea
                rows={3}
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                className="form-control"
                style={{ resize: 'vertical' }}
                placeholder="e.g. Dispatched asphalt repair vehicle #4 to location"
              />
            </label>

            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModal(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={saveModal} disabled={saving} className="btn btn-primary">
                {saving ? 'Saving changes…' : 'Save Status Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

const th = { padding: '0.75rem 1rem', fontWeight: 650, fontSize: '0.84rem', letterSpacing: '0.04em', textTransform: 'uppercase' };
const td = { padding: '0.85rem 1rem', verticalAlign: 'middle' };
