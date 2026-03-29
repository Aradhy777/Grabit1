'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/utils/auth';

/**
 * AuthGuard Component
 * @param {string} requiredRole - 'teacher' or 'student'
 */
export default function AuthGuard({ children, requiredRole }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('grabit_token');

      if (!token) {
        router.push('/login');
        return;
      }

      const decoded = decodeToken(token);
      
      if (!decoded || (requiredRole && decoded.role !== requiredRole)) {
        console.warn('Unauthorized access attempt:', { requiredRole, userRole: decoded?.role });
        router.push('/login');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router, requiredRole]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-accent-primary" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-text-muted animate-pulse">Verifying Session</p>
            <p className="text-[10px] font-bold text-text-muted/50 uppercase tracking-widest">Grabit Intelligence</p>
          </div>
        </div>
      </div>
    );
  }

  return authorized ? children : null;
}
