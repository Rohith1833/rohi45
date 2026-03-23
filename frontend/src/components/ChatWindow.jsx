import React, { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
      text: 'Good afternoon! I am EchoDesk AI. How can I assist you with your Enterprise service today?',
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

    if (!input.trim()) {
      return;
    }

    const text = input.trim();
    const userMessage = { id: Date.now(), sender: 'user', text };

    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setIsTyping(true);
    setActiveTicketPreview(null);

    try {
      const result = await createTicketFromMessage(text);

      setIsTyping(false);

      if (result.type === 'deflected') {
        setMessages((previous) => [
          ...previous,
          {
            id: Date.now(),
            sender: 'ai',
            text:
              result.response.autoReply ||
              'This request can be handled without opening a support ticket.',
            isTicketPrevented: true,
          },
        ]);
        toast.success('Resolved through self-service guidance');
        return;
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          sender: 'ai',
          text: result.response.meta?.fallback
            ? 'Our primary services are delayed, but I created a fallback ticket for manual review.'
            : 'I analyzed your request and created a support ticket for the operations team.',
          isTicketPrevented: false,
        },
      ]);
      setActiveTicketPreview(result.ticket);
      toast.success(`Ticket ${result.ticket.id} created`);
    } catch (error) {
      setIsTyping(false);
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          sender: 'ai',
          text: 'I could not reach support services right now. Please try again in a moment.',
        },
      ]);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-[1200px] mx-auto border-x border-slate-200 shadow-2xl overflow-hidden font-sans">
      <header className="px-8 py-5 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-brand-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white font-black text-xl italic tracking-tighter">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 tracking-tight text-lg">EchoDesk AI</h1>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-100 shadow-xs">
                Enterprise
              </span>
            </div>
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Neural Network Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')} className="rounded-xl border-slate-200">
            <LayoutDashboard size={16} className="mr-2" />
            Agent Login
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide bg-slate-50/20">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start items-center gap-2 text-slate-400 font-bold text-xs bg-white border border-slate-100 px-4 py-3 rounded-2xl shadow-sm"
          >
            <Sparkles size={14} className="text-brand-500 animate-pulse" />
            <span>AI is synthesizing intent engine...</span>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="px-10 pb-8 bg-white border-t border-slate-100 shrink-0">
        <div className="max-w-4xl mx-auto -translate-y-1/2 relative z-30 pointer-events-none">
          <AnimatePresence>
            {activeTicketPreview && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pointer-events-auto"
              >
                <TicketCard ticket={activeTicketPreview} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSend} className="relative flex items-center group max-w-4xl mx-auto -mt-6">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isTyping || isSubmitting}
            placeholder="Describe your issue in detail for our AI engine..."
            className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500/50 focus:bg-white transition-all text-base font-medium shadow-xl shadow-slate-200/40 group-hover:border-slate-200 pr-20"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || isSubmitting}
            className="absolute right-3 p-3 text-white bg-slate-900 rounded-full hover:bg-brand-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all shadow-lg active:scale-95"
          >
            <Zap size={22} fill="currentColor" />
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} /> SOC2 Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} /> GPT-4o Powered
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} /> 99.9% Uptime
          </span>
        </div>
      </div>
    </div>
  );
}
