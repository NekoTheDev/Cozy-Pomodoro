
export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  lastActiveDate: string; // ISO Date string
}

export interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  color: 'cyan' | 'magenta' | 'yellow';
}

export interface Plan {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  isCompleted: boolean;
}

export interface TimerSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  dailyGoal: number; // Target number of pomodoros per day
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  tasksCompleted: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Stats interface for the chart
export interface ChartDataPoint {
  name: string;
  value: number;
}