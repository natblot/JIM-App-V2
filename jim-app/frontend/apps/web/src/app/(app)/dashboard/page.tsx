import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';

// Route protegee par AuthGuard dans (app)/layout.tsx
export const metadata = { title: 'Dashboard | JIM' };

export default function DashboardPage() {
  return <DashboardLayout />;
}
