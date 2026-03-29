'use client';

import TeacherDashboard from '@/components/teacher/TeacherDashboard';
import AuthGuard from '@/components/common/AuthGuard';
import DashboardNavbar from '@/components/common/DashboardNavbar';

export default function Page() {
  return (
    <AuthGuard requiredRole="teacher">
      <div className="min-h-screen bg-[#E0E0E0]">
        <DashboardNavbar role="Teacher" />
        <main className="container mx-auto px-10 pb-20">
          <TeacherDashboard />
        </main>
      </div>
    </AuthGuard>
  );
}
