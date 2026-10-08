import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/States';

/** Client-side guard. Real enforcement is in firestore.rules (role checked server-side). */
export default function ProtectedRoute({ adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/app" replace />;
  return <Outlet />;
}
