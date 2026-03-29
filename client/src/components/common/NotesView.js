'use client';

import { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function NotesView({ transcript }) {
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNotes = async () => {
    if (!transcript) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      setNotes(data.notes);
    } catch (error) {
      console.error(error);
      alert('Failed to generate notes');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-card full-height animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex justify-between items-center section-title" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen className="feature-icon" />
          Smart Notes
        </h2>
        {transcript && !notes && (
          <button 
            className="btn btn-secondary" 
            onClick={generateNotes}
            disabled={isGenerating}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            {isGenerating ? <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}/> : <Sparkles size={16} />}
            Generate Notes
          </button>
        )}
      </div>
      
      <div className="transcript-area mt-4" style={{ marginTop: '1rem' }}>
        {notes ? (
          <div dangerouslySetInnerHTML={{ __html: notes.replace(/\n/g, '<br />') }} />
        ) : (
          <p className="text-secondary text-center" style={{ marginTop: '2rem' }}>
            {transcript ? 'Click generate to analyze transcript and create structured notes.' : 'Upload an audio file to get started.'}
          </p>
        )}
      </div>
    </div>
  );
}
