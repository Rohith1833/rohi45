import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  Search,
  Zap,
  ChevronRight,
  LogOut,
  Command,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, Button } from '../components/ui/Primitives';
import KeywordManager from '../components/KeywordManager';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { name: 'Tickets', icon: MessageSquare, path: '/admin-tickets' },
  ];

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200 flex flex-col z-[45] transition-transform duration-300 lg:relative lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <h2 className="font-bold text-slate-900 tracking-tight text-base italic uppercase">EchoDesk</h2>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive 
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 bg-white/50">
          <div className="flex items-center gap-3 px-2 py-2">
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">AS</div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-none">Alex Support</p>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-1">Lead Admin</p>
             </div>
             <LogOut size={14} className="text-slate-300 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-100 rounded-lg text-slate-600">
               <span className="sr-only">Open menu</span>
               <Search size={18} />
             </button>
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsCommandOpen(true)}>
               <Command size={14} className="text-slate-400" />
               <p className="text-xs font-medium text-slate-500 tracking-tight">Search (Cmd + K)</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
              <Button 
                variant="primary"
                size="sm"
                onClick={() => setIsRulesOpen(true)}
                className="gap-2"
              >
                <ShieldAlert size={14} />
                <span className="hidden sm:inline">Intent Engine</span>
              </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
          <Outlet />
        </main>
      </div>

      <KeywordManager isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
