'use client';

import { useState } from 'react';
import { Star, Wand2 } from 'lucide-react';

export default function HighlightsView({ transcript }) {
  const [highlights, setHighlights] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHighlights = async () => {
    if (!transcript) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      setHighlights(data.highlights);
    } catch (error) {
      console.error(error);
      alert('Failed to generate highlights');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-card full-height animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="flex justify-between items-center section-title" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star className="feature-icon" />
          Key Moments
        </h2>
        {transcript && !highlights && (
          <button 
            className="btn btn-secondary" 
            onClick={generateHighlights}
            disabled={isGenerating}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            {isGenerating ? <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}/> : <Wand2 size={16} />}
            Extract Highlights
          </button>
        )}
      </div>
      
      <div className="transcript-area mt-4" style={{ marginTop: '1rem' }}>
        {highlights ? (
          <div dangerouslySetInnerHTML={{ __html: highlights.replace(/\n/g, '<br />') }} />
        ) : (
          <p className="text-secondary text-center" style={{ marginTop: '2rem' }}>
            {transcript ? 'Extract the most important parts of the lecture.' : 'Upload an audio file to view highlights.'}
          </p>
        )}
      </div>
    </div>
  );
}
