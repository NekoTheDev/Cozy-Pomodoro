import { create } from 'zustand';
import { User, Task, TimerSettings, TimerMode, Note, Plan } from '../types';
import * as api from '../services/fakeBackend';
import { playSFX } from '../utils/audio';

export const PRESET_BACKGROUNDS = [
  "https://i.pinimg.com/1200x/fb/4e/b9/fb4eb9ee4ec6bb207bc2c3efcc439695.jpg", // Default Warm
  "https://i.pinimg.com/1200x/4a/02/fa/4a02faf5a646c9765182b4af6fe056c0.jpg", // Preset 2 (Cozy Window)
  "https://i.pinimg.com/736x/aa/98/4d/aa984df5a8ce94689588b835a8754fd4.jpg", // Preset 3 (Dark Rain)
  "https://i.pinimg.com/736x/b9/73/4f/b9734fc8852268ca7d21712d89e87ff6.jpg", // Preset 4 (Autumn Train)
  "https://i.pinimg.com/736x/b9/6b/67/b96b678ca060a545fe78108db68da9cf.jpg", // Preset 5 (Book Coffee)
  "https://i.pinimg.com/736x/9e/23/f0/9e23f0e8bacb5f03ad6418a3bdd1727b.jpg", // Preset 6 (Night City)
  "https://i.pinimg.com/1200x/81/59/e0/8159e00bf1b72ec93bce8e002d9edc72.jpg", // Preset 7 (Snow Cabin)
];

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;

  // Timer
  timerMode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  settings: TimerSettings;
  setTimerMode: (mode: TimerMode) => void;
  setTimeLeft: (time: number) => void;
  setIsActive: (active: boolean) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  completeSession: () => void;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;

  // Streak & Progress
  streak: number;
  sessionsToday: number;
  lastActiveDate: string | null;

  // Tasks
  tasks: Task[];
  activeTaskId: string | null; // Currently focused task
  isTaskPanelOpen: boolean;
  isLoadingTasks: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, priority: Task['priority'], est: number) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setActiveTask: (id: string | null) => void;
  toggleTaskPanel: () => void;

  // Notes
  notes: Note[];
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;

  // Plans
  plans: Plan[];
  addPlan: (date: string, title: string) => void;
  addPlanRange: (startDate: string, endDate: string, title: string) => void;
  togglePlan: (id: string) => void;
  deletePlan: (id: string) => void;

  // System & Environment
  factoryReset: () => void;
  isZenMode: boolean; // Hides sidebar/ui
  toggleZenMode: () => void;
  setZenMode: (mode: boolean) => void;
  
  backgroundImage: string;
  setBackgroundImage: (url: string) => void;
  cycleBackground: () => void;
  
  soundEnabled: boolean;
  toggleSound: () => void;

  // UI
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  dailyGoal: 4,
};

// Helpers
const getStoredNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem('notes');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

const getStoredPlans = (): Plan[] => {
  try {
    const stored = localStorage.getItem('plans');
    if (stored) return JSON.parse(stored);
    
    // Seed default plans if empty
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 'p1', date: today, title: 'Review system diagnostics', isCompleted: false },
      { id: 'p2', date: today, title: 'Deep focus session (2h)', isCompleted: true }
    ];
  } catch { return []; }
};

