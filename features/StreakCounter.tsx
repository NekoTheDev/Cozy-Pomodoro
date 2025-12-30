
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useStore } from '../store/useStore';

export const StreakCounter: React.FC = () => {
  const { streak } = useStore();

  const getColor = () => {
    if (streak > 0) return 'text-orange-400';
    return 'text-gray-600';
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={streak > 0 ? {
          scale: [1, 1.05, 1],
          filter: [
            'drop-shadow(0 0 2px rgba(251,146,60,0.3))',
            'drop-shadow(0 0 8px rgba(251,146,60,0.5))',
            'drop-shadow(0 0 2px rgba(251,146,60,0.3))'
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-white/5 p-2 rounded-full border border-white/5"
      >
        <Flame size={20} className={getColor()} fill={streak > 0 ? "currentColor" : "none"} />
      </motion.div>
      <div className="flex flex-col items-center mt-2">
        <span className={`text-lg font-bold leading-none font-sans ${streak > 0 ? 'text-white' : 'text-gray-500'}`}>
          {streak}
        </span>
        <span className="text-[10px] font-medium tracking-wide text-gray-500 mt-0.5">
          STREAK
        </span>
      </div>
    </div>
  );
};
