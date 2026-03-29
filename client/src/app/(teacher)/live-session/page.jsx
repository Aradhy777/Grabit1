"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveSession() {
  const [isLive, setIsLive] = useState(false);
  const [topic, setTopic] = useState("");
  const [transcript, setTranscript] = useState("");
  const [time, setTime] = useState(0);
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Timer
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Fake AI transcription
  useEffect(() => {
    if (!isLive) return;

    const demoText = [
      "Operating system manages hardware resources.",
      "Round robin scheduling uses time slices.",
      "Each process gets equal CPU time.",
      "Context switching ensures fairness.",
    ];

    let index = 0;

    const interval = setInterval(() => {
      setTranscript((prev) => prev + " " + demoText[index]);
      index = (index + 1) % demoText.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleStart = () => {
    setIsLive(true);
    setTranscript("");
    setTime(0);
  };

  const handleStop = () => {
    setIsLive(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT PANEL */}
      <div className="w-1/3 p-6 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Live Lecture</h1>

          <input
            type="text"
            placeholder="Enter lecture topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all mb-6"
          />

          {/* Status */}
          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isLive ? "bg-red-100 text-red-600" : "bg-gray-200"
              }`}
            >
              {isLive ? "Recording..." : "Not Live"}
            </span>
          </div>

          {/* Timer */}
          <p className="text-lg font-medium">
            Time: {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleStart}
            className="flex-1 bg-green-600 text-white p-3 rounded-xl"
          >
            Start
          </button>
          <button
            onClick={handleStop}
            className="flex-1 bg-red-600 text-white p-3 rounded-xl"
          >
            Stop
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-2/3 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          Live AI Transcription
        </h2>

        <div className="flex-1 bg-white p-8 rounded-[35px] shadow-sm border border-black/5 overflow-y-auto custom-scrollbar">
          <motion.p
            key={transcript.length}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-slate-900 font-bold leading-relaxed text-lg"
          >
            {transcript || "AI is waiting for lecture input..."}
          </motion.p>
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* AI Processing Indicator */}
        {isLive && (
          <div className="mt-4 text-sm text-gray-500">
            🧠 AI is processing and filtering academic content...
          </div>
        )}
      </div>
    </div>
  );
}
