import React, { useEffect, useState } from 'react';
import { Inbox, Search, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useTicketStore } from '../store/useTicketStore';
import { Badge, Button, cn, EmptyState } from './ui/Primitives';
import CopilotPanel from './CopilotPanel';

export default function Tickets() {
  const { tickets, isLoading, error, initializeTickets, resolveTicket, deleteTicket } = useTicketStore();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initializeTickets();
  }, [initializeTickets]);

  const severityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const filteredTickets = [...tickets]
    .filter((t) => t.summary.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((t) => activeTab === 'all' || (activeTab === 'active' ? t.status !== 'Resolved' : t.status === 'Resolved'))
    .sort((a, b) => {
      if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
      if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
      return (severityWeight[b.severity?.toUpperCase()] || 0) - (severityWeight[a.severity?.toUpperCase()] || 0);
    });

  const handleResolve = async (id) => {
    try {
      await resolveTicket(id);
      setSelectedTicketId(null);
      toast.success(`Ticket ${id} marked as resolved`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      if (selectedTicketId === id) setSelectedTicketId(null);
      toast.success(`Ticket ${id} deleted`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Pipeline</h1>
          <p className="text-slate-500 text-sm">Manage and resolve incoming AI-analyzed incidents.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')}>Active</TabButton>
            <TabButton active={activeTab === 'resolved'} onClick={() => setActiveTab('resolved')}>Resolved</TabButton>
            <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>History</TabButton>
          </div>
          <div className="relative w-full md:w-64 group">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Clock size={24} className="animate-spin" />
              <p className="text-sm font-medium">Syncing with backend...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <EmptyState title="All caught up" description="No tickets match the current filters." icon={Inbox} />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <th className="px-8 py-4">ID</th>
                  <th className="px-6 py-4">Summary</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Urgency</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => t.status !== 'Resolved' && setSelectedTicketId(t.id)}
                    className={cn(
                      'group cursor-pointer transition-colors hover:bg-slate-50/50',
                      selectedTicketId === t.id && 'bg-slate-50/80',
                      t.status === 'Resolved' && 'opacity-50 grayscale-[50%]'
                    )}
                  >
                    <td className="px-8 py-5 font-mono text-[11px] text-slate-400">{t.id}</td>
                    <td className="px-6 py-5">
                      <p className="text-slate-900 font-semibold truncate max-w-sm">{t.summary}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-500 font-medium">{t.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={t.severity?.toUpperCase() === 'HIGH' ? 'danger' : t.severity?.toUpperCase() === 'MEDIUM' ? 'warning' : 'success'}>
                        {t.severity}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div onClick={() => setSelectedTicketId(null)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
          <CopilotPanel ticket={selectedTicket} onClose={() => setSelectedTicketId(null)} onResolve={handleResolve} />
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600">
           Connection Error: {error}
        </div>
      )}
    </div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={cn('px-1 py-1 text-[11px] font-bold uppercase tracking-widest relative transition-colors', active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600')}>
      {children}
      {active && <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-slate-900" />}
    </button>
  );
}
