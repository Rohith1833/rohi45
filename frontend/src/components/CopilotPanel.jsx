import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  X,
  Wand2,
  Send,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
  Target,
  MessageSquare,
  Check,
} from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import { Badge, Button, cn } from './ui/Primitives';

export default function CopilotPanel({ ticket, onClose, onResolve }) {
  const navigate = useNavigate();
  const { isResolving } = useTicketStore();
  const [replyText, setReplyText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (ticket) {
      setReplyText(
        ticket.copilot?.replyDraft ||
          `Hello, thank you for reaching out.\n\nI have analyzed your request regarding ${ticket.category}. Our team is currently investigating this incident.`
      );
    }
  }, [ticket]);

  const handleRewrite = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let base = "";
      if (tone === 'Friendly') base = `Hi! Thanks for reaching out. We're looking into the ${ticket.category} issue right now and will get back to you soon!`;
      if (tone === 'Apologetic') base = `We apologize for the inconvenience. We've prioritized this ${ticket.category} incident as ${ticket.severity} and are working on a resolution.`;
      if (tone === 'Professional') base = `Our engineering team is analyzing the reported ${ticket.category} escalation. We will provide updates as they become available.`;
      setReplyText(base);
      setIsGenerating(false);
    }, 800);
  };

  const handleSendAndClose = async () => {
    setIsSending(true);
    try {
      const response = await fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Response to ${ticket.category} Issue`,
          description: replyText,
          status: 'Resolved'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send and store ticket data');
      }

      toast.success('Response sent and recorded successfully');
      onClose();
      navigate('/admin-tickets');
    } catch (error) {
      toast.error(error.message || 'Error processing request');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full md:w-[480px] h-full bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">AI Copilot</h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              Analysis Engine Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
        <section className="space-y-4">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contextual Intent</h3>
           <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-sm">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">{ticket.user?.name?.charAt(0) || 'U'}</div>
                <div>
                  <h4 className="text-sm font-bold">{ticket.user?.name || 'End User'}</h4>
                  <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">{ticket.user?.company || 'Service Request'}</p>
                </div>
             </div>
           </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Neural Diagnosis</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-600">{ticket.confidence || 85}% Confidence</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <AnalysisBox label="Category" value={ticket.category} />
             <AnalysisBox label="Urgency" value={ticket.severity} />
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
             <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-slate-900" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Reasoning Steps</span>
             </div>
             <div className="space-y-3">
                {(ticket.reasoning || ['Pattern matched recurring issue', 'User sentiment identified as urgent']).map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={12} className="mt-0.5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium text-slate-600">{step}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        <section className="space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Draft Response</h3>
             <select 
               value={tone} 
               onChange={(e) => setTone(e.target.value)}
               className="text-[10px] font-bold uppercase bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
             >
               <option>Professional</option>
               <option>Friendly</option>
               <option>Apologetic</option>
             </select>
           </div>
           <div className="relative group">
             <textarea
               value={replyText}
               onChange={(e) => setReplyText(e.target.value)}
               className="w-full h-40 p-5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all resize-none leading-relaxed"
               placeholder="Drafting response..."
             />
             <button
               onClick={handleRewrite}
               disabled={isGenerating}
               className="absolute bottom-3 right-3 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg"
             >
               <Wand2 size={16} className={cn(isGenerating && 'animate-spin')} />
             </button>
           </div>
        </section>

        <section className="space-y-3">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={<Target size={14} />} label="Extract Logs" />
              <ActionButton icon={<MessageSquare size={14} />} label="Internal Note" />
           </div>
        </section>
      </div>

      <div className="p-8 border-t border-slate-100 bg-white sticky bottom-0">
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => onResolve(ticket.id)} 
            disabled={isResolving || isSending}
            className="h-12 rounded-xl"
          >
            {isResolving ? 'Resolving...' : 'Resolve Incident'}
          </Button>
          <Button 
            fullWidth
            onClick={handleSendAndClose}
            disabled={isSending || isResolving}
            className="h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Send & Close'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AnalysisBox({ label, value }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label }) {
  return (
    <button className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-[10px] font-bold uppercase tracking-widest text-slate-600">
      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-900">{icon}</div>
      {label}
    </button>
  );
}
