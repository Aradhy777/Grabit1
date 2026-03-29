'use client';

import SharedLayout from '@/app/(shared)/layout';
import TeacherPanel from '@/components/teacher/TeacherPanel';

export default function TeacherLivePage() {
  return (
    <SharedLayout>
       <TeacherPanel />
    </SharedLayout>
  );
}
