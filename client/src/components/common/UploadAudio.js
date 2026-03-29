'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadAudio({ onUploadComplete }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('audio', file);
      
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        onUploadComplete(data.transcript);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="section-title">Upload Audio</h2>
      <div 
        className={`upload-zone ${isHovering ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={(e) => { 
          e.preventDefault(); 
          setIsHovering(false);
          // Simplified drop handler, matching input file format
          if (e.dataTransfer.files?.[0]) {
             handleFileUpload({ target: { files: e.dataTransfer.files } });
          }
        }}
        onClick={() => document.getElementById('audio-upload').click()}
      >
        <UploadCloud className="upload-icon" />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="loader"></div>
            <p>Processing Audio...</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl">Click or Drag & Drop</h3>
            <p className="text-secondary text-sm">Upload your lecture audio (MP3, WAV, M4A)</p>
          </>
        )}
        <input 
          id="audio-upload"
          type="file" 
          accept="audio/*"
          className="hidden" 
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
