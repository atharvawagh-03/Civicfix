export default function StatusBadge({ status }) {
  return (
    <span className="status-badge" data-status={status}>
      {status === 'pending' ? 'Pending' : status === 'in_progress' ? 'In progress' : status === 'resolved' ? 'Resolved' : status}
    </span>
  );
}
