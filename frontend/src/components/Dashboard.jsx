import React, { useEffect } from 'react';
import {
  AlertTriangle,
  Bot,
  Inbox,
  Smile,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from '../store/useTicketStore';
import { cn, Skeleton, Button } from './ui/Primitives';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tickets, getStats, initializeTickets, isLoading, isApiHealthy, enableSync } = useTicketStore();

  useEffect(() => {
    initializeTickets();
    const interval = enableSync(15000); 
    return () => clearInterval(interval);
  }, [initializeTickets, enableSync]);

  const stats = getStats();
  const highPriorityTickets = tickets
    .filter((ticket) => ticket.severity?.toUpperCase() === 'HIGH' && ticket.status !== 'Resolved')
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Overview</h1>
        <p className="text-slate-500 text-sm">Real-time performance and ticket pipeline analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoading ? [1, 2, 3, 4].map((v) => <Skeleton key={v} className="h-32 rounded-2xl" />) : (
          <>
            <StatCard label="Total Volume" value={stats.total} icon={<Inbox size={18} />} />
            <StatCard label="Critical" value={stats.high} icon={<AlertTriangle size={18} className="text-rose-500" />} />
            <StatCard label="Avg CSAT" value={stats.csat} icon={<Smile size={18} className="text-emerald-500" />} />
            <StatCard label="MTTR" value={`${stats.avgResolution}m`} icon={<TrendingUp size={18} className="text-indigo-600" />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-slate-900 text-white rounded-lg">
                 <Bot size={18} />
               </div>
               <h2 className="text-lg font-semibold text-slate-900">AI Intelligence</h2>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              The AI engine is currently processing incoming message streams. 
              <span className="font-bold text-slate-900 ml-1">{stats.high} critical cases</span> require immediate attention.
            </p>

            <div className="flex flex-wrap gap-3">
              <StatusChip label={`API: ${isApiHealthy ? 'HEALTHY' : 'OFFLINE'}`} active={isApiHealthy} />
              <StatusChip label={`${stats.total} Active Threads`} active={true} />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Critical Incidents</h3>
               <button onClick={() => navigate('/admin-tickets')} className="text-xs font-bold text-slate-900 hover:underline">View All</button>
            </div>

            <div className="divide-y divide-slate-100">
              {highPriorityTickets.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic text-sm">No critical incidents found.</div>
              ) : (
                highPriorityTickets.map((ticket) => (
                  <div key={ticket.id} onClick={() => navigate('/admin-tickets')} className="flex items-center justify-between py-4 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.summary}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Team Performance</p>
              <h3 className="text-3xl font-bold tracking-tighter">98.2% <span className="text-xs font-medium opacity-50 uppercase ml-1">CSAT</span></h3>
              <p className="text-[11px] leading-relaxed opacity-60">Sustained high-velocity resolutions across all active service channels.</p>
              <Button variant="secondary" size="sm" className="w-full bg-white/10 border-white/10 text-white hover:bg-white/20">
                Full Report
              </Button>
            </div>
            <Zap size={80} className="absolute -bottom-4 -right-4 opacity-10" />
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Engine Health</h3>
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center gap-3">
                 <div className="w-1 h-1 rounded-full bg-slate-400" />
                 <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900" style={{ width: `${40 + i * 15}%` }} />
                 </div>
               </div>
             ))}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

function StatusChip({ label, active }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-xl">
      <div className={cn("w-1 h-1 rounded-full", active ? "bg-emerald-500" : "bg-slate-300")} />
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function ChevronRight({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>;
}
