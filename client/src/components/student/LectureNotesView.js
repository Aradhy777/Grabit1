'use client';

import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Zap,
  Info,
  CheckCircle2,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LectureNotesView({ lectureId }) {
  const router = useRouter();

  // Mock data for the demonstration
  const lecture = {
    title: "Introduction to Wave Mechanics",
    subject: "Quantum Physics",
    date: "Oct 24, 2023",
    instructor: "Dr. Elena Vance",
    summary: "Wave mechanics, also known as quantum mechanics, is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. This session covered the transition from classical particle behavior to the wave-like nature of matter, introducing the Schrödinger equation and the concept of wave-particle duality.",
    concepts: [
      { id: 1, title: "Wave-Particle Duality", description: "The concept that every elementary particle or quantic entity may be partly described in terms not only of particles, but also of waves.", icon: <Zap size={16} /> },
      { id: 2, title: "Schrödinger Equation", description: "A linear partial differential equation that governs the wave function of a quantum-mechanical system.", icon: <Lightbulb size={16} /> },
      { id: 3, title: "Heisenberg Uncertainty Principle", description: "A fundamental limit to the precision with which certain pairs of physical properties of a particle can be known.", icon: <Info size={16} /> }
    ],
    definitions: [
      { term: "Wave Function (Ψ)", definition: "A mathematical description of the quantum state of an isolated quantum system." },
      { term: "Superposition", definition: "A fundamental principle of quantum mechanics that holds that a physical system exists partly in all its theoretically possible states simultaneously." },
      { term: "Quanta", definition: "The minimum amount of any physical entity involved in an interaction." }
    ],
    examples: [
      { id: 1, type: "Mathematical", content: "Calculating the probability density of an electron in a 1D potential well using the squared amplitude of the wave function |Ψ(x,t)|²." },
      { id: 2, type: "Simulated", content: "The Double-Slit Experiment: Demonstrating interference patterns even when electrons are fired one by one." }
    ]
  };

  return (
    <div className="flex flex-col gap-10 pb-20 max-w-5xl mx-auto">
      {/* NAVIGATION & ACTIONS */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-text-muted hover:text-slate-900 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl bg-white border-slate-200">
            <Share2 size={16} className="text-text-muted" />
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl bg-white border-slate-200">
            <Bookmark size={16} className="text-text-muted" />
          </Button>
          <Button className="bg-slate-900 text-white rounded-xl px-6 h-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 shadow-xl shadow-black/10">
            <Download size={16} /> Export as PDF
          </Button>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="space-y-4">
        <Badge variant="secondary" className="bg-blue-50 text-accent-primary border-none rounded-full px-4 py-1.5 font-black uppercase text-[9px] tracking-[0.2em]">
          Lecture Notes
        </Badge>
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight italic">{lecture.title}</h1>
          <div className="flex items-center gap-6 text-text-muted">
            <div className="flex items-center gap-2">
              <BookOpen size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">{lecture.subject}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">{lecture.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} strokeWidth={2.5} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">AI Curated Insight</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: SUMMARY & CONCEPTS */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-12">
          
          {/* SUMMARY CARD */}
          <section className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-accent-primary rounded-full" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Executive Summary</h3>
             </div>
             <Card className="border-none shadow-none rounded-[40px] bg-slate-50 p-10 relative overflow-hidden group">
               <Sparkles className="absolute top-8 right-8 text-accent-primary/20 rotate-12 group-hover:scale-110 transition-transform" size={40} />
               <CardContent className="p-0">
                 <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
                   "{lecture.summary}"
                 </p>
               </CardContent>
             </Card>
          </section>

          {/* KEY CONCEPTS */}
          <section className="space-y-8">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Key Concepts Mastery</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                {lecture.concepts.map((concept) => (
                  <Card key={concept.id} className="border-none shadow-none rounded-[40px] bg-white hover:shadow-xl transition-shadow cursor-pointer border border-black/5">
                    <CardContent className="p-10 flex gap-8 items-start">
                       <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                          {concept.icon}
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-xl font-black text-slate-800 tracking-tight">{concept.title}</h4>
                          <p className="text-sm font-bold text-text-muted leading-relaxed">{concept.description}</p>
                       </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </section>

        </div>

        {/* RIGHT COLUMN: DEFINITIONS & EXAMPLES */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
          
          {/* DEFINITIONS BOX */}
          <section className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Glossary</h3>
             </div>
             <Card className="border-none shadow-none rounded-[40px] bg-slate-900 overflow-hidden">
               <CardContent className="p-10 space-y-8">
                  {lecture.definitions.map((def, i) => (
                    <div key={i} className="space-y-2 group">
                       <p className="text-[10px] font-black uppercase text-orange-400 tracking-[0.2em]">{def.term}</p>
                       <p className="text-xs font-bold text-white/70 leading-relaxed group-hover:text-white transition-colors">{def.definition}</p>
                    </div>
                  ))}
               </CardContent>
             </Card>
          </section>

          {/* EXAMPLES CARD */}
          <section className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Critical Examples</h3>
             </div>
             <div className="flex flex-col gap-4">
               {lecture.examples.map((example) => (
                 <Card key={example.id} className="border-none shadow-none rounded-[35px] bg-white border border-black/5 hover:bg-slate-50 transition-colors">
                   <CardContent className="p-8 space-y-3">
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 text-text-muted rounded-full">
                        {example.type} Path
                      </Badge>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        {example.content}
                      </p>
                   </CardContent>
                 </Card>
               ))}
             </div>
          </section>

          {/* AI Q&A CTA */}
          <Card className="border-none shadow-none rounded-[40px] bg-accent-primary p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16 rounded-full" />
            <CardContent className="p-0 space-y-6 relative z-10">
               <MessageSquare className="text-white" size={32} />
               <div className="space-y-2">
                 <h4 className="text-2xl font-black italic tracking-tighter">Confused about something?</h4>
                 <p className="text-xs font-bold text-white/80 leading-relaxed">Ask our Brain assistant and get instant conceptual clarify relative to this lecture.</p>
               </div>
               <Button 
                 onClick={() => router.push('/student/ask')}
                 className="w-full bg-white text-accent-primary hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest h-12 rounded-[20px]"
               >
                 Ask Grabit AI
               </Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
