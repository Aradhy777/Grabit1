'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { decodeToken } from '@/utils/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard, itemVariants } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${FASTAPI_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('grabit_token', data.access_token);
      const decoded = decodeToken(data.access_token);
      const role = decoded?.role || 'student';

      setStatus({ type: 'success', message: 'Welcome back! Redirecting...' });

      setTimeout(() => {
        router.push(role === 'teacher' ? '/teacher' : '/student');
      }, 1200);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.message || 'Invalid email or password.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard 
        title={<>Sign <span className="text-accent-primary italic">In</span></>}
        subtitle="Grabit Intelligence"
      >
        <AnimatePresence mode="wait">
          {status.message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-bold text-center ${
                status.type === 'success' 
                  ? 'border-emerald-500/20 bg-emerald-50 text-emerald-600' 
                  : 'border-red-500/20 bg-red-50 text-red-600'
              }`}
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email Identity"
            icon={Mail}
            type="email"
            required
            placeholder="name@university.edu"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <AuthInput
            label="Security Key"
            icon={Lock}
            type="password"
            required
            placeholder="••••••••"
            rightAction={<Link href="/forgot-password" className="text-accent-primary hover:opacity-70 transition-all">Reset?</Link>}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <AuthButton loading={loading}>
            Authenticate
          </AuthButton>
        </form>

        <motion.p variants={itemVariants} className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
          Missing access? <Link href="/signup" className="text-accent-primary hover:opacity-70 transition-all">Register here</Link>
        </motion.p>
      </AuthCard>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </AuthLayout>
  );
}
