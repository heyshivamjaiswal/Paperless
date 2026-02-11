import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiTrash, HiSparkles, HiCog } from 'react-icons/hi';
import { useAIStore } from '../store/Aistore';
import { getGroqCompletion } from '../utils/GroqServices';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function AIChatPage() {
  const apiKey = useAIStore((s) => s.apiKey);
  const chatHistory = useAIStore((s) => s.chatHistory);
  const addMessage = useAIStore((s) => s.addMessage);
  const clearHistory = useAIStore((s) => s.clearHistory);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const setApiKey = useAIStore((s) => s.setApiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Fetch API key from backend on mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/ai/key`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.apiKey) {
            setLocalApiKey(data.apiKey);
            setApiKey(data.apiKey);
          }
        }
      } catch (error) {
        console.error('Failed to fetch API key:', error);
      }
    };
    fetchApiKey();
  }, [setApiKey]);

  const handleSaveApiKey = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ apiKey: localApiKey }),
      });

      if (res.ok) {
        setApiKey(localApiKey);
        setShowSettings(false);
      }
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (!apiKey) {
      alert('Please set your Groq API key first');
      setShowSettings(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const result = await getGroqCompletion(userMessage, apiKey, chatHistory);

      if (result.error) {
        addMessage('assistant', `Error: ${result.error}`);
      } else {
        addMessage('assistant', result.text);
      }
    } catch (error) {
      console.error('AI error:', error);
      addMessage('assistant', 'Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQuestions = [
    'Explain quantum mechanics in simple terms',
    'Help me understand photosynthesis',
    'What are the main causes of World War 2?',
    'Explain the Pythagorean theorem with examples',
  ];

  return (
    <div className="w-full h-full bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/[0.08] bg-[#0a0a0a] px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/[0.08]">
                <HiSparkles className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  AI Study Assistant
                </h1>
                <p className="text-sm text-white/50 mt-1">Powered by Groq AI</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-white/[0.08] transition-colors"
            >
              <HiCog className="text-2xl text-white/60 hover:text-white" />
            </button>
          </div>

          {/* What you can do section */}
          <motion.div
            className="bg-black/70 border border-black rounded-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-neutral-400 font-medium mb-2">
              What you can do here:
            </p>
            <ul className="text-xs text-neutral-300 space-y-1">
              <li>• Get explanations for complex topics</li>
              <li>• Ask study questions and get detailed answers</li>
              <li>• Request summaries of concepts</li>
              <li>• Get help with homework and research</li>
              <li>• Practice learning with interactive Q&A</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="flex-shrink-0 bg-white/[0.04] border-b border-white/[0.08] px-8 py-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-semibold text-white mb-3">
                Groq API Key
              </h3>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder="Enter your Groq API key..."
                  className="flex-1 px-4 py-2 bg-white/[0.06] border border-white/[0.08]
                           rounded-lg text-white placeholder-white/30
                           focus:outline-none focus:border-white/20"
                />
                <button
                  onClick={handleSaveApiKey}
                  disabled={!localApiKey.trim()}
                  className="px-6 py-2 bg-white text-black rounded-lg font-medium
                           hover:bg-white/90 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-white/40 mt-2">
                Get your free API key from{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Groq Console
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area with Custom Scrollbar */}
      <style>
        {`
          .chat-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .chat-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .chat-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          .chat-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        `}
      </style>
      <div className="flex-1 overflow-y-auto px-8 py-6 chat-scroll">
        <div className="max-w-4xl mx-auto">
          {chatHistory.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <HiSparkles className="text-6xl text-white/20 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Start a conversation
              </h2>
              <p className="text-white/50 mb-6">
                Ask me anything to help with your studies and notes
              </p>

              {/* Example Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {exampleQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-left p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]
                             hover:bg-white/[0.06] hover:border-white/20 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm text-white/80">{question}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4 pb-4">
              {chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {message.role === 'assistant' && (
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.08] 
                                  flex items-center justify-center"
                    >
                      <HiSparkles className="text-sm text-white/60" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-white text-black'
                        : 'bg-white/[0.06] text-white border border-white/[0.08]'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white 
                                  flex items-center justify-center"
                    >
                      <span className="text-sm font-semibold text-black">
                        U
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.08] 
                                flex items-center justify-center"
                  >
                    <HiSparkles className="text-sm text-white/60" />
                  </div>
                  <div className="bg-white/[0.06] border border-white/[0.08] px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-white/[0.08] bg-[#0a0a0a] px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08]
                         rounded-xl text-white placeholder-white/30
                         focus:outline-none focus:border-white/20 resize-none
                         max-h-32"
                style={{ minHeight: '48px' }}
              />
            </div>

            {chatHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-3 rounded-xl hover:bg-white/[0.08] transition-colors"
                title="Clear chat"
              >
                <HiTrash className="text-xl text-white/50 hover:text-red-400" />
              </button>
            )}

            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-white text-black hover:bg-white/90
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiPaperAirplane className="text-xl" />
            </button>
          </div>
          <p className="text-xs text-white/40 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIChatPage;
