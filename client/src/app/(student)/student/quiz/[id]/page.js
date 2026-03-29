'use client';

import SharedLayout from '@/app/(shared)/layout';
import QuizPage from '@/components/student/QuizPage';
import { useParams } from 'next/navigation';

export default function StudentQuizDetailsPage() {
  const params = useParams();
  const { id } = params;

  return (
    <SharedLayout>
       <QuizPage lectureId={id} />
    </SharedLayout>
  );
}
