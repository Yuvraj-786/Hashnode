import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingState from '../components/LoadingState';

export default function ProtectedRoute({ children }) {
  const { authStatus } = useAuth();
  const location = useLocation();

  if (authStatus === 'loading') return <LoadingState label="Checking your session…" />;
  if (authStatus === 'guest') return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
