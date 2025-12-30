// Simple audio manager with pre-defined sounds

const SOUNDS = {
  // Soft zen gong for session completion
  alarm: new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'),
  
  // Subtle digital tick for UI interactions
  click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
  
  // Soft chime for break completion
  break: new Audio('https://assets.mixkit.co/active_storage/sfx/221/221-preview.mp3')
};

// Preload sounds
Object.values(SOUNDS).forEach(audio => {
  audio.volume = 0.5; // Set reasonable default volume
  audio.load();
});

export type SoundType = 'alarm' | 'click' | 'break';

export const playSFX = (type: SoundType, enabled: boolean) => {
  if (!enabled) return;

  const audio = SOUNDS[type];
  if (audio) {
    audio.currentTime = 0; // Reset to start if already playing
    audio.play().catch(err => console.warn('Audio play blocked:', err));
  }
};