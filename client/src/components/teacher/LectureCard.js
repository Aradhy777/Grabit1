'use client';

import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  MoreVertical, 
  BarChart2, 
  BookOpen,
  CheckCircle2,
  Clock3,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';

export default function LectureCard({ lecture, onReview }) {
  const isPublished = lecture.status === 'published' || !!lecture.createdAt;
  const displayDate = lecture.createdAt ? new Date(lecture.createdAt).toLocaleDateString() : (lecture.date || 'TBD');

  return (
    <Card className="border-none shadow-sm rounded-[35px] bg-white dark:bg-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group overflow-hidden border border-black/5 dark:border-white/5 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <CardContent className="p-0 flex items-center h-28 relative z-10">
        {/* ICON / THUMBNAIL AREA */}
        <div className={`w-28 h-full flex items-center justify-center group-hover:scale-110 transition-transform ${isPublished ? 'bg-blue-50 dark:bg-blue-900/20 text-accent-primary' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'}`}>
          {isPublished ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <Clock3 size={32} strokeWidth={2.5} />}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 px-8 grid grid-cols-12 items-center gap-6">
          <div className="col-span-4">
            <p className="font-black text-sm text-slate-800 dark:text-slate-200 truncate leading-tight transition-colors group-hover:text-accent-primary uppercase tracking-tight">{lecture.topic}</p>
            <p className="text-xs font-black uppercase text-text-muted mt-1.5 tracking-[0.1em]">{lecture.subject || 'General'}</p>
          </div>

          <div className="col-span-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-text-muted hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              <Calendar size={14} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-tight">{displayDate}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              <Clock size={14} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-tight">{lecture.duration || 'N/A'}</span>
            </div>
          </div>

          <div className="col-span-3">
             <Badge variant="secondary" className={`border-none rounded-full px-5 py-2 flex items-center gap-2.5 w-fit shadow-sm transition-all group-hover:shadow-md ${isPublished ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                <div className={`w-2 h-2 rounded-full ${isPublished ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-400'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isPublished ? 'Published' : 'Draft'}</span>
             </Badge>
          </div>

          <div className="col-span-2 flex justify-end gap-3 pr-4">
            <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onReview(lecture.id || lecture._id); }}
                className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-text-muted hover:bg-accent-primary hover:text-white transition-all shadow-sm hover:shadow-blue-500/20 group-hover:opacity-100"
            >
              <ChevronRight size={22} strokeWidth={3} />
            </motion.button>
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
