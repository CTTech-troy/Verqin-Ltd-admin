export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getStatusColor(status) {
  if (!status) return 'default';
  const key = String(status).toLowerCase();
  const statusMap = {
    new: 'info',
    reviewed: 'success',
    ignored: 'default',
    contacted: 'warning',
    closed: 'default',
    resolved: 'success',
    potential: 'success',
    'not suitable': 'danger'
  };
  return statusMap[key] || 'default';
}

export function getStatusLabel(status) {
  if (!status) return '';
  const s = String(status);
  return s.charAt(0).toUpperCase() + s.slice(1);
}