const getStoredSettings = (): TimerSettings => {
  try {
    const stored = localStorage.getItem('timer_settings');
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
};

const getStoredBackground = (): string => {
  try {
    const stored = localStorage.getItem('bg_image');
    return stored || PRESET_BACKGROUNDS[0];
  } catch { return PRESET_BACKGROUNDS[0]; }
};

const getStoredStreak = () => {
  try {
    const streak = parseInt(localStorage.getItem('streak_count') || '0');
    const lastDate = localStorage.getItem('streak_last_date');
    const sessions = parseInt(localStorage.getItem('sessions_today') || '0');
    
    // Check if sessionsToday needs reset (if it's a new day)
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('today_date');
    
    let currentSessions = sessions;
    if (storedDate !== today) {
      currentSessions = 0;
      localStorage.setItem('sessions_today', '0');
      localStorage.setItem('today_date', today);
    }

    return { streak, lastDate, sessions: currentSessions };
  } catch {
    return { streak: 0, lastDate: null, sessions: 0 };
  }
};

const streakData = getStoredStreak();

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  isLoadingAuth: true,
  login: async (email, pass) => {
    try {
      const { user } = await api.apiLogin(email, pass);
      set({ user, isAuthenticated: true });
      get().showToast('Welcome back.', 'success');
    } catch (e) {
      get().showToast('Could not sign in.', 'error');
      throw e;
    }
  },
  register: async (email, name) => {
    try {
      const { user } = await api.apiRegister(email, name);
      set({ user, isAuthenticated: true });
      get().showToast('Account created.', 'success');
    } catch (e) {
      get().showToast('Registration failed.', 'error');
      throw e;
    }
  },
  logout: async () => {
    await api.apiLogout();
    set({ user: null, isAuthenticated: false });
    get().showToast('Signed out.', 'info');
  },
  checkAuth: async () => {
    set({ isLoadingAuth: true });
    try {
      const user = await api.apiMe();
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoadingAuth: false });
    }
  },
  updateUserProfile: async (updates) => {
    try {
      const updatedUser = await api.apiUpdateUser(updates);
      set({ user: updatedUser });
      get().showToast('Profile updated.', 'success');
    } catch {
      get().showToast('Update failed.', 'error');
    }
  },

  // Timer
  timerMode: 'FOCUS',
  settings: getStoredSettings(),
  timeLeft: getStoredSettings().focusDuration * 60,
  isActive: false,
  
  // Streak Initial State
  streak: streakData.streak,
  lastActiveDate: streakData.lastDate,
  sessionsToday: streakData.sessions,

  setTimerMode: (mode) => {
    const { settings, soundEnabled } = get();
    playSFX('click', soundEnabled);
    let duration = settings.focusDuration;
    if (mode === 'SHORT_BREAK') duration = settings.shortBreakDuration;
    if (mode === 'LONG_BREAK') duration = settings.longBreakDuration;
    set({ timerMode: mode, timeLeft: duration * 60, isActive: false });
  },
  setTimeLeft: (time) => set({ timeLeft: time }),
  setIsActive: (active) => set({ isActive: active }),
  toggleTimer: () => {
    const { isActive, soundEnabled } = get();
    playSFX('click', soundEnabled);
    set({ isActive: !isActive });
  },
  resetTimer: () => {
    const { timerMode, settings, soundEnabled } = get();
    playSFX('click', soundEnabled);
    let duration = settings.focusDuration;
    if (timerMode === 'SHORT_BREAK') duration = settings.shortBreakDuration;
    if (timerMode === 'LONG_BREAK') duration = settings.longBreakDuration;
    set({ timeLeft: duration * 60, isActive: false });
  },
  tickTimer: () => {
    const { timeLeft, isActive, completeSession } = get();
    if (!isActive) return;
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      completeSession();
    }
  },
  completeSession: () => {
    const { timerMode, settings, setTimerMode, showToast, streak, lastActiveDate, tasks, activeTaskId, updateTask, soundEnabled } = get();
    
    // Logic when a session finishes
    if (timerMode === 'FOCUS') {
      playSFX('alarm', soundEnabled);
      showToast('Session complete. Time for a break.', 'success');
      
      // 1. Update Active Task Pomodoro Count
      if (activeTaskId) {
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) {
           updateTask(activeTaskId, { completedPomodoros: task.completedPomodoros + 1 });
        }
      }

      // 2. Update Daily Sessions
      const newSessionsToday = get().sessionsToday + 1;
      set({ sessionsToday: newSessionsToday });
      localStorage.setItem('sessions_today', newSessionsToday.toString());
      localStorage.setItem('today_date', new Date().toDateString()); // Ensure date is synced

      // 3. Update Streak Logic
      const today = new Date();
      const todayStr = today.toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      let newStreak = streak;

      if (lastActiveDate === todayStr) {
        // Already active today, streak keeps same
      } else if (lastActiveDate === yesterdayStr) {
        // Consecutive day
        newStreak = streak + 1;
      } else {
        // Missed a day (or first day)
        newStreak = 1;
      }

      set({ streak: newStreak, lastActiveDate: todayStr });
      localStorage.setItem('streak_count', newStreak.toString());
      localStorage.setItem('streak_last_date', todayStr);

      // Auto Switch
      setTimerMode('SHORT_BREAK');
      if (settings.autoStartBreaks) set({ isActive: true });

    } else {
      // Break Finished
      playSFX('break', soundEnabled);
      showToast('Break finished. Ready to focus?', 'info');
      setTimerMode('FOCUS');
      if (settings.autoStartPomodoros) set({ isActive: true });
    }
  },
  updateSettings: (newSettings) => {
    set((state) => {
        const updated = { ...state.settings, ...newSettings };
        localStorage.setItem('timer_settings', JSON.stringify(updated));
        return { settings: updated };
    });
    get().showToast('Settings saved.', 'success');
  },

  // Tasks
  tasks: [],
  activeTaskId: null,
  isTaskPanelOpen: true,
  isLoadingTasks: false,
  fetchTasks: async () => {
    set({ isLoadingTasks: true });
    try {
      const tasks = await api.apiGetTasks();
      set({ tasks });
      // Set first task as active if none selected
      if (!get().activeTaskId && tasks.length > 0) {
        set({ activeTaskId: tasks[0].id });
      }
    } catch {
      get().showToast('Could not load tasks.', 'error');
    } finally {
      set({ isLoadingTasks: false });
    }
  },
  addTask: async (title, priority, est) => {
    try {
      const newTask = await api.apiCreateTask({ 
        title, 
        priority, 
        estimatedPomodoros: est, 
        completedPomodoros: 0, 
        status: 'TODO' 
      });
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      if (!get().activeTaskId) set({ activeTaskId: newTask.id });
      get().showToast('Task added.', 'success');
    } catch {
      get().showToast('Error adding task.', 'error');
    }
  },
  updateTask: async (id, updates) => {
    try {
      const updated = await api.apiUpdateTask(id, updates);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      get().showToast('Update failed.', 'error');
    }
  },
  deleteTask: async (id) => {
    try {
      await api.apiDeleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        activeTaskId: state.activeTaskId === id ? null : state.activeTaskId
      }));
      get().showToast('Task removed.', 'info');
    } catch {
      get().showToast('Remove failed.', 'error');
    }
  },
  setActiveTask: (id) => set({ activeTaskId: id }),
  toggleTaskPanel: () => set((state) => ({ isTaskPanelOpen: !state.isTaskPanelOpen })),

  // Notes
  notes: getStoredNotes(),
  addNote: (content) => {
    const colors: Note['color'][] = ['cyan', 'magenta', 'yellow'];
    const newNote: Note = {
      id: Math.random().toString(36).substring(2),
      content,
      createdAt: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    set((state) => {
      const updated = [newNote, ...state.notes];
      localStorage.setItem('notes', JSON.stringify(updated));
      return { notes: updated };
    });
    get().showToast('Note saved.', 'success');
  },
  deleteNote: (id) => {
    set((state) => {
      const updated = state.notes.filter(n => n.id !== id);
      localStorage.setItem('notes', JSON.stringify(updated));
      return { notes: updated };
    });
    get().showToast('Note deleted.', 'info');
  },

  // Plans
  plans: getStoredPlans(),
  addPlan: (date, title) => {
    const newPlan: Plan = {
      id: Math.random().toString(36).substring(2),
      date,
      title,
      isCompleted: false
    };
    set((state) => {
      const updated = [...state.plans, newPlan];
      localStorage.setItem('plans', JSON.stringify(updated));
      return { plans: updated };
    });
    get().showToast('Objective set.', 'success');
  },
  addPlanRange: (startDate, endDate, title) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const newPlans: Plan[] = [];
    
    // Loop through dates
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        newPlans.push({
            id: Math.random().toString(36).substring(2),
            date: dt.toISOString().split('T')[0],
            title: title,
            isCompleted: false
        });
    }

    set((state) => {
      const updated = [...state.plans, ...newPlans];
      localStorage.setItem('plans', JSON.stringify(updated));
      return { plans: updated };
    });
    get().showToast(`Objective set for ${newPlans.length} days.`, 'success');
  },
  togglePlan: (id) => {
    set((state) => {
      const updated = state.plans.map(p => p.id === id ? { ...p, isCompleted: !p.isCompleted } : p);
      localStorage.setItem('plans', JSON.stringify(updated));
      return { plans: updated };
    });
  },
  deletePlan: (id) => {
    set((state) => {
      const updated = state.plans.filter(p => p.id !== id);
      localStorage.setItem('plans', JSON.stringify(updated));
      return { plans: updated };
    });
    get().showToast('Objective removed.', 'info');
  },


  // System & Environment
  factoryReset: () => {
    localStorage.clear();
    set({
      user: null,
      isAuthenticated: false,
      tasks: [],
      notes: [],
      plans: [],
      settings: DEFAULT_SETTINGS,
      timerMode: 'FOCUS',
      timeLeft: DEFAULT_SETTINGS.focusDuration * 60,
      isActive: false,
      streak: 0,
      sessionsToday: 0
    });
    window.location.reload();
  },

  isZenMode: false,
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  setZenMode: (mode) => set({ isZenMode: mode }),

  backgroundImage: getStoredBackground(),
  setBackgroundImage: (url) => {
    localStorage.setItem('bg_image', url);
    set({ backgroundImage: url });
  },
  cycleBackground: () => {
    const current = get().backgroundImage;
    const currentIndex = PRESET_BACKGROUNDS.indexOf(current);
    const nextIndex = (currentIndex + 1) % PRESET_BACKGROUNDS.length;
    const nextBg = PRESET_BACKGROUNDS[nextIndex];
    
    if (currentIndex === -1) {
       get().setBackgroundImage(PRESET_BACKGROUNDS[0]);
    } else {
       get().setBackgroundImage(nextBg);
    }
  },

  soundEnabled: false,
  toggleSound: () => set((state) => {
    const newState = !state.soundEnabled;
    playSFX('click', newState); // Play sound immediately when enabling
    get().showToast(newState ? 'Ambience On' : 'Ambience Off', 'info');
    return { soundEnabled: newState };
  }),

  // UI
  toast: null,
  showToast: (message, type) => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 4000);
  },
}));