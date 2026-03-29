'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Send, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store/useStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentPanel() {
  const { transcript, appendTranscript, chatHistory, addChatMessage } = useStore();
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const secretKey = process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';
    const ws = new WebSocket(`ws://localhost:4000?auth=${secretKey}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'init', role: 'student' }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcript') {
        appendTranscript(data.content);
      }
    };
    return () => ws.close();
  }, [appendTranscript]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !transcript) return;

    const query = chatInput;
    addChatMessage({ role: 'user', content: query });
    setChatInput('');
    setIsTyping(true);

    try {
      const secretKey = process.env.NEXT_PUBLIC_GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': secretKey
        },
        body: JSON.stringify({ transcript, question: query }),
      });
      const data = await res.json();
      addChatMessage({ role: 'ai', content: data.answer });
    } catch (err) {
      addChatMessage({ role: 'ai', content: "Sorry, I'm having trouble connecting to the assistant." });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      <Card className="rounded-[40px] border-none shadow-none neu-flat flex flex-col min-h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={18} className="text-accent-primary" />
            Live Lecture Feed
          </CardTitle>
          <Badge variant="outline" className="border-success/50 text-success bg-success/5 uppercase text-[10px] font-black tracking-widest px-3 py-1">
            Connected
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <p className="whitespace-pre-wrap text-text-secondary leading-loose italic font-medium">
            {transcript || "The lecture hasn't started yet. Relax and get ready!"}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="rounded-[40px] border-none shadow-none neu-flat flex-1 flex flex-col min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-accent-secondary-lavender" />
              Grabit Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <Search size={40} className="mb-4 text-accent-primary" />
                  <p className="text-sm font-black uppercase tracking-[0.2em]">Ask the Brain</p>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-4 px-5 rounded-3xl text-sm font-medium leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-accent-primary text-white shadow-lg shadow-blue-500/20' : 'bg-black/5 text-text-primary'}`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))
              )}
              {isTyping && (
                <div className="flex items-center gap-2 text-[10px] font-black text-accent-primary uppercase tracking-widest animate-pulse px-2">
                  <div className="w-1 h-1 rounded-full bg-accent-primary" />
                  Assistant is thinking
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="relative mt-4">
              <Input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question about the lecture..."
                className="h-14 rounded-2xl bg-black/5 border-none pl-6 pr-16 text-sm font-medium focus-visible:ring-accent-primary/20"
              />
              <Button 
                type="submit" 
                size="icon"
                className="absolute right-2 top-2 rounded-xl bg-accent-primary hover:bg-accent-primary/90 shadow-lg shadow-blue-500/20"
              >
                <Send size={16} />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
