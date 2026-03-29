'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Lightbulb
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_QUIZ = [
  {
    question: "What does the Schrödinger Equation primarily describe?",
    options: [
      "The exact path of a particle in space",
      "The gravity of subatomic particles",
      "The evolution of a quantum state over time",
      "The velocity of light in a vacuum"
    ],
    correct: 2,
    explanation: "The Schrödinger equation is a linear partial differential equation that governs the wave function of a quantum-mechanical system, describing its state evolution."
  },
  {
    question: "Which principle states that you cannot know both position and momentum simultaneously?",
    options: [
      "Pauli Exclusion Principle",
      "Heisenberg Uncertainty Principle",
      "Einstein's Relativity",
      "Bernoulli's Principle"
    ],
    correct: 1,
    explanation: "Heisenberg's Uncertainty Principle is a fundamental limit to the precision with which certain pairs of physical properties, such as position and momentum, can be known."
  },
  {
    question: "In the context of the double-slit experiment, what is observed when no observer is present?",
    options: [
      "Two distinct lines",
      "No pattern at all",
      "An interference pattern",
      "A single wide line"
    ],
    correct: 2,
    explanation: "Without observation, particles like electrons exhibit wave-like behavior, creating an interference pattern on the screen."
  }
];

export default function QuizPage({ lectureId }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentStep < MOCK_QUIZ.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const checkAnswer = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === MOCK_QUIZ[currentStep].correct) {
      setScore(prev => prev + 1);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 max-w-2xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-accent-primary/20 blur-[100px] rounded-full" />
          <div className="w-32 h-32 rounded-[40px] bg-slate-900 text-white flex items-center justify-center shadow-2xl relative z-10">
            <Trophy size={60} className="text-amber-400" />
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Quiz Completed!</h2>
          <p className="text-lg font-bold text-text-muted">You mastered the content with a score of:</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-8xl font-black text-accent-primary italic tracking-tighter">{score}</span>
            <span className="text-4xl text-slate-300 font-black italic">/ {MOCK_QUIZ.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Button 
            onClick={() => window.location.reload()}
            className="h-16 rounded-[25px] bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-200"
          >
            <RotateCcw size={18} className="mr-2" /> Retake Quiz
          </Button>
          <Button 
            onClick={() => router.push('/student')}
            className="h-16 rounded-[25px] bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800"
          >
             Dashboard <ChevronRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = MOCK_QUIZ[currentStep];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12 h-full flex flex-col">
      
      {/* HEADER: PROGRESS & TIMER */}
      <div className="flex items-center justify-between gap-10">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-text-muted hover:text-red-500"
        >
          <X size={20} />
        </Button>

        <div className="flex-1 space-y-2">
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted italic">
              <span>Question {currentStep + 1} of {MOCK_QUIZ.length}</span>
              <span>{Math.round(((currentStep + 1) / MOCK_QUIZ.length) * 100)}% Complete</span>
           </div>
           <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-accent-primary transition-all duration-500" 
                style={{ width: `${((currentStep + 1) / MOCK_QUIZ.length) * 100}%` }}
              />
           </div>
        </div>

        <div className="flex items-center gap-4 px-6 h-12 rounded-full bg-slate-900 text-white shadow-xl shadow-black/10">
           <Timer size={18} className={timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-blue-400'} />
           <span className={`text-xs font-black tracking-widest ${timeLeft < 60 ? 'text-red-400' : ''}`}>
             {formatTime(timeLeft)}
           </span>
        </div>
      </div>

      {/* QUESTION AREA */}
      <div className="flex-1 flex flex-col gap-10 py-10">
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight italic max-w-2xl">
           "{currentQuestion.question}"
        </h3>

        <div className="grid grid-cols-1 gap-4">
           {currentQuestion.options.map((option, i) => {
             const isCorrect = i === currentQuestion.correct;
             const isSelected = i === selectedOption;
             
             let cardStyle = "bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg";
             if (isAnswered) {
                if (isCorrect) cardStyle = "bg-green-50 border-green-200 ring-2 ring-green-500 ring-offset-4 shadow-xl";
                else if (isSelected) cardStyle = "bg-red-50 border-red-200 ring-2 ring-red-500 ring-offset-4 shadow-xl";
                else cardStyle = "bg-white opacity-40 border-slate-100";
             } else if (isSelected) {
                cardStyle = "bg-accent-primary text-white border-accent-primary shadow-xl shadow-blue-500/20";
             }

             return (
               <Card 
                  key={i} 
                  onClick={() => checkAnswer(i)}
                  className={`border-none shadow-sm rounded-[30px] p-8 cursor-pointer transition-all duration-300 group ${cardStyle}`}
               >
                 <CardContent className="p-0 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border transition-colors ${isSelected && !isAnswered ? 'bg-white/20 border-white/40' : 'bg-slate-50 border-black/5 text-slate-400 group-hover:bg-accent-primary group-hover:text-white group-hover:border-accent-primary'}`}>
                          {String.fromCharCode(65 + i)}
                       </span>
                       <p className="text-sm font-bold tracking-tight">{option}</p>
                    </div>
                    {isAnswered && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                    {isAnswered && isSelected && !isCorrect && <AlertCircle className="text-red-500" size={24} />}
                 </CardContent>
               </Card>
             );
           })}
        </div>
      </div>

      {/* BOTTOM ACTION: ANALYTICS / NEXT */}
      <div className="pt-10 border-t border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
           {isAnswered ? (
             <div className="flex items-start gap-4 max-w-xl animate-in fade-in slide-in-from-left duration-500">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                   <Lightbulb size={20} className="text-amber-400" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">AI Insight Explanation</p>
                   <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                     "{currentQuestion.explanation}"
                   </p>
                </div>
             </div>
           ) : (
             <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-accent-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted italic">Confidence: 94% (Select your path)</span>
             </div>
           )}
        </div>

        <Button 
          disabled={!isAnswered}
          onClick={handleNext}
          className="h-16 px-12 rounded-[25px] bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-10 group"
        >
          {currentStep === MOCK_QUIZ.length - 1 ? 'Finish Challenge' : 'Next Question'} 
          <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

    </div>
  );
}
