'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Calendar,
  Filter,
  Download,
  Brain,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ENGAGEMENT_DATA = [45, 52, 48, 70, 65, 85, 80, 75, 92, 88, 95, 90];
const WEAK_TOPICS = [
  { topic: "Quantum Superposition", accuracy: 42, studentsAtRisk: 12, trend: 'down' },
  { topic: "Schrödinger Equation", accuracy: 58, studentsAtRisk: 8, trend: 'up' },
  { topic: "Wave-Particle Duality", accuracy: 65, studentsAtRisk: 5, trend: 'up' }
];

export default function TeacherAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER: TITLES & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-10 rounded-[40px] shadow-sm border border-black/5">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-primary text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                 <BarChart3 size={20} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-primary">Academic Intelligence</h3>
           </div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Cohort Insights</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-[20px]">
            {['24h', '7d', '30d'].map((range) => (
              <Button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`h-10 px-6 rounded-[15px] font-black text-[10px] uppercase tracking-widest transition-all ${timeRange === range ? 'bg-slate-900 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:text-slate-900'}`}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-[20px] bg-slate-50 border-none flex items-center justify-center text-slate-500 hover:text-slate-900">
             <Download size={18} />
          </Button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Engagement', value: '88%', delta: '+12%', icon: Users, color: 'blue' },
          { label: 'Content Mastery', value: '74%', delta: '-3%', icon: Brain, color: 'purple' },
          { label: 'Lecture Attendance', value: '92%', delta: '+1%', icon: Calendar, color: 'green' },
          { label: 'Question Volume', value: '452', delta: '+22%', icon: MessageCircle, color: 'orange' }
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[35px] bg-white group hover:shadow-xl transition-all duration-500">
            <CardContent className="p-8 space-y-4">
               <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                     <kpi.icon size={22} />
                  </div>
                  <Badge className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest ${kpi.delta.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {kpi.delta.startsWith('+') ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />}
                    {kpi.delta}
                  </Badge>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1">{kpi.label}</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ENGAGEMENT PULSE CHART */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[45px] bg-white p-10 space-y-8 overflow-hidden relative">
          <div className="flex items-center justify-between relative z-10">
             <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Engagement Pulse</h4>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Aggregate participation across all platforms</p>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Live Trend</span>
             </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-1 relative overflow-hidden group">
             {/* Custom SVG Line Chart */}
             <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                   <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <path 
                  d={`M 0 100 ${ENGAGEMENT_DATA.map((val, i) => `L ${(i / (ENGAGEMENT_DATA.length - 1)) * 100} ${100 - val}`).join(' ')} L 100 100 Z`} 
                  fill="url(#lineGrad)" 
                  className="opacity-10"
                />
                <path 
                  d={`M 0 ${100 - ENGAGEMENT_DATA[0]} ${ENGAGEMENT_DATA.map((val, i) => `L ${(i / (ENGAGEMENT_DATA.length - 1)) * 100} ${100 - val}`).join(' ')}`} 
                  fill="none" 
                  stroke="var(--accent-primary)" 
                  strokeWidth="0.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="drop-shadow-xl shadow-blue-500"
                />
             </svg>
             
             {/* Interaction overlays */}
             {ENGAGEMENT_DATA.map((val, i) => (
                <div key={i} className="flex-1 group h-full relative z-10 cursor-pointer">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-0 group-hover:h-full bg-accent-primary/20 transition-all rounded-full" />
                   <div 
                     className="absolute w-2 h-2 rounded-full bg-white border-2 border-accent-primary opacity-0 group-hover:opacity-100 transition-opacity z-20"
                     style={{ bottom: `${val}%`, left: '50%', transform: 'translate(-50%, 50%)' }}
                   />
                </div>
             ))}
          </div>

          <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest pt-4 border-t border-black/5">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </Card>

        {/* CONCEPT WEAKNESS MAP */}
        <Card className="border-none shadow-sm rounded-[45px] bg-slate-900 p-10 text-white space-y-8">
           <div className="space-y-1">
              <h4 className="text-xl font-black tracking-tight italic">Concept Weakness Map</h4>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Where students need intervention</p>
           </div>

           <div className="flex flex-col gap-6">
              {WEAK_TOPICS.map((topic, i) => (
                <div key={i} className="space-y-3 group">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                         <AlertTriangle size={12} className={topic.accuracy < 50 ? 'text-red-400' : 'text-amber-400'} />
                         {topic.topic}
                      </span>
                      <span className={topic.accuracy < 50 ? 'text-red-400 text-lg' : 'text-amber-400 text-lg'}>{topic.accuracy}% Accuracy</span>
                   </div>
                   <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${topic.accuracy < 50 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`} 
                        style={{ width: `${topic.accuracy}%` }} 
                      />
                   </div>
                   <p className="text-[9px] font-bold text-white/30 tracking-tight italic group-hover:text-white/60 transition-colors">
                     Affected: {topic.studentsAtRisk} Students • Primary reason: Conceptual overlap confusion
                   </p>
                </div>
              ))}
           </div>

           <Button className="w-full h-14 rounded-[20px] bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 shadow-xl shadow-black/20">
              Generate Refresher Content
           </Button>
        </Card>
      </div>

      {/* ATTENDANCE & RECENT SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-none shadow-sm rounded-[45px] bg-white p-10 space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Upcoming Interventions</h4>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AI Suggested Review Sessions</p>
                </div>
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-accent-primary">View All <ChevronRight size={14} /></Button>
            </div>
            
            <div className="flex flex-col gap-4">
               {[
                 { title: 'Remedial: Wave Functions', count: 12, time: 'Tomorrow, 10:00 AM', priority: 'High' },
                 { title: 'Quiz Feedback: Relativity', count: 45, time: 'Wed, 2:00 PM', priority: 'Normal' }
               ].map((item, i) => (
                 <div key={i} className="p-6 rounded-[30px] bg-slate-50 border border-black/5 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                       <div className={`w-12 h-12 rounded-2xl bg-${item.priority === 'High' ? 'red' : 'blue'}-100 text-${item.priority === 'High' ? 'red' : 'blue'}-600 flex items-center justify-center shrink-0`}>
                          <Clock size={22} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">{item.time}</p>
                          <p className="text-sm font-black text-slate-800 tracking-tight">{item.title}</p>
                       </div>
                    </div>
                    <Badge className="bg-white border-black/5 text-slate-500 rounded-full px-4 text-[9px] font-black shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">
                       {item.count} Students
                    </Badge>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="border-none shadow-sm rounded-[45px] bg-blue-50/50 border border-blue-100 p-10 space-y-8 flex flex-col justify-center items-center text-center">
             <div className="w-20 h-20 rounded-[30px] bg-white text-accent-primary flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-0 bg-accent-primary/20 blur-2xl animate-pulse rounded-full" />
                <Brain size={40} className="relative z-10" />
             </div>
             <div className="space-y-3 max-w-sm">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">Teaching Strategy Alpha</h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                   "Based on current data, shift focus to visual aids for 'Superposition'. Increasing spatial diagrams by 20% in the next session could improve mastery by 15%."
                </p>
             </div>
             <Button className="h-14 px-10 rounded-[20px] bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-black/10">
                Apply Recommended Strategy
             </Button>
         </Card>
      </div>

    </div>
  );
}
