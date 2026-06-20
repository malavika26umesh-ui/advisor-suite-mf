import { Navigate, Outlet } from 'react-router-dom';
import { useAdvisorAuth } from '../hooks/useAdvisorAuth';
import { DashboardLayout } from './features/advisor/DashboardLayout';

export default function AdvisorRoute() {
  const { isAuthenticated } = useAdvisorAuth();

  if (!isAuthenticated) {
    return <Navigate to="/advisor/login" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
