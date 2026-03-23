import React, { useEffect, useState } from 'react';
import {
  X,
  Wand2,
  Send,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Bot,
  Zap,
  Target,
  MessageSquare,
  ChevronDown,
  Check,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Button, cn } from './ui/Primitives';

import { useTicketStore } from '../store/useTicketStore';

export default function CopilotPanel({ ticket, onClose, onResolve }) {
  const { isResolving } = useTicketStore();
  const [replyText, setReplyText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    if (ticket) {
      setReplyText(
        ticket.copilot?.replyDraft ||
          `Greetings from Enterprise Support.\n\nWe have analyzed the incident #${ticket.id} regarding the ${ticket.category} category. Investigation is underway.`
      );
    }
  }, [ticket]);

  const handleRewrite = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let base = replyText;
      if (tone === 'Friendly') base = `Hi! Just wanted to say we're on it. We've analyzed the ${ticket.category} issue and are working on a fix now.`;
      if (tone === 'Apologetic') base = `We are sincerely sorry for the disruption. This ${ticket.category} incident has been prioritized as ${ticket.severity} and is under review.`;
      if (tone === 'Professional') base = `The engineering team is currently investigating the ${ticket.category} escalation. We will share the next update as soon as we confirm the root cause.`;
      setReplyText(base);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 240 }}
      className="fixed top-0 right-0 w-full md:w-[520px] h-full bg-white dark:bg-[#0f1423] shadow-[0_32px_120px_-16px_rgba(0,0,0,0.5)] border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col font-sans transition-colors duration-300"
    >
      <div className="h-2 bg-gradient-to-r from-brand-500 via-indigo-600 to-rose-600" />

      <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10 shrink-0">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-brand-500/10 text-white animate-pulse">
            <Bot size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-slate-900 dark:text-white tracking-tighter text-xl leading-none italic uppercase">AI Co-Optimizer</h2>
              <Badge variant="brand" className="text-[8px] px-1.5 py-0.5 opacity-80">v4.0.2</Badge>
            </div>
            <p className="text-[10px] uppercase font-black text-slate-400 mt-2.5 tracking-[0.25em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              L7 Response Protocol Active
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95">
          <X size={22} />
        </button>
      </div>

      <div className="px-10 pt-6 flex items-center gap-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <PanelTab active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>Analysis</PanelTab>
        <PanelTab active={activeTab === 'reasoning'} onClick={() => setActiveTab('reasoning')}>AI Reasoning</PanelTab>
        <PanelTab active={activeTab === 'history'} onClick={() => setActiveTab('history')}>Context</PanelTab>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide bg-slate-50/10 dark:bg-[#0b0f1a]/5">
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Subject Intelligence</h3>
          <div className="p-6 bg-slate-900 dark:bg-brand-600 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-black italic shadow-inner">{ticket.user?.avatar || 'GC'}</div>
              <div className="flex-1">
                <h4 className="text-lg font-black tracking-tighter italic leading-none">{ticket.user?.name || 'Guest Customer'}</h4>
                <p className="text-[11px] font-bold opacity-60 mt-1 uppercase tracking-widest">{ticket.user?.company || 'Web Support Queue'}</p>
              </div>
              <div className="text-right">
                <Badge variant="success" className="bg-white/10 border-white/20 text-white mb-2">{ticket.user?.plan || 'Support'}</Badge>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest leading-none">LTV: {ticket.user?.lifetimeValue || 'N/A'}</p>
              </div>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:scale-150 transition-transform duration-1000">
              <Users size={120} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Neural Risk Analysis</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
              <Target size={14} className="text-brand-600" />
              <span className="text-xs font-black text-slate-900 dark:text-white">{ticket.confidence || 82}% Confidence</span>
            </div>
          </div>

          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-700/50 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ticket.confidence || 82}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className={cn('h-full rounded-full bg-gradient-to-r shadow-lg', (ticket.confidence || 82) > 90 ? 'from-emerald-400 to-emerald-600' : 'from-brand-400 to-brand-600')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AnalysisBox label="Detected Class" value={ticket.category} color="brand" />
            <AnalysisBox label="Mood Profile" value={ticket.emotion?.label || 'Neutral'} color={ticket.severity === 'High' ? 'danger' : 'warning'} />
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl shadow-slate-900/5 dark:shadow-black/20 space-y-5 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="p-2.5 bg-brand-600 text-white rounded-[1.25rem] shadow-xl shadow-brand-500/30">
                <Sparkles size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Synthesis Engine Steps</span>
            </div>
            <div className="space-y-3.5 relative z-10">
              {(ticket.reasoning || []).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight leading-none">{step}</span>
                </motion.div>
              ))}
            </div>
            <Zap size={100} className="absolute -bottom-6 -right-6 text-brand-500/5 dark:text-brand-500/10 rotate-12 group-hover:scale-125 transition-transform duration-700" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Orchestration Center</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ActionItem icon={<Target size={18} />} label="Execute Refund Cluster" />
            <ActionItem icon={<ShieldAlert size={18} />} label="Priority Defcon Level" variant="danger" />
            <ActionItem icon={<MessageSquare size={18} />} label="Extract Context Logs" />
            <ActionItem icon={<ChevronDown size={18} />} label="Legacy Protocols" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Draft Response Synthesis</h3>
            <select value={tone} onChange={(event) => setTone(event.target.value)} className="text-[9px] font-black uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 transition-all hover:bg-slate-50 focus:ring-8 focus:ring-brand-500/5 cursor-pointer outline-none">
              <option>Professional</option>
              <option>Friendly</option>
              <option>Apologetic</option>
            </select>
          </div>
          <div className="relative group">
            <textarea
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              autoFocus
              className="w-full h-56 p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-[15px] font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-[1.5rem] focus:ring-brand-500/5 focus:border-brand-500/50 transition-all shadow-xl shadow-slate-900/5 dark:shadow-black/20 resize-none leading-relaxed placeholder:text-slate-300"
              placeholder="Synchronizing response with neural core..."
            />
            <motion.button
              onClick={handleRewrite}
              disabled={isGenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-5 right-5 p-3.5 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/30 active:translate-y-px disabled:opacity-40"
            >
              <Wand2 size={20} className={cn(isGenerating && 'animate-spin')} />
            </motion.button>
          </div>
        </section>
      </div>

      <div className="p-8 px-10 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
        <div className="flex gap-6">
          <Button variant="secondary" onClick={() => onResolve(ticket.id)} disabled={isResolving} className="flex-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all h-14 rounded-2xl group">
            <CheckCircle2 size={20} className={cn('mr-3', isResolving ? 'animate-spin' : 'group-hover:scale-110 transition-transform')} />
            {isResolving ? 'Processing...' : 'Authorize Resolution'}
          </Button>
          <Button className="flex-[1.5] h-14 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-600 dark:hover:bg-brand-600 dark:hover:text-white transition-all shadow-xl">
            Dispatch Neutral Response
            <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function AnalysisBox({ label, value, color }) {
  const colorMap = {
    brand: 'bg-brand-500 dark:bg-brand-500',
    danger: 'bg-rose-500 dark:bg-rose-500',
    warning: 'bg-amber-500 dark:bg-amber-500',
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-2 group transition-all hover:border-brand-500/50">
      <div className="flex items-center gap-2">
        <div className={cn('w-1.5 h-1.5 rounded-full', colorMap[color])} />
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 leading-none">{label}</p>
      </div>
      <p className="text-[15px] font-black text-slate-900 dark:text-white leading-none tracking-tight">{value}</p>
    </div>
  );
}

function ActionItem({ icon, label, variant = 'default' }) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'flex flex-col items-start gap-4 p-5 border rounded-[2rem] text-[10px] font-black uppercase tracking-[0.1em] text-left transition-all duration-300',
        variant === 'danger'
          ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/10 shadow-lg shadow-rose-500/5'
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-white shadow-xl shadow-slate-900/5 dark:shadow-black/20'
      )}
    >
      <div className={cn('shrink-0 p-3 rounded-2xl shadow-sm', variant === 'danger' ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-slate-50 dark:bg-slate-800 group-hover:bg-brand-500 group-hover:text-white')}>
        {icon}
      </div>
      {label}
    </motion.button>
  );
}

function PanelTab({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={cn('px-2 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group', active ? 'text-brand-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white')}>
      {children}
      {active && (
        <motion.div layoutId="panel-tab" className="absolute -bottom-[1px] left-0 right-0 h-1 bg-brand-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,1)]" />
      )}
    </button>
  );
}
