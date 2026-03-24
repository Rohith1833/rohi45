import React from 'react';
import { clsx } from 'clsx';
import { Bot, User, ShieldCheck } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  return (
    <div className={clsx("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={clsx("flex max-w-[80%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
        <div className={clsx(
          "flex shrink-0 h-8 w-8 rounded-full items-center justify-center text-xs font-bold",
          isUser ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
        )}>
          {isUser ? <User size={14} /> : <Bot size={14} />}
        </div>
        
        <div className={clsx("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
          <div className={clsx(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
            isUser 
              ? "bg-slate-900 text-white rounded-tr-none" 
              : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
          )}>
            {message.text}
          </div>
          
          {message.isTicketPrevented && (
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                <ShieldCheck size={12} /> Resolved via Deflection
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
