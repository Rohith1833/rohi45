import React, { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MessageBubble from './MessageBubble';
import TicketCard from './TicketCard';
import { useTicketStore } from '../store/useTicketStore';
import { Button } from './ui/Primitives';

export default function ChatWindow() {
  const navigate = useNavigate();
  const { createTicketFromMessage, isSubmitting } = useTicketStore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Good afternoon! I am EchoDesk AI. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTicketPreview, setActiveTicketPreview] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeTicketPreview]);

  const handleSend = async (event) => {
    event.preventDefault();

    if (!input.trim() || isTyping || isSubmitting) return;

    const text = input.trim();
    const userMessage = { id: Date.now(), sender: 'user', text };

    setMessages((p) => [...p, userMessage]);
    setInput('');
    setIsTyping(true);
    setActiveTicketPreview(null);

    try {
      const result = await createTicketFromMessage(text);
      setIsTyping(false);

      if (result.type === 'deflected') {
        setMessages((p) => [
          ...p,
          {
            id: Date.now(),
            sender: 'ai',
            text: result.response.autoReply || 'I can help with that directly.',
            isTicketPrevented: true,
          },
        ]);
        return;
      }

      setMessages((p) => [
        ...p,
        {
          id: Date.now(),
          sender: 'ai',
          text: 'I have analyzed your request and created a tracking ticket.',
        },
      ]);
      setActiveTicketPreview(result.ticket);
    } catch (e) {
      setIsTyping(false);
      setMessages((p) => [
        ...p,
        {
          id: Date.now(),
          sender: 'ai',
          text: 'Service temporarily unavailable. Please try again.',
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-4xl mx-auto border-x border-slate-100 font-sans">
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm">EchoDesk Support</h1>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active System</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
          <LayoutDashboard size={14} className="mr-2" />
          Dashboard
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/10">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {isTyping && (
           <div className="flex items-center gap-2 text-slate-400 text-xs font-medium animate-pulse">
             <Sparkles size={14} /> AI is thinking...
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-6 border-t border-slate-100">
         <div className="max-w-2xl mx-auto relative group">
           {activeTicketPreview && (
             <div className="absolute bottom-full left-0 right-0 mb-6 animate-in slide-in-from-bottom-4 fade-in">
                <TicketCard ticket={activeTicketPreview} />
             </div>
           )}
           <form onSubmit={handleSend} className="relative">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               disabled={isTyping}
               placeholder="Describe your issue..."
               className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none text-sm pr-12 shadow-sm"
             />
             <button
               type="submit"
               disabled={!input.trim() || isTyping}
               className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-20 transition-all"
             >
               <Zap size={18} fill="currentColor" />
             </button>
           </form>
         </div>
         <div className="flex items-center justify-center gap-4 mt-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
           <span className="flex items-center gap-1"><ShieldCheck size={12} /> SECURE</span>
           <span className="flex items-center gap-1"><Sparkles size={12} /> GEMINI FLASH</span>
         </div>
      </div>
    </div>
  );
}
