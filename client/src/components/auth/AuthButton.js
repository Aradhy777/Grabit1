'use client';

import { motion } from 'framer-motion';
import { Loader2, MoveRight } from 'lucide-react';
import { itemVariants } from './AuthCard';

export function AuthButton({ loading, children, ...props }) {
  return (
    <motion.button 
      variants={itemVariants}
      disabled={loading}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-accent-primary py-3.5 font-bold text-sm text-white shadow-md shadow-accent-glow transition-all hover:bg-accent-primary/90 disabled:opacity-50"
      {...props}
    >
      <div className="relative z-10 flex flex-1 items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="animate-spin text-white" size={20} />
        ) : (
          <>
            <span>{children}</span>
            <MoveRight size={18} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </div>
    </motion.button>
  );
}
