import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LayoutDashboard, BarChart2, Settings, LogOut, Calendar, StickyNote, ScanEye, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ToastContainer } from './ui/CyberComponents';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC = () => {
  const { user, logout, toast, isZenMode } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCompact, setIsCompact] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Study', icon: LayoutDashboard },
    { path: '/stats', label: 'Stats', icon: BarChart2 },
    { path: '/calendar', label: 'Plan', icon: Calendar },
    { path: '/notes', label: 'Notes', icon: StickyNote },
    // Deep Focus is usually accessed via Dashboard, but kept in settings/desktop nav
    { path: '/settings', label: 'Config', icon: Settings },
  ];

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="h-[100dvh] bg-cozy-dark text-cozy-text flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isCompact ? 88 : 280, 
              opacity: 1,
              transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-cozy-dark border-r border-white/5 hidden md:flex flex-col h-full z-20 shrink-0 overflow-hidden whitespace-nowrap relative"
          >
            {/* --- DECORATIONS --- */}
            
            {/* Subtle top-left glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-cozy-amber/5 blur-[100px] pointer-events-none opacity-20" />
            
            {/* Vertical accent line on the very left */}
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-cozy-amber/0 via-cozy-amber/20 to-cozy-amber/0 opacity-50" />

            {/* Sidebar Content Container */}
            <div className="flex flex-col h-full relative z-10">
              
              {/* Header */}
              <div className={`flex items-center gap-4 transition-all duration-300 ${isCompact ? 'p-6 justify-center' : 'p-8 pb-6'}`}>
                {/* Logo Icon */}
                <div className="relative group shrink-0 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="absolute inset-0 bg-cozy-amber blur-[20px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <div className="relative p-1 bg-gradient-to-br from-stone-900 to-black rounded-2xl border border-white/10 text-cozy-amber shadow-2xl group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/5 overflow-hidden">
                      <img src="https://i.pinimg.com/1200x/f9/72/50/f972503d193b177d10dd8e375397364c.jpg" alt="Logo" className="w-8 h-8 object-cover rounded-xl" />
                    </div>
                </div>

                <motion.div 
                  animate={{ opacity: isCompact ? 0 : 1, width: isCompact ? 0 : 'auto' }}
                  className="overflow-hidden flex flex-col justify-center"
                >
                  <h1 className="text-lg font-bold tracking-tight text-white leading-none mb-1">
                    Cozy<span className="text-stone-500 font-normal">Focus</span>
                  </h1>
                  <span className="text-[10px] text-cozy-amber/80 font-mono tracking-[0.2em] uppercase">Sanctuary</span>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
                {!isCompact && (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }}
                     className="px-4 py-2 flex items-center gap-3 opacity-60 group"
                   >
                     <div className="h-[1px] w-6 bg-stone-700 transition-all group-hover:w-12"></div>
                     <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                       Main Menu
                     </span>
                   </motion.div>
                )}
                
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={isCompact ? item.label : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium overflow-hidden ${
                        isActive 
                        ? 'text-white' 
                        : 'text-stone-500 hover:text-stone-200'
                      } ${isCompact ? 'justify-center px-2' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Background Glow */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-xl z-0"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        {/* Icon */}
                        <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-cozy-amber' : 'group-hover:scale-105'}`}>
                           <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        </div>

                        {/* Label */}
                        {!isCompact && (
                          <motion.span 
                             className="relative z-10 font-medium tracking-wide"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                          >
                            {item.label}
                          </motion.span>
                        )}

                        {/* Right Active Indicator Dot */}
                        {!isCompact && isActive && (
                           <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cozy-amber shadow-[0_0_8px_rgba(251,191,36,0.8)] z-10"
                           />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="my-4 mx-4 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                <NavLink
                    to="/focus"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium ${
                        isActive ? 'text-white' : 'text-stone-500 hover:text-stone-200'
                      } ${isCompact ? 'justify-center px-2' : ''}`
                    }
                  >
                    <div className="relative z-10 p-1 rounded-md bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                       <ScanEye size={16} />
                    </div>
                    {!isCompact && (
                      <span className="relative z-10 tracking-wide">Deep Focus</span>
                    )}
                  </NavLink>
              </nav>

              {/* Footer / User Profile */}
              <div className={`mt-auto relative z-10 ${isCompact ? 'p-4 flex flex-col gap-4 items-center' : 'p-6 space-y-4'}`}>
                
                {/* Decorative separator only if not compact */}
                {!isCompact && <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-2" />}

                {/* User Card - Seamless */}
                <div className={`relative group flex items-center gap-3 rounded-2xl transition-all duration-300 ${isCompact ? 'justify-center p-0' : 'p-3 hover:bg-white/5 cursor-default'}`}>
                  
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img src={user?.avatar} alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-black grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cozy-dark rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>

                  {/* Text Info */}
                  {!isCompact && (
                    <div className="flex flex-col overflow-hidden min-w-0">
                      <span className="text-sm font-bold text-stone-200 truncate group-hover:text-white transition-colors">{user?.name}</span>
                      <span className="text-[10px] text-emerald-500/80 font-mono uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                         Online
                      </span>
                    </div>
                  )}

                  {/* Settings / Logout (Hover Reveal on desktop non-compact) */}
                  {!isCompact && (
                     <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        <button 
                          onClick={handleLogout}
                          className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all"
                          title="Sign Out"
                        >
                          <LogOut size={16} />
                        </button>
                     </div>
                  )}
                </div>

                {/* Collapse Toggle */}
                <button
                  onClick={() => setIsCompact(!isCompact)}
                  className={`flex items-center justify-center text-stone-600 hover:text-cozy-amber transition-colors ${isCompact ? 'w-full py-2 hover:bg-white/5 rounded-lg' : 'absolute top-[-20px] right-6 bg-cozy-dark border border-white/5 rounded-full p-1.5 shadow-xl scale-75 hover:scale-100 transition-all duration-300'}`}
                  title={isCompact ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                   {isCompact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
              </div>

            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 relative flex flex-col w-full ${isDashboard ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar p-4 md:p-8'} pb-24 md:pb-0`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <AnimatePresence>
        {!isZenMode && (
          <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-cozy-dark/95 backdrop-blur-xl border-t border-white/5 pb-safe">
            <div className="flex justify-around items-center p-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                      isActive 
                      ? 'text-cozy-amber' 
                      : 'text-stone-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} className="mb-1" strokeWidth={2} />
                      <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                      {/* Active Indicator Dot */}
                      <span className={`w-1 h-1 rounded-full mt-1 transition-all ${isActive ? 'bg-cozy-amber shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'bg-transparent'}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {toast && <ToastContainer message={toast.message} type={toast.type} />}
    </div>
  );
};