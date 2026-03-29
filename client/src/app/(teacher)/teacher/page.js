'use client';

import TeacherDashboard from '@/components/teacher/TeacherDashboard';
import AuthGuard from '@/components/common/AuthGuard';

export default function Page() {
  return (
    <AuthGuard requiredRole="teacher">
      <TeacherDashboard />
    </AuthGuard>
  );
}
