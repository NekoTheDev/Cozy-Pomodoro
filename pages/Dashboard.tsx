import React, { useEffect, useState } from 'react';
import { Timer } from '../features/Timer';
import { TaskBoard } from '../features/TaskBoard';
import { ThemePicker } from '../features/ThemePicker';
import { StreakCounter } from '../features/StreakCounter';
import { DailyProgress } from '../features/DailyProgress';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Clock, 
  Maximize2, 
  PanelRightClose, 
  PanelRightOpen,
  Volume2,
  VolumeX,
  Minimize2,
  Tent
} from 'lucide-react';
import { Particles } from '../components/ui/Particles';

const Dashboard: React.FC = () => {
  const { 
    isTaskPanelOpen, 
    toggleTaskPanel, 
    isZenMode, 
    toggleZenMode,
    backgroundImage,
    soundEnabled,
    toggleSound,
    setTimerMode,
    timerMode
  } = useStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const cycleTimerMode = () => {
    if (timerMode === 'FOCUS') setTimerMode('SHORT_BREAK');
    else if (timerMode === 'SHORT_BREAK') setTimerMode('LONG_BREAK');
    else setTimerMode('FOCUS');
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden transition-all duration-1000 bg-cozy-dark">
      
      {/* Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={backgroundImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-60"
          />
          {/* Soft Overlay */}
          <div className="absolute inset-0 bg-cozy-dark/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-cozy-dark via-transparent to-cozy-dark/50" />
        </motion.div>
      </AnimatePresence>
      
      {/* Ambient Fireflies */}
      <Particles />

      {/* Main Content */}
      <div className={`flex-1 relative z-10 flex flex-col transition-all duration-700 w-full`}>
        {/* Top Bar - Responsive Stacking */}
        <div className={`p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-opacity duration-500 ${isZenMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
           
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/5 self-start"
           >
              <button onClick={toggleSound} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {soundEnabled ? <Volume2 size={16} className="text-orange-300" /> : <VolumeX size={16} className="text-gray-400" />}
                <span className="text-xs font-medium text-gray-200">
                  {soundEnabled ? 'Ambience On' : 'Muted'}
                </span>
              </button>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-6 md:gap-8 bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 transition-all duration-300 self-end md:self-auto ${isTaskPanelOpen ? 'md:mr-0' : 'md:mr-12'}`}
           >
              <StreakCounter />
              <div className="w-px bg-white/10" />
              <DailyProgress />
           </motion.div>
        </div>

        {/* Timer */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto custom-scrollbar min-h-0">
           <Timer />
        </div>

        {/* Bottom Dock */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`p-4 md:p-8 flex justify-center pb-20 md:pb-12 transition-all duration-500 ${isZenMode ? 'translate-y-32 hover:translate-y-0' : 'translate-y-0'}`}
        >
           {/* Responsive Container for dock items */}
           <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-4 md:px-8 py-3 md:py-4 flex items-center justify-between md:justify-center gap-4 md:gap-8 shadow-xl hover:bg-black/40 transition-colors max-w-[calc(100vw-32px)] overflow-x-auto no-scrollbar">
              <DockItem 
                icon={ImageIcon} 
                label="Scenery" 
                onClick={() => setShowThemePicker(true)}
              />
              <DockItem 
                icon={Clock} 
                label="Mode" 
                onClick={cycleTimerMode}
                active={timerMode !== 'FOCUS'}
              />
              <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
              <DockItem 
                icon={isFullscreen ? Minimize2 : Maximize2} 
                label={isFullscreen ? "Exit Full" : "Full Screen"} 
                active={isFullscreen}
                onClick={handleFullScreen}
              />
              <DockItem 
                icon={Tent} 
                label={isZenMode ? "Exit Focus" : "Deep Focus"} 
                active={isZenMode}
                onClick={toggleZenMode}
              />
           </div>
        </motion.div>
      </div>

      {/* Right Task Panel - Responsive width */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ 
              x: isTaskPanelOpen ? 0 : "100%", 
              opacity: isTaskPanelOpen ? 1 : 0 
            }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute right-0 top-0 bottom-0 z-20 shadow-2xl h-full backdrop-blur-md bg-black/95 md:bg-black/20 w-full md:w-[400px]"
          >
            <div className="w-full h-full flex flex-col border-l border-white/5">
               {/* Mobile Only Close Button inside panel */}
               <div className="md:hidden p-4 border-b border-white/10 flex justify-end bg-black/50 backdrop-blur-lg sticky top-0 z-50">
                  <button onClick={toggleTaskPanel} className="text-gray-400 hover:text-white flex items-center gap-2">
                    <span className="text-xs uppercase font-bold">Close Panel</span>
                    <PanelRightClose size={20} />
                  </button>
               </div>
              <TaskBoard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button - Hides on mobile if panel is open to prevent clutter */}
      {!isZenMode && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            right: isTaskPanelOpen ? (window.innerWidth < 768 ? 0 : 420) : 32 // Adjust position based on screen size
          }}
          onClick={toggleTaskPanel}
          className={`absolute top-20 md:top-8 z-30 p-2.5 bg-black/40 hover:bg-white/10 text-white rounded-lg border border-white/10 backdrop-blur transition-all duration-300 hidden md:block ${isTaskPanelOpen ? 'md:right-[420px]' : 'right-4 md:right-8'}`}
        >
          {isTaskPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </motion.button>
      )}

      {/* Mobile Toggle Button (Visible only when panel closed) */}
      {!isZenMode && !isTaskPanelOpen && (
         <motion.button 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         onClick={toggleTaskPanel}
         className="md:hidden absolute top-4 right-4 z-30 p-2 bg-black/40 text-white rounded-lg border border-white/10 backdrop-blur"
       >
         <PanelRightOpen size={20} />
       </motion.button>
      )}

      <AnimatePresence>
        {showThemePicker && (
          <ThemePicker onClose={() => setShowThemePicker(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const DockItem: React.FC<{ icon: any, label: string, active?: boolean, onClick?: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 group relative min-w-[60px] shrink-0 ${active ? 'text-cozy-orange' : 'text-gray-400 hover:text-white'}`}
  >
    <div className={`p-3 rounded-xl transition-all duration-300 ${active ? 'bg-orange-500/20' : 'bg-white/5 group-hover:bg-white/10 group-hover:-translate-y-1'}`}>
      <Icon size={20} />
    </div>
    <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 absolute -top-8 bg-black/80 px-2 py-1 rounded text-white whitespace-nowrap pointer-events-none z-50">
      {label}
    </span>
  </button>
);

export default Dashboard;