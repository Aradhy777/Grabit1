'use client';

import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Presentation } from 'lucide-react';
import Link from 'next/link';
import useStore from '@/store/useStore';

export default function LandingPage() {
  const { setRole } = useStore();

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/20 via-transparent to-transparent">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="w-20 h-20 neu-flat rounded-3xl flex items-center justify-center text-accent-primary mx-auto mb-8 shadow-2xl shadow-blue-500/20">
          <Sparkles size={40} fill="currentColor" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-text-primary">
          Select Your <span className="text-accent-primary italic">Experience</span>
        </h1>
        <p className="text-text-muted font-bold text-lg max-w-lg mx-auto leading-relaxed">
          The next generation of classroom intelligence, tailored for teaching excellence and interactive learning.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
        {/* Teacher Card */}
        <Link href="/teacher" onClick={() => setRole('teacher')}>
          <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative neu-flat p-10 rounded-[40px] cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-3xl"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 neu-pressed rounded-2xl flex items-center justify-center text-accent-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                <Presentation size={32} />
              </div>
              <h2 className="text-3xl font-black mb-3">Instructor</h2>
              <p className="text-text-secondary font-medium mb-8 leading-relaxed">
                Empower your lectures with real-time transcription, automated notes, and live insights.
              </p>
              <div className="flex items-center gap-2 text-accent-primary font-black text-sm uppercase tracking-widest">
                Enter Console <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Student Card */}
        <Link href="/student" onClick={() => setRole('student')}>
          <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative neu-flat p-10 rounded-[40px] cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-3xl"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 neu-pressed rounded-2xl flex items-center justify-center text-accent-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-3xl font-black mb-3">Learner</h2>
              <p className="text-text-secondary font-medium mb-8 leading-relaxed">
                Connect to live lectures, interact with AI assistant, and master concepts faster.
              </p>
              <div className="flex items-center gap-2 text-accent-primary font-black text-sm uppercase tracking-widest">
                Join Class <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      <div className="mt-20 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Built for AI Scaling</span>
         <div className="w-1 h-1 rounded-full bg-text-muted" />
         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Microservice Architecture</span>
      </div>
    </div>
  );
}
