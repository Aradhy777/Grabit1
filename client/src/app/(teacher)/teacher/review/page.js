'use client';

import SharedLayout from '@/app/(shared)/layout';
import NotesReview from '@/components/teacher/NotesReview';

export default function ReviewPage() {
  return (
    <SharedLayout>
       <NotesReview />
    </SharedLayout>
  );
}
