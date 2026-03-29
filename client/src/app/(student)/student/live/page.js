'use client';

import SharedLayout from '@/app/(shared)/layout';
import StudentPanel from '@/components/student/StudentPanel';

export default function StudentLivePage() {
  return (
    <SharedLayout>
       <StudentPanel />
    </SharedLayout>
  );
}
