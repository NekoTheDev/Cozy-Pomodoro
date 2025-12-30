import { Task, User, DailyStat, AuthResponse } from '../types';

/**
 * FAKE BACKEND / MOCK SERVICE
 * Simulating MSW behavior for a standalone environment.
 * Includes latency simulation and random failures.
 */

const LATENCY_MIN = 300;
const LATENCY_MAX = 800;
const FAILURE_RATE = 0; // Disabled random failures for stability

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const randomFail = () => {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("Simulated Network Error (500)");
  }
};

const simulateNetwork = async () => {
  const ms = Math.floor(Math.random() * (LATENCY_MAX - LATENCY_MIN + 1) + LATENCY_MIN);
  await delay(ms);
  randomFail();
};

// Helper for safe JSON parsing
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    // If item is null, undefined, or empty string, return fallback
    if (!item || item === "undefined") return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Data corruption detected for key "${key}". Resetting to fallback.`);
    localStorage.removeItem(key);
    return fallback;
  }
};

// --- AUTH MOCKS ---

const MOCK_USER: User = {
  id: 'NekoloveTmc',
  name: 'NekoTD',
  email: 'nekothedev@nekoterminal.com',
  avatar: 'https://i.pinimg.com/736x/dd/4d/95/dd4d951917907f731a2b3c7a56e736a8.jpg',
  streak: 0,
  lastActiveDate: new Date().toISOString()
};

export const apiLogin = async (email: string, password: string): Promise<AuthResponse> => {
  await simulateNetwork();
  if (password === 'error') throw new Error("Invalid Credentials"); // Test case
  
  const token = `ey_fake_jwt_token_${Date.now()}`;
  localStorage.setItem('auth_token', token);
  
  // Return stored user if exists, else mock
  const user = safeParse<User>('user', MOCK_USER);
  
  localStorage.setItem('user', JSON.stringify(user));
  return { user, token };
};

export const apiRegister = async (email: string, name: string): Promise<AuthResponse> => {
  await simulateNetwork();
  const newUser = { ...MOCK_USER, email, name, id: `user_${Date.now()}` };
  const token = `ey_fake_jwt_token_${Date.now()}`;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(newUser));
  return { user: newUser, token };
};

export const apiLogout = async (): Promise<void> => {
  await simulateNetwork();
  localStorage.removeItem('auth_token');
};

export const apiMe = async (): Promise<User> => {
  await simulateNetwork();
  const stored = localStorage.getItem('user');
  if (!stored) throw new Error("Unauthorized");
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    localStorage.removeItem('user');
    throw new Error("Unauthorized - Session Invalid");
  }
};

export const apiUpdateUser = async (updates: Partial<User>): Promise<User> => {
  await simulateNetwork();
  const stored = localStorage.getItem('user');
  if (!stored) throw new Error("Unauthorized");
  
  try {
    const currentUser = JSON.parse(stored);
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch {
    throw new Error("Failed to update user");
  }
};

// --- TASK MOCKS ---

const getStoredTasks = (): Task[] => {
  return safeParse<Task[]>('tasks', []);
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const apiGetTasks = async (): Promise<Task[]> => {
  await simulateNetwork();
  // Seed initial data if empty
  let tasks = getStoredTasks();
  
  // We check for length <= 0 (or some small number) to re-seed if empty
  if (tasks.length === 0) {
    tasks = [
      { id: '1', title: 'Hack the Gibson', status: 'IN_PROGRESS', priority: 'HIGH', estimatedPomodoros: 4, completedPomodoros: 2, createdAt: new Date().toISOString() },
      { id: '2', title: 'Update ICE countermeasures', status: 'TODO', priority: 'MEDIUM', estimatedPomodoros: 2, completedPomodoros: 0, createdAt: new Date().toISOString() },
      { id: '3', title: 'Debug neural link interface', status: 'DONE', priority: 'LOW', estimatedPomodoros: 1, completedPomodoros: 1, createdAt: new Date().toISOString() },
      { id: '4', title: 'Review system architecture', status: 'TODO', priority: 'HIGH', estimatedPomodoros: 3, completedPomodoros: 0, createdAt: new Date(Date.now() - 100000).toISOString() },
      { id: '5', title: 'Optimize database queries', status: 'TODO', priority: 'MEDIUM', estimatedPomodoros: 2, completedPomodoros: 0, createdAt: new Date(Date.now() - 200000).toISOString() },
      { id: '6', title: 'Backup encrypted drives', status: 'TODO', priority: 'LOW', estimatedPomodoros: 1, completedPomodoros: 0, createdAt: new Date(Date.now() - 300000).toISOString() },
    ];
    saveTasks(tasks);
  }
  return tasks;
};

export const apiCreateTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  await simulateNetwork();
  const tasks = getStoredTasks();
  const newTask: Task = {
    ...task,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const apiUpdateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  await simulateNetwork();
  const tasks = getStoredTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Task not found");
  
  const updatedTask = { ...tasks[index], ...updates };
  tasks[index] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
};

export const apiDeleteTask = async (id: string): Promise<void> => {
  await simulateNetwork();
  const tasks = getStoredTasks();
  const filtered = tasks.filter(t => t.id !== id);
  saveTasks(filtered);
};

// --- STATS MOCKS ---

export const apiGetStats = async (daysArg: number = 7): Promise<DailyStat[]> => {
  await simulateNetwork();
  const today = new Date();
  const stats: DailyStat[] = [];
  
  for (let i = daysArg - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    stats.push({
      date: d.toISOString().split('T')[0],
      focusMinutes: Math.floor(Math.random() * 200) + 20,
      tasksCompleted: Math.floor(Math.random() * 8)
    });
  }
  return stats;
};
