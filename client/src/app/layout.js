import './globals.css';
import AppLoader from '@/components/AppLoader';

export const metadata = {
  title: 'Grabit - Lecture Notes & Highlights',
  description: 'AI-powered lecture transcription and notes generation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans text-text-primary bg-base">
        <AppLoader>{children}</AppLoader>
      </body>
    </html>
  );
}
