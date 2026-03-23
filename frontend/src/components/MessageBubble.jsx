import React from 'react';
import { clsx } from 'clsx';
import { Bot, User, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  return (
    <div className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={clsx("flex max-w-[85%] items-end gap-3 px-1", isUser ? "flex-row-reverse" : "flex-row")}>
        <div className={clsx(
          "flex shrink-0 h-10 w-10 rounded-2xl items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95",
          isUser ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-brand-600 shadow-slate-200/50"
        )}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        <div className={clsx("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
          <div className={clsx(
            "px-6 py-4 rounded-3xl text-[15px] font-medium leading-relaxed shadow-xl",
            isUser 
              ? "bg-slate-900 text-white rounded-br-md shadow-slate-900/10" 
              : "bg-white text-slate-800 rounded-bl-md border border-slate-100 shadow-slate-200/40"
          )}>
            {message.text}
          </div>
          
          {message.isTicketPrevented && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-start mt-2"
            >
              <span className="bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest rounded-full px-4 py-1.5 flex items-center gap-2 border border-emerald-100 shadow-sm shadow-emerald-200/50">
                <ShieldCheck size={14} /> Deflection Optimal ✅
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
