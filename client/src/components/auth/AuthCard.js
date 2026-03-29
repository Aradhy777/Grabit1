'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export function AuthCard({ children, title, subtitle }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full max-w-md px-6"
    >
      {/* Logo Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 neu-flat rounded-3xl flex items-center justify-center text-accent-primary mx-auto mb-6 shadow-2xl shadow-blue-500/10 border border-white/40"
        >
          <Sparkles size={40} fill="currentColor" className="animate-pulse" />
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-text-primary mb-2">
          {title}
        </h1>
        <p className="text-text-muted font-bold text-sm tracking-widest uppercase">{subtitle}</p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 p-8 shadow-2xl backdrop-blur-2xl md:p-10"
      >
        {/* subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
        
        {children}
        
      </motion.div>
      
      {/* Footer micro-details */}
      <motion.div 
        variants={itemVariants}
        className="mt-10 flex items-center justify-center gap-6 opacity-40"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Built for AI Scaling</span>
        <div className="w-1 h-1 rounded-full bg-text-muted" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">2026 Edition</span>
      </motion.div>
    </motion.div>
  );
}

// Exporting variants to be used inside children of AuthCard
export { itemVariants };
