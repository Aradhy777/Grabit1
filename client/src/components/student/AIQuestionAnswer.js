'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  Search, 
  Plus,
  MessageSquare,
  History,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ChevronRight,
  Lightbulb,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_PROMPTS = [
  "Explain Wave-Particle Duality simply.",
  "How does the Schrödinger Equation apply to 1D wells?",
  "What are the key takeaways from yesterday's lecture?",
  "Define 'Superposition' with an example."
];

const INITIAL_MESSAGES = [
  { id: 1, role: 'assistant', text: "Hello! I'm your Grabit AI assistant. I have access to all your lecture context. How can I help you master your subjects today?" }
];

export default function AIQuestionAnswer() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: `Based on your recent Quantum Physics lecture, ${input} is a critical concept. In wave mechanics, we often see this manifesting as probability density flux...` 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex bg-slate-50 h-[calc(100vh-140px)] rounded-[50px] overflow-hidden shadow-2xl border border-black/5">
      
      {/* LEFT SIDEBAR: CHAT HISTORY & CONTEXT */}
      <aside className="w-80 bg-white border-r border-black/5 flex flex-col p-8 gap-10">
        <div className="flex flex-col gap-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Explore Insight</h3>
           <Button className="w-full bg-slate-900 text-white rounded-[20px] h-12 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800">
             <Plus size={16} /> New Chat
           </Button>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
          <div className="space-y-4">
             <p className="text-[9px] font-black uppercase text-text-muted px-2">Recent Threads</p>
             <div className="flex flex-col gap-2">
                {['Wave Mechanics Basics', 'Schrödinger Eq Insight', 'Heisenberg Principle'].map((thread, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-start rounded-2xl h-12 text-xs font-bold text-slate-700 hover:bg-slate-50 gap-3 px-4 group">
                    <MessageSquare size={14} className="text-text-muted group-hover:text-accent-primary" /> 
                    <span className="truncate">{thread}</span>
                  </Button>
                ))}
             </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-black/5">
             <p className="text-[9px] font-black uppercase text-text-muted px-2">Lecture Contexts</p>
             <div className="flex flex-col gap-2">
                <Card className="border-none shadow-none rounded-2xl bg-blue-50/50 p-4 border border-blue-100 cursor-pointer hover:bg-blue-100/50 transition-colors">
                   <p className="text-[10px] font-black text-accent-primary truncate">Introduction to Wave Mechanics</p>
                   <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Physics • Active Context</p>
                </Card>
             </div>
          </div>
        </div>

        <div className="pt-6 border-t border-black/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-slate-100 text-[10px] font-black uppercase">JS</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                 <p className="text-[10px] font-black text-slate-800">John Student</p>
                 <p className="text-[8px] font-bold text-text-muted uppercase">Premium Plan</p>
              </div>
           </div>
           <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-40 hover:opacity-100 transition-opacity">
              <Settings size={14} />
           </Button>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col bg-slate-50/50">
        
        {/* CHAT DISPLAY */}
        <div className="flex-1 overflow-y-auto p-10" ref={scrollRef}>
          <div className="max-w-3xl mx-auto flex flex-col gap-10 py-10">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-6 items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'assistant' ? 'bg-slate-900 text-white' : 'bg-white text-accent-primary'}`}>
                   {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === 'user' ? 'items-end' : ''}`}>
                   <Card className={`border-none shadow-none rounded-[30px] p-6 ${m.role === 'assistant' ? 'bg-white text-slate-800' : 'bg-slate-900 text-white shadow-xl shadow-black/10'}`}>
                      <p className="text-sm font-bold leading-relaxed">{m.text}</p>
                   </Card>
                   {m.role === 'assistant' && (
                     <div className="flex items-center gap-3 px-2">
                        <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg opacity-20 hover:opacity-100 hover:bg-white"><ThumbsUp size={12} /></Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg opacity-20 hover:opacity-100 hover:bg-white"><ThumbsDown size={12} /></Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg opacity-20 hover:opacity-100 hover:bg-white"><Copy size={12} /></Button>
                        <div className="flex items-center gap-2 ml-4">
                           <Sparkles size={10} className="text-accent-primary" />
                           <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">AI Source Verified</span>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-6 items-start animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg">
                   <Bot size={20} />
                </div>
                <div className="max-w-[80%]">
                   <Card className="border-none shadow-none rounded-[30px] p-6 bg-white overflow-hidden">
                      <div className="flex gap-1.5 pt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                   </Card>
                </div>
              </div>
            )}
          </div>

          {/* EMPTY STATE SUGGESTIONS */}
          {messages.length === 1 && (
             <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 mt-10">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <Card 
                    key={i} 
                    onClick={() => setInput(prompt)}
                    className="border-none shadow-none rounded-[30px] p-6 bg-white hover:bg-slate-900 hover:text-white transition-all cursor-pointer group flex items-start gap-4"
                  >
                     <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-white/10 flex items-center justify-center shrink-0">
                        <Lightbulb size={14} className="group-hover:text-orange-400" />
                     </div>
                     <p className="text-xs font-bold leading-relaxed">{prompt}</p>
                  </Card>
                ))}
             </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="p-10 bg-gradient-to-t from-slate-50 to-transparent">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -top-12 left-0 right-0 flex justify-center opacity-0 group-focus-within:opacity-100 transition-opacity">
               <Badge className="bg-slate-900/10 text-slate-600 border-none rounded-full px-4 text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                 Asking Brain about <span className="text-accent-primary ml-1 font-black">Quantum Physics</span>
               </Badge>
            </div>
            <div className="relative">
              <Input 
                placeholder="Ask anything about your lectures..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full h-16 rounded-[25px] border-none bg-white shadow-2xl pl-16 pr-20 font-bold text-sm focus-visible:ring-accent-primary"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-text-muted">
                 <Sparkles size={16} />
              </div>
              <Button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-slate-900 text-white hover:bg-accent-primary transition-colors disabled:opacity-20"
              >
                 <Send size={18} />
              </Button>
            </div>
            <div className="flex items-center justify-center mt-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-text-muted italic flex items-center gap-2">
                 <Bot size={12} /> Powered by Grabit Alpha-1 Insight Engine
               </p>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
