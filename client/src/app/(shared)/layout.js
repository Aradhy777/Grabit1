'use client';

import { Sparkles, User, Link as LucideLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function SharedLayout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('grabit_token');
      if (!token) return;
      try {
        const res = await fetch('/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) { 
        console.error("Fetch user error:", err); 
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('grabit_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-base dark:bg-slate-950 text-text-primary transition-colors duration-500 font-sans flex flex-col">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 w-full px-6 lg:px-10 py-4 flex items-center justify-between border-b border-transparent dark:border-white/5 bg-base/80 dark:bg-slate-950/80 backdrop-blur-2xl transition-all h-[80px]">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-accent-primary flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">GRABIT<span className="text-accent-primary">AI</span></h1>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Intelligence Hub</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {[
            { name: 'Dashboard', path: user?.role === 'teacher' ? '/teacher' : '/student' },
            { name: 'Live Sessions', path: '/live' },
            { name: 'Resources', path: '/resources' }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-accent-primary hover:tracking-[0.3em] ${pathname === item.path ? 'text-accent-primary' : 'text-text-muted'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          
          <AnimatePresence>
            {user && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 pl-6 border-l border-black/5 dark:border-white/10"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200">{user.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 group transition-all shadow-sm hover:shadow-md"
                >
                  <User size={20} className="text-text-muted group-hover:text-red-500 transition-colors" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 md:p-10 relative z-10">
        {children}
      </main>

      {/* FOOTER (Subtle) */}
      <footer className="p-10 flex flex-col items-center justify-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
        <div className="h-px w-20 bg-text-muted" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-text-muted text-center">
            Designed for Excellence. Built with Grabit Intelligence.
        </p>
      </footer>
    </div>
  );
}
