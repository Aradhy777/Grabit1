'use client';

import LectureNotesView from '@/components/student/LectureNotesView';
import { useParams } from 'next/navigation';

export default function StudentNotesDetailsPage() {
  const params = useParams();
  const { id } = params;

  return <LectureNotesView lectureId={id} />;
}
