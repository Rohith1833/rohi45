import React from 'react';
import { Tag, AlertCircle, Bot, Zap, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from './ui/Primitives';

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();
  const getSeverityVariant = (severity) => {
    switch(severity) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      default: return 'success';
    }
  };

  return (
    <div className="bg-white shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 border-2 border-slate-100 relative overflow-hidden ring-1 ring-slate-200/50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 via-indigo-600 to-rose-500"></div>
      
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-900/10">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none italic uppercase">{ticket.id}</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Enterprise Incident</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-inner">
          <span className="text-2xl">{ticket.emotion?.emoji || '😐'}</span>
          <span className="text-xs font-black uppercase tracking-widest text-slate-600">{ticket.emotion?.label || 'Neutral'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[140px] p-5 bg-slate-50 border border-slate-100 rounded-3xl">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Internal Category</p>
           <p className="text-sm font-black text-slate-900">{ticket.category}</p>
        </div>
        <div className="flex-1 min-w-[140px] p-5 bg-slate-50 border border-slate-100 rounded-3xl">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Priority Tier</p>
           <Badge variant={getSeverityVariant(ticket.severity)}>{ticket.severity} Impact</Badge>
        </div>
      </div>

      <div className="bg-brand-50/40 rounded-[2rem] p-6 mt-1 border border-brand-100/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] relative group overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-brand-100 text-brand-600 group-hover:scale-110 transition-transform">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.25em] block">SaaS Neural Summary</span>
            <p className="text-[15px] text-slate-900 font-bold leading-relaxed">{ticket.summary}</p>
          </div>
        </div>
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-brand-500/5 to-transparent animate-pulse-slow pointer-events-none" />
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
            <AlertCircle size={14} /> Escalated to Tier 3 Lead Agent
         </div>
         <Button 
          variant="ghost" 
          onClick={() => navigate('/admin-tickets')}
          className="text-indigo-600 hover:bg-indigo-50 font-black tracking-tight rounded-2xl px-6 py-2.5"
         >
            View Console <ArrowRight size={16} className="ml-2" />
         </Button>
      </div>
    </div>
  );
}
