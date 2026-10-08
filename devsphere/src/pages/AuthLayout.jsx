import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { isConfigured } from '../services/firebase/config';
import { PageLoader } from '../components/ui/States';

/** Firebase + auth are only loaded for routes under this layout — never for the public homepage. */
export default function AuthLayout() {
  if (!isConfigured) {
    return <div className="center"><div className="card state"><h2>Firebase is not configured</h2>
      <p className="muted">Copy <code>.env.example</code> to <code>.env</code>, fill in your Firebase web app keys and restart <code>npm run dev</code>.</p></div></div>;
  }
  return <AuthProvider><Suspense fallback={<PageLoader />}><Outlet /></Suspense></AuthProvider>;
}
