import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { useStore, PRESET_BACKGROUNDS } from '../store/useStore';
import { CyberButton } from '../components/ui/CyberComponents';

interface ThemePickerProps {
  onClose: () => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ onClose }) => {
  const { backgroundImage, setBackgroundImage, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast('File too large. System limit: 2MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundImage(event.target.result as string);
          showToast('Custom visual environment loaded.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-panel w-full max-w-3xl rounded-xl border border-neon-cyan/30 overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
             <ImageIcon className="text-neon-cyan" size={24} />
             <h2 className="text-2xl font-display font-bold text-white tracking-widest">VISUAL ENVIRONMENT</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Custom Upload Section */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Local Device Source</h3>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan hover:bg-neon-cyan/5 transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
              />
              <Upload className="text-gray-500 group-hover:text-neon-cyan mb-3 transition-colors" size={32} />
              <span className="text-gray-400 group-hover:text-white font-display text-sm">CLICK TO UPLOAD IMAGE</span>
              <span className="text-xs text-gray-600 mt-1 font-mono">MAX SIZE: 2MB // FORMAT: JPG, PNG</span>
            </button>
          </div>

          {/* Presets Grid */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">System Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PRESET_BACKGROUNDS.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setBackgroundImage(bg)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                    backgroundImage === bg 
                    ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.5)]' 
                    : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <img src={bg} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Active Indicator */}
                  {backgroundImage === bg && (
                    <div className="absolute inset-0 bg-neon-cyan/20 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-black/60 p-2 rounded-full border border-neon-cyan text-neon-cyan">
                        <Check size={20} strokeWidth={3} />
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity ${backgroundImage === bg ? 'hidden' : 'block'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
          <CyberButton onClick={onClose} variant="primary" size="sm">
            CONFIRM SELECTION
          </CyberButton>
        </div>
      </motion.div>
    </motion.div>
  );
};