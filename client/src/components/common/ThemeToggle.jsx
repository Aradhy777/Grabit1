'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Sync with system or localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('grabit-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('grabit-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('grabit-theme', 'light');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group border border-transparent dark:border-white/5"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="text-blue-400 fill-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" size={24} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="text-amber-500 fill-amber-500 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
