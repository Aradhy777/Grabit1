'use client';

import SharedLayout from '@/app/(shared)/layout';
import AIQuestionAnswer from '@/components/student/AIQuestionAnswer';

export default function StudentAskPage() {
  return (
    <SharedLayout>
       <AIQuestionAnswer />
    </SharedLayout>
  );
}
