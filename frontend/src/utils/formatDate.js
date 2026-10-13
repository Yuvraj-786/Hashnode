const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const monthFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' });

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function formatDate(value) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : '';
}

/** e.g. "October 2026" – used to group posts in the archive. */
export function formatMonthYear(value) {
  const date = toDate(value);
  return date ? monthFormatter.format(date) : 'Undated';
}
