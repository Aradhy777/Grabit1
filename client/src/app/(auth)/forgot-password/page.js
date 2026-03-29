'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard, itemVariants } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Request Email, 2: Reset Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    new_password: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${FASTAPI_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to send reset code');
      }

      setStatus({ 
        type: 'success', 
        message: `Code generated! (Dev Mode OTP: ${data.dev_otp})` 
      });
      setStep(2);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${FASTAPI_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          new_password: formData.new_password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setStatus({ type: 'success', message: 'Password reset successful! Redirecting to login...' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard 
        title={<>Recover <span className="text-accent-primary italic">Access</span></>}
        subtitle={step === 1 ? "Enter your email to receive a secure reset code" : "Enter your code and a new security key"}
      >
        <AnimatePresence mode="wait">
          {status.message && (
            <motion.div 
              key={status.message}
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

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestOtp} 
              className="space-y-6"
            >
              <AuthInput
                label="Email Identity"
                icon={Mail}
                type="email"
                required
                placeholder="name@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />

              <AuthButton loading={loading}>
                Send Reset Code
              </AuthButton>
            </motion.form>
          ) : (
            <motion.form 
              key="step-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleResetPassword} 
              className="space-y-6"
            >
              <AuthInput
                label="6-Digit Reset Code"
                icon={KeyRound}
                type="text"
                required
                placeholder="123456"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
              />

              <AuthInput
                label="New Security Key"
                icon={Lock}
                type="password"
                required
                placeholder="••••••••"
                value={formData.new_password}
                onChange={(e) => setFormData({...formData, new_password: e.target.value})}
              />

              <AuthButton loading={loading}>
                Confirm New Password
              </AuthButton>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.p variants={itemVariants} className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
          Remembered it? <Link href="/login" className="text-accent-primary hover:opacity-70 transition-all">Back to Login</Link>
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
