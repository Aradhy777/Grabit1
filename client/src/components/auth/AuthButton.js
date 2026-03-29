'use client';

import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { itemVariants } from './AuthCard';

export function AuthButton({ loading, children, ...props }) {
  return (
    <motion.button 
      variants={itemVariants}
      disabled={loading}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full overflow-hidden rounded-2xl bg-accent-primary py-4 font-black text-sm uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-600 disabled:opacity-50 group"
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <span>{children}</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
    </motion.button>
  );
}
