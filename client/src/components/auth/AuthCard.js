'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function AuthCard({ children, title, subtitle }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full max-w-md px-6 py-12"
    >
      {/* Swiss Minimal Header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <div className="w-16 h-16 bg-text-primary rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md transition-transform hover:scale-105 duration-200 cursor-default">
          <span className="text-accent-primary font-black text-2xl tracking-tighter">G.</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-3">
          {title}
        </h1>
        <p className="text-text-muted font-semibold text-xs tracking-widest uppercase">{subtitle}</p>
      </motion.div>

      {/* Structured Minimal Card */}
      <motion.div 
        variants={itemVariants}
        className="relative bg-white border border-border-subtle p-8 shadow-xl md:p-10"
        style={{ borderRadius: '1rem' }}
      >
        {children}
      </motion.div>
      
      {/* Footer Details */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 flex items-center justify-center gap-4 text-text-muted"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Gateway</span>
        <div className="w-1 h-1 rounded-full bg-border-subtle" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Swiss Minimal</span>
      </motion.div>
    </motion.div>
  );
}

// Exporting variants to be used inside children of AuthCard
export { itemVariants };
