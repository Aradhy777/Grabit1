'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, LayoutDashboard } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard, itemVariants } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${FASTAPI_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Signup failed. Please try again.');
      }

      setStatus({ type: 'success', message: 'Account created! Redirecting to login...' });
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard 
        title={<>Sign <span className="text-accent-primary italic">Up</span></>}
        subtitle="Join Grabit Intelligence"
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Full Name"
            icon={User}
            type="text"
            required
            placeholder="John Doe"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

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
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <AuthInput
            label="Workspace Role"
            icon={LayoutDashboard}
            type="select"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="student">Student Identity</option>
            <option value="teacher">Instructor Identity</option>
          </AuthInput>

          <div className="pt-4">
            <AuthButton loading={loading}>
              Create Identity
            </AuthButton>
          </div>
        </form>

        <motion.p variants={itemVariants} className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
          Already registered? <Link href="/login" className="text-accent-primary hover:opacity-70 transition-all">Login here</Link>
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
