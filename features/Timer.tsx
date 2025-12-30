import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, SkipForward, Flame, Coffee, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Timer: React.FC = () => {
  const {
    timerMode,
    timeLeft,
    isActive,
    settings,
    tickTimer,
    toggleTimer,
    resetTimer,
    completeSession,
    setTimerMode,
    activeTaskId,
    tasks
  } = useStore();

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(tickTimer, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, tickTimer]);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = () => {
    switch(timerMode) {
      case 'FOCUS': return 'Focus Session';
      case 'SHORT_BREAK': return 'Short Pause';
      case 'LONG_BREAK': return 'Long Rest';
      default: return 'Idle';
    }
  };

  const getModeIcon = () => {
    switch(timerMode) {
      case 'FOCUS': return <Flame size={16} className="text-cozy-amber" />;
      case 'SHORT_BREAK': return <Coffee size={16} className="text-cozy-sage" />;
      case 'LONG_BREAK': return <Moon size={16} className="text-indigo-300" />;
      default: return null;
    }
  };

  const getThemeColor = () => {
     switch(timerMode) {
      case 'FOCUS': return '#fbbf24'; // Amber
      case 'SHORT_BREAK': return '#a7f3d0'; // Sage
      case 'LONG_BREAK': return '#a5b4fc'; // Indigo
      default: return '#fbbf24';
    }
  };

  // Progress Calculation
  let totalTime = settings.focusDuration * 60;
  if (timerMode === 'SHORT_BREAK') totalTime = settings.shortBreakDuration * 60;
  if (timerMode === 'LONG_BREAK') totalTime = settings.longBreakDuration * 60;
  
  const progress = 100 - (timeLeft / totalTime) * 100;
  
  // SVG Config
  const size = 380;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2 - 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const color = getThemeColor();

  return (
    <div className="flex flex-col items-center justify-center w-full relative z-10 px-4">
      
      {/* Main Timer Display Container */}
      <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] flex items-center justify-center mb-6 md:mb-8 transition-all duration-300">
        
        {/* Soft Glow Behind */}
        <div 
          className="absolute inset-0 rounded-full blur-[60px] md:blur-[80px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: color }} 
        />

        {/* Progress Ring SVG */}
        <div className="absolute inset-0 w-full h-full transform -rotate-90">
             <svg 
               viewBox={`0 0 ${size} ${size}`} 
               className="w-full h-full overflow-visible"
             >
                {/* Track */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                
                {/* Main Indicator */}
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "linear" }}
                  strokeLinecap="round"
                  className="opacity-90 drop-shadow-md"
                />
             </svg>
        </div>

        {/* Center Content */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center"
          animate={{ scale: isActive ? 1.02 : 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <motion.div 
            key={timeLeft}
            className="text-[64px] sm:text-[84px] md:text-[110px] font-serif font-normal leading-none text-stone-100 tracking-tight tabular-nums transition-all duration-300 select-none"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-4 bg-stone-800/40 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-white/5 backdrop-blur-md">
              {getModeIcon()}
              <span className="text-xs md:text-sm font-serif italic text-stone-300 tracking-wide">
                {getModeLabel()}
              </span>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 md:gap-6 mb-8 md:mb-10 z-20"
      >
         <button 
           onClick={toggleTimer}
           className="group relative bg-stone-200 text-stone-900 rounded-full h-14 w-20 md:h-16 md:w-24 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
         >
            <span className="relative z-10 flex items-center gap-2">
                {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </span>
         </button>

         <div className="flex gap-3">
            <button 
                onClick={resetTimer}
                className="bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-all rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-white/5 backdrop-blur-sm group"
                title="Reset"
            >
                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>

            <button 
                onClick={completeSession}
                className="bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-all rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-white/5 backdrop-blur-sm group"
                title="Skip"
            >
                <SkipForward size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </motion.div>

      {/* Active Task Pill */}
      <AnimatePresence>
        {activeTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-12 md:-bottom-16 z-20 w-full flex justify-center px-4"
          >
             <div className="bg-stone-900/80 px-4 py-2.5 md:px-6 md:py-3 rounded-xl border border-white/10 backdrop-blur-xl flex items-center gap-3 md:gap-4 shadow-lg cursor-default max-w-sm md:max-w-md w-full">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cozy-amber shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                   <span className="text-[9px] md:text-[10px] text-stone-400 font-bold tracking-wider uppercase">Focusing On</span>
                   <span className="text-stone-200 font-serif text-base md:text-lg italic truncate">{activeTask.title}</span>
                </div>
                <div className="text-[10px] md:text-xs font-sans font-bold text-stone-500 bg-white/5 px-2 py-1 rounded">
                  {activeTask.completedPomodoros} / {activeTask.estimatedPomodoros}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};