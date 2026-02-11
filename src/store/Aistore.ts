import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIState {
  apiKey: string | null;
  enabled: boolean;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  setApiKey: (key: string | null) => void;
  setEnabled: (enabled: boolean) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      apiKey: null,
      enabled: false,
      chatHistory: [],
      setApiKey: (key) => set({ apiKey: key }),
      setEnabled: (enabled) => set({ enabled }),
      addMessage: (role, content) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, { role, content }],
        })),
      clearHistory: () => set({ chatHistory: [] }),
    }),
    {
      name: 'ai-storage',
    }
  )
);
