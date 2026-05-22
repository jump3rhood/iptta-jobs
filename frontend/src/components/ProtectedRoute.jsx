import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext.jsx';

export default function ProtectedRoute({ children }) {
  const { token } = useAdmin();
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}
