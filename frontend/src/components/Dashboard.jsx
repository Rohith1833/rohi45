import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Inbox,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from '../store/useTicketStore';
import { cn, Skeleton } from './ui/Primitives';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tickets, getStats, initializeTickets, isLoading, isApiHealthy, enableSync } = useTicketStore();

  useEffect(() => {
    initializeTickets();
    return enableSync(15000); // Poll every 15s when dashboard is open
  }, [initializeTickets, enableSync]);

  const stats = getStats();
  const highPriorityTickets = tickets
    .filter((ticket) => ticket.severity === 'High' && ticket.status !== 'Resolved')
    .slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto space-y-12 pb-20 font-sans transition-colors duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {isLoading ? [1, 2, 3, 4].map((value) => <Skeleton key={value} className="h-40 rounded-[2.5rem]" />) : (
          <>
            <StatCard label="Pipeline Volume" value={stats.total} icon={<Inbox size={22} className="text-brand-600" />} trend="+12.2%" />
            <StatCard label="Critical Response" value={stats.high} icon={<AlertTriangle size={22} className="text-rose-500" />} trend="-4%" highlight="bg-rose-500/5 border-rose-500/10 shadow-rose-500/5 ring-1 ring-rose-500/20 shadow-xl" />
            <StatCard label="Average CSAT" value={stats.csat} icon={<Smile size={22} className="text-emerald-500" />} trend="+0.2%" />
            <StatCard label="MTTR" value={`${stats.avgResolution}m`} icon={<TrendingUp size={22} className="text-indigo-600" />} trend="-15%" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl shadow-slate-900/5 shadow-inner">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3.5 bg-brand-600 text-white rounded-3xl shadow-xl shadow-brand-500/20 translate-y-[-4px]">
                  <Bot size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic uppercase">AI Intelligence Digest</h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-[0.25em]">{isApiHealthy ? 'Live backend sync active' : 'Backend link disrupted'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl">
                  The dashboard is now reading the live Express queue. <span className="text-brand-600 dark:text-brand-400 font-black">{stats.high} active high-priority cases</span> are currently waiting for manual handling.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <InsightChip label={`Tickets: ${stats.total}`} icon={<Zap size={14} />} />
                  <InsightChip label={`Resolved: ${stats.resolved}`} icon={<TrendingUp size={14} />} />
                  <InsightChip
                    label={isApiHealthy ? 'API Connection Healthy' : 'API Node Unavailable'}
                    icon={<ShieldCheck size={14} className={isApiHealthy ? 'text-emerald-500' : 'text-rose-500'} />}
                  />
                </div>
              </div>
            </div>
            <Sparkles size={180} className="absolute -bottom-10 -right-10 text-brand-500/5 dark:text-brand-500/10 rotate-12 scale-150 transition-transform duration-700 hover:rotate-45" />
          </section>

          <section className="bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-xl overflow-hidden shadow-slate-900/5">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Critical Incidents</h3>
              <button onClick={() => navigate('/admin-tickets')} className="text-[10px] font-black uppercase text-brand-600 hover:text-brand-700 transition-all flex items-center gap-2 pr-2">
                View Pipeline <ChevronRightIcon size={14} className="" />
              </button>
            </div>

            <div className="space-y-2">
              {highPriorityTickets.length === 0 ? (
                <div className="py-10 text-center opacity-40 italic text-sm font-black text-slate-400">Zero critical alerts in queue</div>
              ) : (
                highPriorityTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-3xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group cursor-pointer" onClick={() => navigate('/admin-tickets')}>
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg animate-pulse shrink-0" />
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors truncate max-w-sm">{ticket.summary}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{ticket.id}</p>
                      </div>
                    </div>
                    <ChevronRightIcon size={16} className="text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900 dark:bg-brand-600 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Team Velocity</h3>
                <p className="text-3xl font-black tracking-tighter italic">98.2% <span className="text-sm not-italic font-bold opacity-60">CSAT</span></p>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-80">Your team has resolved {stats.resolved} tickets using the integrated AI copilot workflow.</p>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-inner">
                Performance Reports
              </button>
            </div>
            <div className="absolute right-[-20%] bottom-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </section>

          <section className="bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 space-y-6 shadow-xl shadow-slate-900/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Live Orchestration</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((value) => (
                <div key={value} className="flex items-center gap-4 animate-pulse-slow">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                    <Bot size={14} />
                  </div>
                  <div className="h-2 flex-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500/20" style={{ width: `${30 + value * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest opacity-60 italic">Waiting for new input streams...</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon, trend, highlight }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const end = typeof value === 'number' ? value : Number.parseInt(value, 10);
    const step = end / 50 || 1;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 10);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={cn('bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/5 group relative overflow-hidden', highlight)}>
      <div className="flex items-start justify-between relative z-10">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl group-hover:bg-brand-600 group-hover:text-white transition-all scale-110 shadow-sm shadow-inner">
          {icon}
        </div>
        <div className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner transition-all', trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10')}>
          {trend}
        </div>
      </div>
      <div className="mt-8 relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none italic">{displayValue}{typeof value === 'string' && value.includes('%') ? '%' : ''}</h3>
      </div>
      <div className="absolute right-0 bottom-0 opacity-10 blur-xl group-hover:opacity-30 transition-opacity">
        {icon}
      </div>
    </div>
  );
}

function InsightChip({ label, icon }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
      <span className="text-brand-600 dark:text-brand-400">{icon}</span>
      <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest">{label}</span>
    </div>
  );
}

function ChevronRightIcon({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>;
}
