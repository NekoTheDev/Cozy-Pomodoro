import React from 'react';
import { StatsBoard } from '../features/StatsBoard';
import { motion } from 'framer-motion';

const Stats: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="pb-20 pt-4"
    >
      <h2 className="text-3xl font-display font-bold text-white mb-8 tracking-tighter">
        PRODUCTIVITY <span className="text-cozy-orange">INSIGHTS</span>
      </h2>
      <StatsBoard />
    </motion.div>
  );
};

export default Stats;