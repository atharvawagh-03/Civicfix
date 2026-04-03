import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { TopNav } from '../components/Layout.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import api, { fetchIssues, updateIssue } from '../api/client.js';

export default function ManageIssues() {
  const [issues, setIssues] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status: 'pending', assignedTo: '', comment: '' });

  async function load() {
    const params = statusFilter ? { status: statusFilter } : {};
    const [iss, adm] = await Promise.all([
      fetchIssues(params),
      api.get('/admin-users').then((r) => r.data),
    ]);
    setIssues(iss);
    setAdmins(adm);
  }

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  function openModal(issue) {
    setModal(issue);
    setForm({
      status: issue.status,
      assignedTo: issue.assignedTo?._id || issue.assignedTo || '',
      comment: '',
    });
  }

  async function saveModal() {
    if (!modal) return;
    setSaving(true);
    try {
      const body = {};
      if (form.status) body.status = form.status;
      body.assignedTo = form.assignedTo || null;
      if (form.comment.trim()) body.comment = form.comment.trim();
      await updateIssue(modal.issueId, body);
      setModal(null);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <TopNav title="Manage issues" />
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--muted)' }}>Filter:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={sel}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
                <th style={th}>Title</th>
                <th style={th}>Reporter</th>
                <th style={th}>Status</th>
                <th style={th}>Assigned</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {issues.map((i) => (
                <tr key={i.issueId} style={{ borderTop: '1px solid var(--surface2)' }}>
                  <td style={td}>
                    <Link to={`/issue/${i.issueId}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      {i.title}
                    </Link>
                  </td>
                  <td style={td}>{i.createdBy?.name}</td>
                  <td style={td}>
                    <StatusBadge status={i.status} />
                  </td>
                  <td style={td}>{i.assignedTo?.name || '—'}</td>
                  <td style={td}>
                    <button type="button" onClick={() => openModal(i)} style={btnSm}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {issues.length === 0 && <p style={{ color: 'var(--muted)', padding: '1rem 0' }}>No issues.</p>}
        </div>
      )}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            zIndex: 1000,
          }}
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 12,
              padding: '1.5rem',
              maxWidth: 420,
              width: '100%',
              border: '1px solid var(--surface2)',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>Update issue</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{modal.title}</p>
            <label style={{ display: 'block', marginTop: 12 }}>
              <span style={lab}>Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                style={inp}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>
            <label style={{ display: 'block', marginTop: 12 }}>
              <span style={lab}>Assign to</span>
              <select
                value={form.assignedTo}
                onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                style={inp}
              >
                <option value="">— Unassigned —</option>
                {admins.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'block', marginTop: 12 }}>
              <span style={lab}>Comment / note</span>
              <textarea
                rows={3}
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                style={{ ...inp, resize: 'vertical' }}
                placeholder="Optional note (logged on timeline)"
              />
            </label>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModal(null)} style={{ ...btnSm, background: 'transparent' }}>
                Cancel
              </button>
              <button type="button" onClick={saveModal} disabled={saving} style={btnSm}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

const th = { padding: '0.5rem 0.75rem', fontWeight: 500 };
const td = { padding: '0.65rem 0.75rem', verticalAlign: 'middle' };
const sel = {
  padding: '0.45rem 0.75rem',
  borderRadius: 8,
  border: '1px solid var(--surface2)',
  background: 'var(--surface)',
  color: 'var(--text)',
};
const lab = { display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--muted)' };
const inp = {
  width: '100%',
  padding: '0.5rem 0.65rem',
  borderRadius: 8,
  border: '1px solid var(--surface2)',
  background: 'var(--bg)',
  color: 'var(--text)',
};
const btnSm = {
  padding: '0.45rem 0.85rem',
  borderRadius: 8,
  border: '1px solid var(--surface2)',
  background: 'var(--accent)',
  color: '#fff',
  fontWeight: 600,
};
