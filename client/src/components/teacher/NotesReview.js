'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileEdit, 
  Eye, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Save, 
  ArrowLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function NotesReview() {
  const router = useRouter();
  const { transcript, generatedNotes, setGeneratedNotes } = useStore();
  const [editableNotes, setEditableNotes] = useState(generatedNotes || '');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Real initial generation
  useEffect(() => {
    const fetchNotes = async () => {
      if (!editableNotes && transcript) {
        setIsPublishing(true);
        try {
          const secretKey = process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';
          const res = await fetch('http://localhost:4000/api/notes', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-API-KEY': secretKey
            },
            body: JSON.stringify({ transcript }),
          });
          const data = await res.json();
          if (data.notes) {
            setEditableNotes(data.notes);
            setGeneratedNotes(data.notes);
          }
        } catch (err) {
          console.error("AI Generation failed:", err);
        } finally {
          setIsPublishing(false);
        }
      }
    };
    fetchNotes();
  }, [transcript, editableNotes, setGeneratedNotes]);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const secretKey = process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';
      const res = await fetch('http://localhost:4000/api/publish', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': secretKey
        },
        body: JSON.stringify({ 
          topic: "Lecture Session", // Could be dynamic from store
          transcript, 
          notes: editableNotes,
          type: 'lecture'
        }),
      });
      if (res.ok) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Publishing failed:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push('/teacher');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      {/* ... (Header) */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full neu-flat-sm w-10 h-10"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Review & Refine</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-0.5">Step 2: Note Finalization</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => setEditableNotes(generatedNotes)}
            className="neu-flat-sm rounded-2xl h-11 px-6 font-bold text-xs flex items-center gap-2"
          >
            <RotateCcw size={14} /> Reset Changes
          </Button>
          <Button 
            disabled={isPublishing}
            onClick={handlePublish}
            className="bg-accent-primary hover:bg-accent-primary/90 text-white font-black text-xs uppercase tracking-widest px-8 h-11 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            {isPublishing ? "Syncing..." : <>Publish Materials <Send size={14} /></>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        {/* LEFT: EDITOR */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-primary flex items-center gap-2">
              <FileEdit size={12} /> Live Editor
            </span>
            <span className="text-[10px] font-black text-text-muted">Markdown Supported</span>
          </div>
          
          <Card className="flex-1 rounded-[40px] border-none shadow-none neu-flat flex flex-col overflow-hidden relative group">
             <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-accent-primary flex items-center gap-2 shadow-sm border border-black/5">
                  <Sparkles size={10} /> AI Enhanced
                </div>
             </div>
             <Textarea 
               value={editableNotes}
               onChange={(e) => setEditableNotes(e.target.value)}
               className="flex-1 resize-none bg-transparent border-none p-10 font-mono text-sm leading-relaxed focus-visible:ring-0 custom-scrollbar text-text-secondary"
               placeholder="Start typing your notes here..."
             />
          </Card>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
              <Eye size={12} /> Material Preview
            </span>
          </div>
          
          <Card className="flex-1 rounded-[40px] border-none shadow-none bg-white flex flex-col overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
            <div className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar prose prose-slate max-w-none">
              <div className="space-y-6">
                 {/* Premium Header Mock */}
                 <div className="pb-8 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-accent-primary mb-2">
                       <Sparkles size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Grabit Summary</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-800 m-0">Notes Preview</h1>
                 </div>

                 {/* Markdown Render Mock with styles */}
                 <div className="text-slate-600 leading-relaxed space-y-4">
                    {editableNotes.split('\n').map((line, i) => {
                      const trimmedLine = line.trim();
                      if (trimmedLine.startsWith('# ')) return <h1 key={i} className="text-2xl font-black text-slate-800 py-4 border-b border-slate-100">{trimmedLine.replace('# ', '')}</h1>;
                      if (trimmedLine.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-800 pt-6">{trimmedLine.replace('## ', '')}</h2>;
                      if (trimmedLine.startsWith('- ')) return (
                        <div key={i} className="flex gap-3 ml-2 items-start">
                          <ChevronRight size={14} className="mt-1.5 text-accent-primary shrink-0" />
                          <p className="m-0 font-medium">{trimmedLine.replace('- ', '')}</p>
                        </div>
                      );
                      if (!trimmedLine) return <div key={i} className="h-4" />;
                      return <p key={i} className="m-0 font-medium">{trimmedLine}</p>;
                    })}
                 </div>
              </div>
            </div>
            
            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
          </Card>
        </div>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[50px] p-12 max-w-sm w-full text-center shadow-3xl"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Success!</h3>
              <p className="text-slate-500 font-medium mb-8">Your session lecture notes have been published to the student portal.</p>
              <Button 
                onClick={handleCloseSuccess}
                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest"
              >
                Back to Dashboard
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
