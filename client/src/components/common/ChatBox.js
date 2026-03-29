'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function ChatBox({ transcript }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !transcript) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: input, 
          transcript,
          history: messages 
        }),
      });
      
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: data.answer }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error processing your question.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-card full-height animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <div className="flex justify-between items-center section-title" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare className="feature-icon" />
          Lecture Q&A
        </h2>
      </div>
      
      {!transcript ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-secondary text-center mt-8">
            Upload a lecture to start asking questions.
          </p>
        </div>
      ) : (
        <>
          <div className="chat-messages mt-4">
            {messages.length === 0 && (
              <p className="text-secondary text-center text-sm my-auto mt-4">
                Ask me anything about the lecture!
              </p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg assistant">
                <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)' }}/>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-input mt-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isTyping || !transcript}
            />
            <button 
              type="submit" 
              className="btn" 
              disabled={!input.trim() || isTyping || !transcript}
              style={{ padding: '0 1rem', borderRadius: '12px' }}
            >
              <Send size={18} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
