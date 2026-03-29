import { create } from 'zustand';

const useStore = create((set) => ({
  role: 'teacher', // Default role
  setRole: (role) => set({ role }),
  
  transcript: '',
  generatedNotes: '',
  isRecording: false,
  appendTranscript: (text) => set((state) => ({ 
    transcript: state.transcript + (state.transcript ? ' ' : '') + text 
  })),
  setGeneratedNotes: (notes) => set({ generatedNotes: notes }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  clearTranscript: () => set({ transcript: '' }),

  chatHistory: [],
  addChatMessage: (msg) => set((state) => ({ 
    chatHistory: [...state.chatHistory, msg] 
  })),
  clearChat: () => set({ chatHistory: [] }),
}));

export default useStore;
