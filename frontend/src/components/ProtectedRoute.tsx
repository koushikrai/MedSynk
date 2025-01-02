import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireHospitalStaff?: boolean;
}

export default function ProtectedRoute({ children, requireHospitalStaff = false }: ProtectedRouteProps) {
  const { user, isHospitalStaff } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireHospitalStaff && !isHospitalStaff) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}