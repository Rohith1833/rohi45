import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  Bell, 
  Search,
  Zap,
  ChevronRight,
  LogOut,
  Sparkles,
  SearchIcon,
  Command,
  Moon,
  Sun,
  X,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, Button } from '../components/ui/Primitives';
import KeywordManager from '../components/KeywordManager';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Command Palette listener
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode activated`, { duration: 1000 });
  };

  const navItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { name: 'Tickets', icon: MessageSquare, path: '/admin-tickets' },
  ];

  return (
    <div className={cn("flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans transition-colors duration-500", isDarkMode && "dark bg-[#0b0f1a] text-slate-100")}>
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[40] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Command Palette Mockup */}
      <AnimatePresence>
        {isCommandOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto" 
              onClick={() => setIsCommandOpen(false)}
            />
            <motion.div 
               initial={{ opacity: 0, y: -20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -20, scale: 0.95 }}
               className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-20 pointer-events-auto"
            >
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <SearchIcon size={20} className="text-slate-400" />
                  <input type="text" placeholder="Search anything (Cmd + K)..." className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium outline-none placeholder:text-slate-400 dark:text-white" autoFocus />
                  <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-400 border border-slate-200 dark:border-slate-700">ESC</div>
               </div>
               <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                 {navItems.map(item => (
                   <div 
                    key={item.path} 
                    onClick={() => { navigate(item.path); setIsCommandOpen(false); }}
                    className="flex items-center justify-between p-4 bg-slate-50/20 dark:bg-slate-800/20 hover:bg-brand-500 hover:text-white rounded-2xl cursor-pointer group transition-all"
                   >
                     <div className="flex items-center gap-4">
                        <item.icon size={18} className="text-slate-400 group-hover:text-white" />
                        <span className="font-bold tracking-tight">{item.name}</span>
                     </div>
                     <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
                 <div className="p-4 flex items-center justify-between text-slate-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all cursor-pointer group">
                    <div className="flex items-center gap-4"><LogOut size={18} /> <span className="font-bold tracking-tight">Logout</span></div>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0f1423] border-r border-slate-200 dark:border-slate-800 flex flex-col z-[45] shadow-2xl transition-all duration-500 lg:relative lg:translate-x-0 lg:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 pb-4 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
              <Zap size={22} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 dark:text-white tracking-tighter text-lg leading-none italic">EchoDesk</h2>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] leading-none mt-1.5 opacity-80">Quantum</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-500 hover:text-brand-600 active:scale-95 shadow-inner">
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-5 mt-6 space-y-2">
           <p className="px-3 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.25em] mb-4">Operations Center</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-4 py-3 rounded-[1.25rem] text-sm font-bold transition-all duration-300 group",
                isActive 
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20 translate-x-1" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className={cn(
                  "transition-colors",
                  location.pathname === item.path ? "text-white" : "text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                )} />
                {item.name}
              </div>
              {location.pathname === item.path && (
                <Sparkles size={14} className="text-white animate-pulse" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50/50 dark:bg-slate-800/10">
          <div className="flex items-center gap-4 px-3 py-2 cursor-pointer group">
             <div className="w-10 h-10 rounded-2xl bg-slate-900 border-2 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-white font-black text-xs">AS</div>
             <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">Alex Support</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Lead Strategist</p>
             </div>
             <LogOut size={16} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
          </div>
        </div>
      </aside>

      <div className={cn("flex-1 flex flex-col min-w-0 overflow-hidden relative transition-colors duration-300", isDarkMode && "dark")}>
        <header className="h-20 bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-10 shrink-0 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 lg:gap-6 flex-1">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500">
               <span className="sr-only">Open menu</span>
               <div className="space-y-1.5 w-5">
                 <div className="h-0.5 w-full bg-current rounded-full" />
                 <div className="h-0.5 w-full bg-current rounded-full" />
                 <div className="h-0.5 w-3/4 bg-current rounded-full" />
               </div>
             </button>
             <div className="hidden sm:flex items-center gap-2 group cursor-pointer" onClick={() => setIsCommandOpen(true)}>
               <Command size={16} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
               <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Search & Command Palette (Cmd + K)</p>
             </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-5">
             <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Active</span>
             </div>
             <button 
              onClick={() => setIsRulesOpen(true)}
              className="flex items-center gap-2 px-3 py-2.5 lg:px-4 lg:py-2 bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95 group overflow-hidden relative"
             >
                <ShieldAlert size={14} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">Neural Intent Engine</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative scroll-smooth bg-slate-50/20 dark:bg-[#0b0f1a]/10">
          <Outlet />
        </main>
      </div>

      {/* Global Intent Manager Modal */}
      <KeywordManager isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
