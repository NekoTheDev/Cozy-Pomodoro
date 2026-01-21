import React from 'react';
import { StatsBoard } from '../features/StatsBoard';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { translations } from '../utils/i18n';

const Stats: React.FC = () => {
  const { language } = useStore();
  const t = translations[language];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="pb-20 pt-4"
    >
      <h2 className="text-3xl font-display font-bold text-white mb-8 tracking-tighter">
        {t.stats_header_1} <span className="text-cozy-orange">{t.stats_header_2}</span>
      </h2>
      <StatsBoard />
    </motion.div>
  );
};

export default Stats;