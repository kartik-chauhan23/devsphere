export const toDate = (ts) => (ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null);
export const fmtDate = (ts) => toDate(ts)?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) ?? '—';
export const fmtDateTime = (ts) => toDate(ts)?.toLocaleString() ?? '—';
export const initials = (s = '?') => s.trim().slice(0, 1).toUpperCase();

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found for that email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};
export const authMessage = (e) => AUTH_ERRORS[e?.code] || e?.message || 'Something went wrong.';
