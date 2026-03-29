'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Bell, 
  Search, 
  ChevronRight, 
  PlayCircle, 
  Calendar,
  Zap,
  Star,
  Sparkles,
  MoreVertical,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const SUBJECTS = [
  { name: 'Quantum Physics', color: 'bg-blue-500', icon: <Zap size={14} /> },
  { name: 'Organic Chem', color: 'bg-purple-500', icon: <Activity size={14} /> },
  { name: 'Linear Algebra', color: 'bg-orange-500', icon: <Star size={14} /> },
  { name: 'Computer Science', color: 'bg-green-500', icon: <BookOpen size={14} /> },
];

const RECENT_LECTURES = [
  { id: 1, topic: 'Introduction to Wave Mechanics', subject: 'Quantum Physics', date: 'Oct 24', duration: '45m', confidence: 98 },
  { id: 2, topic: 'Thermodynamics Laws', subject: 'Organic Chem', date: 'Oct 22', duration: '1h 10m', confidence: 92 },
  { id: 3, topic: 'Vector Spaces & Subspaces', subject: 'Linear Algebra', date: 'Oct 20', duration: '55m', confidence: 95 },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    };
    fetchLectures();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col gap-10 pb-10">
      {/* Background Particles for Continuity (Subtle) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.02, 0.05, 0.02]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            className="absolute h-64 w-64 rounded-full bg-accent-primary blur-[80px]"
          />
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Search & Action Header (Full width within the grid) */}
        <div className="lg:col-span-3 flex items-center justify-between gap-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <Input 
              placeholder="Search lectures, subjects, or notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-[25px] border-none bg-white shadow-sm focus-visible:ring-accent-primary transition-all"
            />
          </div>
          <Button 
            onClick={() => router.push('/student/live')}
            className="bg-accent-primary hover:bg-accent-primary/90 text-white font-black text-xs uppercase tracking-widest px-8 h-14 rounded-[25px] shadow-lg shadow-blue-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105 active:scale-95"
          >
            Join Live Session <Activity size={16} className="animate-pulse" />
          </Button>
        </div>

        {/* LEFT & CENTER: LECTURES & SUBJECTS */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* SUBJECTS GRID */}
          <section className="flex flex-col gap-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">My Subjects</h3>
                <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-accent-primary hover:opacity-70 transition-opacity">View All</Button>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {SUBJECTS.map((subject) => (
                 <Card key={subject.name} className="border-none shadow-none rounded-[30px] neu-flat-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-primary/5 transition-all cursor-pointer group">
                   <CardContent className="p-6 flex flex-col gap-4">
                      <div className={`w-10 h-10 rounded-2xl ${subject.color} text-white flex items-center justify-center shadow-lg shadow-current/20 transition-transform group-hover:scale-110`}>
                        {subject.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-sm tracking-tight text-slate-800 transition-colors group-hover:text-accent-primary">{subject.name}</p>
                        <p className="text-xs font-bold uppercase text-text-muted">12 Lectures</p>
                      </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          </section>

          {/* RECENT LECTURES */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Recent Sessions</h3>
            </div>
            <div className="flex flex-col gap-4">
              {isLoading && (
                <div className="h-24 rounded-[35px] bg-black/5 animate-pulse" />
              )}
              {!isLoading && lectures.length === 0 && (
                <p className="text-center py-10 text-xs font-black uppercase text-text-muted opacity-40">No published lectures yet.</p>
              )}
              {lectures.map((lecture) => (
                <Card 
                  key={lecture.id} 
                  onClick={() => router.push(`/student/notes/${lecture.id}`)}
                  className="border border-transparent shadow-sm rounded-[35px] bg-white hover:shadow-xl hover:border-accent-primary/20 hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden"
                >
                  <CardContent className="p-0 flex items-center h-24">
                    <div className="w-24 h-full bg-slate-50 flex items-center justify-center group-hover:bg-accent-primary/5 transition-colors">
                      <PlayCircle className="text-slate-400 group-hover:text-accent-primary transition-colors" size={32} />
                    </div>
                    <div className="flex-1 px-8 grid grid-cols-3 items-center">
                      <div className="col-span-1">
                        <p className="font-black text-sm text-slate-800 truncate transition-colors group-hover:text-accent-primary">{lecture.topic}</p>
                        <p className="text-xs font-bold uppercase text-text-muted mt-0.5">{lecture.subject || 'General'}</p>
                      </div>
                      <div className="flex items-center gap-6 justify-center text-text-muted">
                        <div className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                           <Calendar size={14} />
                           <span className="text-xs font-black uppercase">{new Date(lecture.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                           <Clock size={14} />
                           <span className="text-xs font-black uppercase">{lecture.duration || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex justify-end pr-4">
                        <Badge variant="secondary" className="bg-blue-50 text-accent-primary border border-transparent group-hover:border-blue-200 rounded-full px-4 py-1.5 flex items-center gap-1.5 transition-all">
                          <Sparkles size={12} className={lecture.confidence > 90 ? "animate-pulse" : ""} />
                          <span className="text-xs font-black uppercase tracking-widest">{lecture.confidence || 100}%</span>
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="mr-6 rounded-full w-10 h-10 neu-flat-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <ChevronRight size={18} className="text-accent-primary" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR: NOTIFICATIONS & STATS */}
        <div className="flex flex-col gap-10">
          
          {/* AI INSIGHTS / NOTIFICATIONS */}
          <section className="flex flex-col gap-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">AI Insights</h3>
                <Bell size={16} className="text-accent-primary animate-bounce-slow" />
             </div>
             <Card className="border border-white/40 shadow-xl shadow-blue-500/5 rounded-[40px] bg-white/60 backdrop-blur-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
               <CardContent className="p-8 space-y-6">
                 <div className="flex gap-4 items-start pb-6 border-b border-black/5 group cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-blue-100 text-accent-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                     <Sparkles size={18} />
                   </div>
                   <div className="space-y-1">
                     <p className="text-sm leading-relaxed font-bold text-slate-800 transition-colors group-hover:text-accent-primary">New summary ready for <span className="underline decoration-2 underline-offset-4">Wave Mechanics</span> lecture.</p>
                     <p className="text-xs font-bold uppercase text-text-muted italic">2 minutes ago</p>
                   </div>
                 </div>

                 <div className="flex gap-4 items-start pb-6 border-b border-black/5 group cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                     <Activity size={18} />
                   </div>
                   <div className="space-y-1">
                     <p className="text-sm leading-relaxed font-bold text-slate-800 transition-colors group-hover:text-purple-600">Professor Smith is currently deep-diving into <span className="text-purple-600">Fourier Transforms</span>.</p>
                     <p className="text-xs font-bold uppercase text-text-muted italic">Active Now</p>
                   </div>
                 </div>

                 <Button 
                  onClick={() => router.push('/student/quiz/1')}
                  variant="outline" 
                  className="w-full rounded-[20px] bg-slate-50 hover:bg-white border hover:border-accent-primary/20 border-transparent h-12 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:pr-2 shadow-sm"
               >
                  <Sparkles size={16} className="text-accent-primary" /> Take Challenge
                  <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
               </Button>
               </CardContent>
             </Card>
          </section>

          {/* LEARNING STATS MOCK */}
          <section className="flex flex-col gap-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Study Streak</h3>
             </div>
             <Card className="border-none shadow-2xl shadow-slate-900/20 rounded-[40px] bg-slate-900 text-white overflow-hidden relative hover:scale-[1.02] transition-transform cursor-default">
               <div className="absolute top-0 right-0 p-6 pointer-events-none">
                 <Zap size={32} className="text-orange-400 fill-orange-400 opacity-20" />
               </div>
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
               <CardContent className="p-10 flex flex-col gap-2 relative z-10">
                  <h4 className="text-6xl font-black italic tracking-tighter">12</h4>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Days Consistent</p>
                  <div className="mt-8 flex items-center gap-1.5">
                    {[1,1,1,1,1,1,0].map((day, i) => (
                      <div key={i} className={`flex-1 h-2 rounded-full transition-all ${day ? 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]' : 'bg-white/10'}`} />
                    ))}
                  </div>
               </CardContent>
             </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
