
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { getAIFitnessAdvice } from '../services/geminiService';

interface AICoachProps {
  profile: UserProfile;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AICoach: React.FC<AICoachProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Hello ${profile.name}! I'm your Vertex AI Coach. Ready to crush your fitness goals? How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const aiResponse = await getAIFitnessAdvice(userMsg, profile);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-black">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="w-10 h-10 rounded-full vertex-gradient flex items-center justify-center text-white">
          <i className="fa-solid fa-robot"></i>
        </div>
        <div>
          <h3 className="font-bold text-black">Vertex AI Coach</h3>
          <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
              m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
              : 'bg-slate-100 text-black rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-3xl rounded-tl-none flex gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-75"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask about diet, workouts, or recovery..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full bg-slate-100 border-none p-4 pr-14 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-black placeholder:text-black placeholder:opacity-40"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-black opacity-40 mt-2">
          Coach may provide suggestions based on your profile stats. Consult a professional before major changes.
        </p>
      </div>
    </div>
  );
};

export default AICoach;