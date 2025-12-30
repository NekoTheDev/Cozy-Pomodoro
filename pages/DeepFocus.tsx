import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer } from '../features/Timer';
import { Maximize2, Minimize2, ArrowLeft, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const DeepFocusPage: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();
  const { setZenMode } = useStore();

  useEffect(() => {
    setZenMode(true);
    return () => setZenMode(false);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-cozy-dark flex flex-col items-center justify-center overflow-hidden"
    >
        {/* --- ZEN BACKGROUND --- */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Soft Grain Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1c1917_90%)]" />
            
            {/* Breathing Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cozy-amber/5 rounded-full blur-[150px] animate-breathe" />
        </div>

        {/* --- MINIMAL CONTROLS --- */}
        <div className="absolute top-0 left-0 w-full p-8 pt-[max(2rem,env(safe-area-inset-top))] flex justify-between items-start z-50 pointer-events-none">
            <div className="pointer-events-auto">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="flex items-center gap-3 text-stone-500 hover:text-stone-200 transition-all group px-4 py-2 rounded-full hover:bg-white/5"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-sans tracking-wide">Return</span>
                </button>
            </div>
            
            <div className="pointer-events-auto">
                 <button 
                   onClick={toggleFullScreen}
                   className="text-stone-500 hover:text-stone-200 transition-colors p-3 hover:bg-white/5 rounded-full"
                   title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                 >
                   {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                 </button>
            </div>
        </div>

        {/* --- TIMER --- */}
        <div className="relative z-10 w-full flex items-center justify-center p-8">
             <div className="transform scale-90 md:scale-110 transition-transform duration-1000">
                 <Timer />
             </div>
        </div>

        {/* --- QUOTE / TEXT --- */}
        <div className="absolute bottom-16 left-0 w-full flex justify-center z-50 pointer-events-none">
           <div className="flex items-center gap-2 text-stone-500 opacity-60">
              <Wind size={14} />
              <span className="text-xs font-serif italic tracking-wider">Breathe in. Focus. Breathe out.</span>
           </div>
        </div>
    </motion.div>
  );
};

export default DeepFocusPage;