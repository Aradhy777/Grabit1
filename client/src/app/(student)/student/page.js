'use client';

import StudentDashboard from '@/components/student/StudentDashboard';
import AuthGuard from '@/components/common/AuthGuard';

export default function Page() {
  return (
    <AuthGuard requiredRole="student">
      <StudentDashboard />
    </AuthGuard>
  );
}
