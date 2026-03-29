'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Activity, StopCircle, Volume2, Sparkles, Layout, BrainCircuit, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherPanel() {
  const router = useRouter();
  const { transcript, appendTranscript, isRecording, setIsRecording } = useStore();
  const [recordingTime, setRecordingTime] = useState(0);
  const [topic, setTopic] = useState('');
  const [filteredContent, setFilteredContent] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const wsRef = useRef(null);
  const timerRef = useRef(null);
  const lastProcessedLength = useRef(0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // WS message handling is already in useEffect below, 
  // but I need to make sure appendTranscript is not the ONLY thing it does.
  useEffect(() => {
    const secretKey = process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';
    const ws = new WebSocket(`ws://localhost:4000?auth=${secretKey}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ 
        type: 'init', 
        role: 'teacher',
        topic: topic.trim() 
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcript') {
        appendTranscript(data.content);
      } else if (data.type === 'keypoint') {
        console.log('--- RECEIVED KEY CONCEPT ---', data.content);
        setFilteredContent(prev => [...prev, data.content]);
      }
    };

    return () => ws.close();
  }, [appendTranscript, topic]); // Topic dependency to ensure message init is correct

  // Removed mock "Smart Filtering" useEffect (Lines 32-49 were here)

  const startRecording = async () => {
    if (!topic.trim()) {
      alert("Please enter a lecture topic first.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const secretKey = process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';
      const ws = new WebSocket(`ws://localhost:4000?auth=${secretKey}`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ 
          type: 'init', 
          role: 'teacher',
          topic: topic.trim() 
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'transcript') {
          appendTranscript(data.content);
        }
      };

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          ws.send(e.data);
        }
      };

      mediaRecorder.start(2000); 
      setIsRecording(true);
      setRecordingTime(0);
      setFilteredContent([]);
      lastProcessedLength.current = 0;
      
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) {
      console.error(err);
      alert("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (wsRef.current) wsRef.current.close();
    setIsRecording(false);
    clearInterval(timerRef.current);
    // Push to review screen
    router.push('/teacher/review');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-6">
      {/* Header Info */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4">
           <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-error animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'bg-text-muted opacity-30'}`} />
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
             {isRecording ? "Live Lecture Session" : "Session Standby"}
           </h2>
        </div>
        
        {isRecording && (
          <Badge variant="outline" className="neu-flat-sm border-none px-6 py-2 rounded-2xl flex items-center gap-3">
            <Clock size={14} className="text-accent-primary" />
            <span className="font-mono font-bold text-accent-primary">{formatTime(recordingTime)}</span>
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* LEFT COLUMN: Controls & Context */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <Card className="rounded-[40px] border-none shadow-none neu-flat flex-1 flex flex-col overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                <Layout size={16} /> Lecture Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-text-primary ml-1">Current Topic</label>
                <Input 
                  placeholder="Enter lecture focus..." 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isRecording}
                  className="h-16 bg-black/[0.03] border-none rounded-3xl px-6 text-lg font-black text-slate-900 transition-all focus-visible:ring-accent-primary/20 placeholder:text-slate-400"
                />
              </div>

              {/* Status & Mic Feedback */}
              <div className="flex-1 flex flex-col items-center justify-center gap-8 py-10">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isRecording ? 'neu-pressed scale-110' : 'neu-flat'}`}>
                  {isRecording ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Mic size={48} className="text-error" />
                    </motion.div>
                  ) : (
                    <MicOff size={48} className="text-text-muted" />
                  )}
                </div>
                
                {/* Wave Visualizer */}
                <div className="flex items-center gap-1.5 h-8">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={isRecording ? { height: [4, Math.random() * 24 + 4, 4] } : { height: 4 }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                      className={`w-1.5 rounded-full ${isRecording ? 'bg-accent-primary opacity-80' : 'bg-text-muted opacity-20'}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0">
          <div className="grid grid-rows-2 gap-6 flex-1 min-h-0">
            {/* Live Transcript Panel */}
            <Card className="rounded-[40px] border-none shadow-none neu-flat flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 mx-6 px-0 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <Volume2 size={16} /> Raw Transcription
                </CardTitle>
                {isRecording && (
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-primary animate-pulse">
                     <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                     Listening...
                   </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <p className="text-lg font-medium text-text-secondary leading-relaxed tracking-tight">
                  {transcript || (isRecording ? "Listening for your voice..." : "Session inactive. Click 'Start' to begin capturing lecture content.")}
                </p>
              </CardContent>
            </Card>

            {/* AI Filtered Preview */}
            <Card className="rounded-[40px] border-none shadow-none bg-accent-primary/[0.03] border-accent-primary/5 flex flex-col overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/[0.02] to-transparent pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 mx-6 px-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-accent-primary flex items-center gap-2">
                  <BrainCircuit size={18} /> AI Key Concept Stream
                </CardTitle>
                {isProcessing && (
                   <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-primary bg-accent-primary/10 px-3 py-1 rounded-full border border-accent-primary/20 shadow-sm"
                   >
                     <Sparkles size={10} className="animate-spin" />
                     Analyzing Insights...
                   </motion.div>
                )}
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
                <AnimatePresence mode="popLayout">
                  {filteredContent.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-4">
                      <Sparkles size={40} className="text-accent-primary animate-pulse" />
                      <p className="text-xs font-black uppercase tracking-[0.3em]">AI Insight Pipeline Ready</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {filteredContent.map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ duration: 0.5, ease: "backOut" }}
                          className="neu-flat p-5 rounded-3xl border-l-[6px] border-accent-primary flex items-start gap-4 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="text-accent-primary" />
                          </div>
                          <p className="text-base font-bold text-text-primary leading-snug pt-1">{point}</p>
                        </motion.div>
                      ))}
                      {isProcessing && (
                         <motion.div 
                          className="h-24 rounded-3xl bg-black/5 animate-shimmer relative overflow-hidden"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                         >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                         </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="h-24 flex items-center justify-center gap-6 mt-4">
        {!isRecording ? (
          <Button 
            onClick={startRecording} 
            className="h-16 px-12 rounded-3xl bg-accent-primary hover:bg-accent-primary/90 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-3"
          >
            <Mic /> Start Live Session
          </Button>
        ) : (
          <Button 
            onClick={stopRecording} 
            variant="destructive"
            className="h-16 px-12 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-500/30 active:scale-95 transition-all flex items-center gap-3"
          >
            <StopCircle /> End Lecture Session
          </Button>
        )}
      </div>
    </div>
  );
}
