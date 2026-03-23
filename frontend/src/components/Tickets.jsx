import React, { useEffect, useState } from 'react';
import { Clock, Inbox, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const severityWeight = { High: 3, Medium: 2, Low: 1 };
  const filteredTickets = [...tickets]
    .filter((ticket) => ticket.summary.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.id.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((ticket) => activeTab === 'all' || (activeTab === 'active' ? ticket.status !== 'Resolved' : ticket.status === 'Resolved'))
    .sort((left, right) => {
      if (left.status === 'Resolved' && right.status !== 'Resolved') return 1;
      if (left.status !== 'Resolved' && right.status === 'Resolved') return -1;
      return severityWeight[right.severity] - severityWeight[left.severity];
    });

  const handleResolve = async (id) => {
    try {
      await resolveTicket(id);
      setSelectedTicketId(null);
      toast.success(`Ticket ${id} marked as resolved`);
    } catch (resolveError) {
      toast.error(resolveError.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      if (selectedTicketId === id) {
        setSelectedTicketId(null);
      }
      toast.success(`Ticket ${id} deleted`);
    } catch (deleteError) {
      toast.error(deleteError.message);
    }
  };

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-6 md:space-y-12 pb-20 font-sans"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">All Tickets</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Incident History & Current Backlog</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl overflow-hidden min-h-[500px] md:min-h-[600px]">
        <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')}>Active Pipeline</TabButton>
            <TabButton active={activeTab === 'resolved'} onClick={() => setActiveTab('resolved')}>Resolved</TabButton>
            <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>History</TabButton>
          </div>
          <div className="relative w-80 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by ID or issue..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-bold focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500/50 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <EmptyState title="Loading tickets" description="Fetching the latest support queue from the backend." icon={Clock} />
          ) : filteredTickets.length === 0 ? (
            <EmptyState title="All caught up" description="No tickets match the current filters." icon={Inbox} />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800 text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">
                  <th className="px-10 py-6">ID</th>
                  <th className="px-8 py-6">Summary</th>
                  <th className="px-8 py-6">Account</th>
                  <th className="px-8 py-6">Tier</th>
                  <th className="px-8 py-6">Detected</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm font-bold">
                {filteredTickets.map((ticket) => (
                  <motion.tr
                    key={ticket.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => ticket.status !== 'Resolved' && setSelectedTicketId(ticket.id)}
                    className={cn(
                      'group cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 relative',
                      selectedTicketId === ticket.id && 'bg-brand-500/5 dark:bg-brand-500/10',
                      ticket.status === 'Resolved' && 'opacity-40 grayscale'
                    )}
                  >
                    <td className="px-10 py-6 font-mono text-[11px] text-slate-400 uppercase tracking-tighter relative">
                      {selectedTicketId === ticket.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-600 shadow-xl" />
                      )}
                      {ticket.id}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors truncate max-w-[280px] font-black tracking-tight leading-tight">{ticket.summary}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 italic border border-slate-200/50">
                          {ticket.user.company.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ticket.user.company}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant={ticket.severity === 'High' ? 'danger' : ticket.severity === 'Medium' ? 'warning' : 'success'}>{ticket.severity}</Badge>
                    </td>
                    <td className="px-8 py-6 text-slate-400 text-xs font-bold font-mono">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ticket.status === 'Resolved' ? <Badge variant="success">RESOLVED</Badge> : (
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 border border-slate-100 dark:border-slate-800 rounded-xl px-4">
                            Details
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 border border-rose-100 text-rose-600 rounded-xl px-4"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(ticket.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTicketId(null)} className="fixed inset-0 bg-slate-900/40 z-40" />
            <CopilotPanel ticket={selectedTicket} onClose={() => setSelectedTicketId(null)} onResolve={handleResolve} />
          </>
        )}
      </AnimatePresence>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
          Backend error: {error}
        </div>
      )}
    </motion.div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={cn('px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] relative', active ? 'text-brand-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white')}>
      {children}
      {active && <motion.div layoutId="tickets-tab" className="absolute -bottom-4 left-0 right-0 h-1 bg-brand-600 rounded-full" />}
    </button>
  );
}
