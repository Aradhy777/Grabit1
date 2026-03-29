'use client';

import StudentDashboard from '@/components/student/StudentDashboard';
import AuthGuard from '@/components/common/AuthGuard';
import DashboardNavbar from '@/components/common/DashboardNavbar';

export default function Page() {
  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-[#E0E0E0]">
        <DashboardNavbar role="Student" />
        <main className="container mx-auto px-10 pb-20">
          <StudentDashboard />
        </main>
      </div>
    </AuthGuard>
  );
}
