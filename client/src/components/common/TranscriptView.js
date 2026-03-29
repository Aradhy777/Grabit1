'use client';

import { FileText } from 'lucide-react';

export default function TranscriptView({ transcript }) {
  if (!transcript) return null;

  return (
    <div className="glass-card full-height animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h2 className="section-title">
        <FileText className="feature-icon" />
        Raw Transcript
      </h2>
      <div className="transcript-area">
        {transcript}
      </div>
    </div>
  );
}
