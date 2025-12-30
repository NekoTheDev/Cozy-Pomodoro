import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export const DailyProgress: React.FC = () => {
  const { sessionsToday, settings } = useStore();
  
  const goal = settings.dailyGoal || 4;
  const percentage = Math.min((sessionsToday / goal) * 100, 100);
  
  // SVG Config
  const size = 56; // w-14 = 56px
  const center = size / 2;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isComplete = sessionsToday >= goal;

  return (
    <div className="flex flex-col items-center gap-2 group cursor-default">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg 
            viewBox={`0 0 ${size} ${size}`} 
            className="transform -rotate-90 w-full h-full overflow-visible"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-white/10"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx={center}
            cy={center}
            r={radius}
            stroke={isComplete ? '#fb923c' : '#60a5fa'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className="transition-colors duration-500 drop-shadow-sm"
          />
        </svg>

        {/* Center Data */}
        <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
           <span className={`text-sm font-bold ${isComplete ? 'text-cozy-orange' : 'text-white'}`}>
             {sessionsToday}
           </span>
           <div className="w-4 h-[1px] bg-white/20 my-0.5"></div>
           <span className="text-[10px] text-gray-400 font-sans">{goal}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-medium text-gray-400 font-sans tracking-wide">
          DAILY GOAL
        </span>
      </div>
    </div>
  );
};