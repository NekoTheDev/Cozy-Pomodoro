import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { CyberCard, CyberButton, CyberInput } from '../components/ui/CyberComponents';
import { motion } from 'framer-motion';
import { Save, RefreshCw, AlertTriangle, User, Upload, Camera } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, user, updateSettings, updateUserProfile, factoryReset, resetTimer, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for forms
  const [config, setConfig] = useState(settings);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  // Sync local state if store changes (e.g. initial load)
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSaveConfig = () => {
    updateSettings(config);
    // Optional: Reset timer to apply changes immediately if needed
    resetTimer(); 
  };

  const handleSaveProfile = () => {
    updateUserProfile(profile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to roughly 2MB for base64 performance in localstorage)
      if (file.size > 2 * 1024 * 1024) {
        showToast('File too large. Max 2MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile({ ...profile, avatar: event.target.result as string });
          showToast('Image uploaded. Click Update Identity to save.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-4xl mx-auto pt-4 md:pt-8 pb-24 md:pb-20 px-0 md:px-0"
    >
      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 md:mb-8">SYSTEM CONFIG</h2>
      
      <div className="space-y-6 md:space-y-8">
        
        {/* PROFILE SETTINGS */}
        <CyberCard className="border-l-neon-magenta/50">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-neon-magenta" />
            <h3 className="text-lg md:text-xl font-display text-white">PROFILE IDENTITY</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                type="button"
                onClick={triggerFileUpload}
                className="relative group w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-neon-magenta shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:scale-105 transition-transform cursor-pointer bg-black"
                title="Click to upload image"
              >
                <img 
                  src={profile.avatar || "https://picsum.photos/200"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity flex-col gap-1">
                   <Upload className="text-neon-cyan animate-bounce" size={24} />
                   <span className="text-[10px] text-neon-cyan font-bold uppercase tracking-widest">UPLOAD</span>
                </div>
              </button>
              <span className="text-xs text-neon-magenta font-mono">OP_ID: {user?.id?.slice(0,8)}</span>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Codename</label>
                <CyberInput 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Neural ID (Email)</label>
                <CyberInput 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Avatar URL (Optional)</label>
                <CyberInput 
                  value={profile.avatar.startsWith('data:') ? '(Local Image Uploaded)' : profile.avatar}
                  onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                  placeholder="https:// or upload via image click"
                  disabled={profile.avatar.startsWith('data:')}
                />
                {profile.avatar.startsWith('data:') && (
                  <button 
                    onClick={() => setProfile({...profile, avatar: ''})}
                    className="text-xs text-red-500 hover:text-red-400 mt-1 uppercase tracking-wider"
                  >
                    Clear Upload
                  </button>
                )}
              </div>
              <div className="pt-2 flex justify-end">
                <CyberButton variant="secondary" onClick={handleSaveProfile} className="flex items-center gap-2 w-full md:w-auto justify-center">
                  <Save size={16} />
                  UPDATE IDENTITY
                </CyberButton>
              </div>
            </div>
          </div>
        </CyberCard>

        {/* TIMER SETTINGS */}
        <CyberCard>
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="text-neon-cyan" />
            <h3 className="text-lg md:text-xl font-display text-white">TIMER CALIBRATION</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Focus (min)</label>
              <CyberInput 
                type="number" 
                value={config.focusDuration}
                onChange={(e) => setConfig({ ...config, focusDuration: parseInt(e.target.value) || 25 })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Short Break (min)</label>
              <CyberInput 
                type="number" 
                value={config.shortBreakDuration}
                onChange={(e) => setConfig({ ...config, shortBreakDuration: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Long Break (min)</label>
              <CyberInput 
                type="number" 
                value={config.longBreakDuration}
                onChange={(e) => setConfig({ ...config, longBreakDuration: parseInt(e.target.value) || 15 })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6">
             <label className="flex items-center gap-3 p-3 rounded border border-white/10 hover:border-neon-cyan/50 cursor-pointer bg-black/20 transition-colors">
               <input 
                 type="checkbox" 
                 checked={config.autoStartBreaks}
                 onChange={(e) => setConfig({...config, autoStartBreaks: e.target.checked})}
                 className="w-4 h-4 accent-neon-cyan"
               />
               <span className="text-sm font-bold text-gray-300">Auto-start Breaks</span>
             </label>
             <label className="flex items-center gap-3 p-3 rounded border border-white/10 hover:border-neon-cyan/50 cursor-pointer bg-black/20 transition-colors">
               <input 
                 type="checkbox" 
                 checked={config.autoStartPomodoros}
                 onChange={(e) => setConfig({...config, autoStartPomodoros: e.target.checked})}
                 className="w-4 h-4 accent-neon-cyan"
               />
               <span className="text-sm font-bold text-gray-300">Auto-start Pomodoros</span>
             </label>
          </div>

          <div className="mt-8 flex justify-end">
            <CyberButton variant="primary" onClick={handleSaveConfig} className="flex items-center gap-2 w-full md:w-auto justify-center">
              <Save size={16} />
              SAVE CONFIG
            </CyberButton>
          </div>
        </CyberCard>

        {/* DANGER ZONE */}
        <CyberCard className="border-red-900/50 bg-red-950/5">
          <div className="flex items-center gap-3 mb-6">
             <AlertTriangle className="text-red-500" />
             <h3 className="text-lg md:text-xl font-display text-red-500">DANGER ZONE</h3>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-gray-400 text-sm max-w-md">
              Irreversible action. This will wipe all local data, clear your settings, and reset statistics.
            </p>
            <CyberButton variant="danger" onClick={() => {
              if(window.confirm('WARNING: Confirm system wipe? This cannot be undone.')) {
                factoryReset();
              }
            }} className="w-full md:w-auto justify-center">
              FACTORY RESET
            </CyberButton>
          </div>
        </CyberCard>
      </div>
    </motion.div>
  );
};

export default Settings;