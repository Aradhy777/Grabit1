"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AppLoader({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Grabit AI...");
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const MIN_LOAD_TIME = 2500; // 2.5s to show off branding
    const MAX_WAIT_TIME = 10000; // 10s fallback

    // Health Check with Retry-Logic
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026'
          }
        });
        
        if (response.ok) {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
          
          setTimeout(() => {
            setIsReady(true);
            setTimeout(() => setShowApp(true), 600);
          }, remaining);
        } else {
          throw new Error("Backend not ready");
        }
      } catch (err) {
        setErrorCount((prev) => prev + 1);
        setTimeout(checkHealth, Math.min(2000, 500 * (errorCount + 1)));
      }
    };

    const textInterval = setInterval(() => {
      const texts = [
        "Connecting to Core Brain...",
        "Syncing Classroom Intelligence...",
        "Optimizing AI Pipeline...",
        "Ready to Launch."
      ];
      setLoadingText((prev) => {
        const idx = texts.indexOf(prev);
        return texts[(idx + 1) % texts.length];
      });
    }, 2500);

    checkHealth();

    const fallback = setTimeout(() => {
      console.warn("❌ Loading gate timeout - falling back to app entry.");
      setIsReady(true);
      setShowApp(true);
    }, MAX_WAIT_TIME);

    return () => {
      clearTimeout(fallback);
      clearInterval(textInterval);
    };
  }, [errorCount]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isReady && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent"
          >
            {/* Logo Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 neu-flat rounded-3xl flex items-center justify-center text-accent-primary mx-auto mb-10 shadow-2xl shadow-blue-500/10 relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles size={48} fill="currentColor" />
                </motion.div>
                
                {/* Subtle outer pulse */}
                <div className="absolute inset-0 rounded-3xl border border-white/40 animate-pulse" />
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-text-primary">
                GRABIT <span className="text-accent-primary italic">AI</span>
              </h1>
              
              <div className="flex flex-col items-center gap-6">
                <p className="text-text-muted font-bold tracking-wide italic h-6">
                  {loadingText}
                </p>
                
                {/* Neomorphic Progress Bar */}
                <div className="w-64 h-3 neu-pressed rounded-full overflow-hidden p-[2px]">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: isReady ? 0.6 : 10, ease: "easeInOut" }}
                    className="h-full bg-accent-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Bottom Branding Matching Footer */}
            <div className="absolute bottom-12 flex items-center gap-6 opacity-40">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Built for AI Scaling</span>
               <div className="w-1 h-1 rounded-full bg-text-muted" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Microservice Tech</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={showApp ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
