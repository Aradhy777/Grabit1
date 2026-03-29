'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter,
  Users,
  BarChart3,
  Settings,
  Bell,
  Sparkles,
  Play,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import LectureCard from './LectureCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const secretKey = process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';
        const res = await fetch('http://localhost:4000/api/lectures', {
          headers: { 'X-API-KEY': secretKey }
        });
        const data = await res.json();
        setLectures(data.lectures || []);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col gap-12 pb-20">
      {/* Background Particles for Continuity */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 60 - 30, 0],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 4,
            }}
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
            className="absolute h-96 w-96 rounded-full bg-accent-primary blur-[120px]"
          />
        ))}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid grid-cols-12 gap-10"
      >
        {/* MAIN CONTENT AREA */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-12">
          
          {/* GREETING & START CTA */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 dark:bg-slate-900/40 rounded-[50px] p-12 relative overflow-hidden group shadow-2xl border border-white/5 backdrop-blur-3xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/20 blur-[100px] -mr-48 -mt-48 rounded-full animate-bg-pan" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] -ml-32 -mb-32 rounded-full" />
            
            <div className="relative space-y-2 z-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-white tracking-tighter italic">Welcome back, Professor!</h1>
              <p className="text-white/50 text-[11px] font-black uppercase tracking-[0.3em]">Your AI assistant is ready for the next breakthrough.</p>
            </div>

            <Button 
              onClick={() => router.push('/teacher/live')}
              className="relative z-10 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-[0.2em] px-10 h-16 rounded-[25px] flex items-center gap-4 group transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
            >
              Start New Lecture <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/40"><Plus size={18} strokeWidth={3} /></div>
            </Button>
          </motion.div>

          {/* SEARCH & FILTERS BAR */}
          <motion.div variants={itemVariants} className="flex items-center justify-between gap-6 mr-4">
            <div className="relative flex-1 max-w-xl">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
               <Input 
                  placeholder="Search sessions, topics..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-16 rounded-[30px] border-none bg-white dark:bg-slate-800 shadow-sm focus-visible:ring-accent-primary font-bold text-sm transition-all focus:shadow-xl dark:focus:shadow-blue-500/5" 
               />
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-none bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <Filter size={20} className="text-text-muted" />
               </Button>
               <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-none bg-accent-primary text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                  <LayoutGrid size={20} />
               </Button>
            </div>
          </motion.div>

          {/* LECTURE FEED */}
          <section className="flex flex-col gap-6">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Recent Sessions</h3>
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-accent-primary hover:tracking-[0.4em] transition-all">View All History</Button>
             </div>
             
             <div className="flex flex-col gap-5">
               {loading ? (
                 [...Array(3)].map((_, i) => (
                    <div key={i} className="h-28 rounded-[35px] bg-white/40 dark:bg-slate-800/40 animate-pulse" />
                 ))
               ) : lectures.length === 0 ? (
                 <div className="py-20 flex flex-col items-center justify-center text-center gap-4 opacity-40">
                    <Activity size={48} className="text-text-muted" />
                    <p className="text-xs font-black uppercase tracking-widest text-text-muted">No sessions synchronized yet.</p>
                 </div>
               ) : (
                 lectures.map((lecture) => (
                   <motion.div key={lecture.id} variants={itemVariants}>
                     <LectureCard 
                        lecture={lecture} 
                        onReview={(id) => router.push(`/teacher/review/${id}`)}
                     />
                   </motion.div>
                 ))
               )}
             </div>
          </section>

        </div>

        {/* RIGHT SIDEBAR STATS */}
        <div className="hidden xl:col-span-3 xl:flex flex-col gap-10">
          
          {/* QUICK STATS PANEL */}
          <motion.section variants={itemVariants} className="flex flex-col gap-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-2">Performance Insights</h3>
             
             <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[45px] bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl p-8 space-y-8 border border-white/40 dark:border-white/5 transition-colors">
                <div className="flex items-center justify-between group cursor-default">
                   <div className="space-y-1">
                      <p className="text-3xl font-black italic tracking-tighter text-slate-800 dark:text-white group-hover:text-accent-primary transition-colors">482</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Total Learners</p>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-accent-primary flex items-center justify-center transition-transform group-hover:scale-110">
                      <Users size={20} />
                   </div>
                </div>

                <div className="flex items-center justify-between group cursor-default">
                   <div className="space-y-1">
                      <p className="text-3xl font-black italic tracking-tighter text-slate-800 dark:text-white group-hover:text-purple-500 transition-colors">94%</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Avg. Satisfaction</p>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Sparkles size={20} />
                   </div>
                </div>

                <div className="pt-6 border-t border-black/5 dark:border-white/5">
                   <Button 
                   onClick={() => router.push('/teacher/analytics')}
                   className="w-full bg-slate-50 dark:bg-slate-900/50 border-none text-slate-600 dark:text-slate-400 hover:bg-accent-primary hover:text-white rounded-[20px] h-12 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                 >
                   <BarChart3 size={16} /> Data Explorer <ArrowUpRight size={14} className="ml-auto" />
                 </Button>
                </div>
             </Card>
          </motion.section>

          {/* UPCOMING / SCHEDULE */}
          <motion.section variants={itemVariants} className="flex flex-col gap-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-2">Lecture Schedule</h3>
             
             <div className="flex flex-col gap-4">
                <Card className="border-none shadow-sm rounded-[30px] bg-white dark:bg-slate-800 hover:translate-x-2 transition-transform cursor-pointer border-l-4 border-l-accent-primary group">
                   <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase text-accent-primary tracking-widest leading-none mb-1.5">14:00 - 15:30</p>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[120px]">Solid State Physics</p>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-accent-primary transition-all group-hover:scale-110 group-hover:bg-accent-primary group-hover:text-white">
                         <Play size={14} fill="currentColor" />
                      </Button>
                   </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[30px] bg-white/50 dark:bg-slate-800/50 hover:translate-x-2 transition-transform cursor-pointer border-l-4 border-l-transparent group">
                   <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase text-text-muted tracking-widest leading-none mb-1.5">16:30 - 18:00</p>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[120px]">Nuclear Theory</p>
                      </div>
                      <Settings size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                   </CardContent>
                </Card>
             </div>
          </motion.section>

        </div>
      </motion.div>
    </div>
  );
}
