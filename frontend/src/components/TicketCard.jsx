import React from 'react';
import { AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from './ui/Primitives';

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();
  const getSeverityVariant = (severity) => {
    const s = severity?.toUpperCase();
    if (s === 'HIGH') return 'danger';
    if (s === 'MEDIUM') return 'warning';
    return 'success';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full bg-slate-50/10">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">{ticket.id}</h3>
            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">System ID</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-100">
          <span className="text-lg">{ticket.emotion?.emoji || '😐'}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">{ticket.emotion?.label || 'Neutral'}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Summary</p>
          <p className="text-sm text-slate-900 font-semibold leading-relaxed">{ticket.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
             <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Category</p>
             <p className="text-xs font-semibold text-slate-700">{ticket.category}</p>
          </div>
          <div>
             <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Urgency</p>
             <Badge variant={getSeverityVariant(ticket.severity)}>{ticket.severity}</Badge>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 italic">
            <AlertCircle size={12} /> Live Event
         </div>
         <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/admin-tickets')}
          className="text-indigo-600 hover:bg-white font-bold"
         >
            Detail <ArrowRight size={14} className="ml-1.5" />
         </Button>
      </div>
    </div>
  );
}
