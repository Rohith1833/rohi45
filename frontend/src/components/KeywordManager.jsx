import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ShieldAlert, Search, Sparkles } from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import { Button, cn, Badge } from './ui/Primitives';

export default function KeywordManager({ isOpen, onClose }) {
  const { analysisKeywords, addKeyword, removeKeyword } = useTicketStore();
  const [newKeyword, setNewKeyword] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden font-sans"
          >
             {/* Header */}
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20">
                      <ShieldAlert size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Intent Engine Rules</h2>
                      <p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest leading-none">Global escalation triggers</p>
                   </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                   <X size={20} className="text-slate-400" />
                </button>
             </div>

             <div className="p-8 space-y-8">
                {/* Input Section */}
                <form onSubmit={handleAdd} className="relative group">
                   <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-500 transition-all" />
                   <input 
                    type="text" 
                    placeholder="Register new intelligence trigger..." 
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] py-4 pl-14 pr-16 text-sm font-bold text-white focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500/50 transition-all placeholder:text-slate-400 placeholder:font-bold italic" 
                   />
                   <button 
                    type="submit"
                    disabled={!newKeyword.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-brand-600 text-white rounded-xl shadow-lg hover:bg-brand-700 disabled:opacity-0 transition-all"
                   >
                      <Plus size={20} strokeWidth={3} />
                   </button>
                </form>

                {/* Keywords List */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-2">Active Triggers ({analysisKeywords.length})</h3>
                   <div className="flex flex-wrap gap-2 min-h-[120px] items-start">
                      <AnimatePresence>
                         {analysisKeywords.map(kw => (
                            <motion.div 
                              key={kw}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-rose-500/50 hover:bg-rose-50/50 transition-all cursor-default"
                            >
                               <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter italic">{kw}</span>
                               <button 
                                onClick={() => removeKeyword(kw)}
                                className="opacity-0 group-hover:opacity-100 text-rose-500 hover:scale-110 transition-all"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </motion.div>
                         ))}
                      </AnimatePresence>
                      {analysisKeywords.length === 0 && (
                        <div className="w-full py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                           Zero dynamic triggers configured
                        </div>
                      )}
                   </div>
                </div>

                <div className="p-5 bg-brand-50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-[2rem] flex items-start gap-4">
                   <Sparkles size={20} className="text-brand-600 shrink-0" />
                   <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight">
                     Keywords added here will instantly synchronize with the <span className="font-black text-brand-600">Neural Intent Engine</span>. Chatbot escalation will trigger immediately upon matching these terms.
                   </p>
                </div>
             </div>

             <div className="p-6 bg-slate-50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 text-center">
                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl px-10">
                   Confirm Orchestration Rules
                </Button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
