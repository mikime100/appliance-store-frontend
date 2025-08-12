import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const { isAdmin } = useSelector((state) => state.auth);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
