import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "intro-1",
      role: "model",
      text: "Hello! I am EchoDesk Gemini. How can I assist you with your Enterprise queries today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Map current messages to Gemini history format
      const history = messages
        .slice(1) // skip the initial greeting
        .map((m) => ({
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: m.text }],
        }));

      const { data } = await axios.post("/api/chat", {
        message: userMessage.text,
        history,
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "model", text: data.text },
      ]);
    } catch (error) {
      console.error("[Chat Error]:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "model",
          text: "I encountered a synchronization error. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans selection:bg-brand-500/30 overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-brand-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="px-10 py-6 border-b border-white/5 backdrop-blur-2xl bg-slate-950/50 sticky top-0 z-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-brand-500 shadow-xl shadow-indigo-500/20 flex items-center justify-center text-white font-black text-2xl italic tracking-tighter">
            G
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black tracking-tighter italic uppercase">Gemini Core</h1>
              <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border border-brand-500/20">Active Node</span>
            </div>
            <p className="text-[10px] items-center gap-1.5 font-bold uppercase tracking-[0.2em] text-emerald-500 mt-1 flex">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Neural Stream Online
            </p>
          </div>
        </div>
      </header>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide relative z-0">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn("flex gap-6 group", message.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110",
                message.role === "model" ? "bg-slate-900 border border-slate-800 text-brand-400" : "bg-indigo-600 text-white"
              )}>
                {message.role === "model" ? <Bot size={22} /> : <User size={22} />}
              </div>
              <div className={cn(
                "max-w-3xl space-y-2",
                message.role === "user" ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "p-6 rounded-[2rem] text-base leading-relaxed font-medium shadow-2xl",
                  message.role === "model" 
                    ? "bg-slate-900/50 border border-white/5 text-slate-200" 
                    : "bg-indigo-600 text-white shadow-indigo-600/10"
                )}>
                  {message.text}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{message.role === "model" ? "Omni-Scribe System" : "Client Portal"}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>Just Now</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand-500 pl-2"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>AI is synthesizing neural pathways...</span>
          </motion.div>
        )}
        <div ref={scrollRef} className="h-20" />
      </div>

      {/* Input Form */}
      <div className="px-10 pb-12 pt-6 sticky bottom-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent shrink-0">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your enterprise inquiry here..."
            className="w-full px-8 py-6 bg-slate-900/80 border-2 border-white/5 rounded-[2.5rem] focus:outline-none focus:ring-[1rem] focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-slate-900 transition-all text-base font-medium text-white pr-24 shadow-2xl backdrop-blur-xl group-hover:border-white/10"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-4 bg-brand-600 text-white rounded-[1.75rem] hover:bg-brand-500 active:scale-95 disabled:opacity-20 transition-all shadow-xl shadow-brand-600/20"
          >
            <Send size={24} />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Quantum Encrypted
          </span>
          <span className="flex items-center gap-2">
            <Zap size={14} className="text-brand-500" /> Gemini Ultra Flash
          </span>
        </div>
      </div>
    </div>
  );
}
