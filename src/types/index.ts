export enum WebsiteCategory {
  Work = 'Work',
  Social = 'Social',
  Entertainment = 'Entertainment',
  Learning = 'Learning',
  Productivity = 'Productivity',
  Other = 'Other',
}

export interface TimeEntry {
  domain: string;
  category: WebsiteCategory;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface DailyStats {
  date: string;
  totalTime: number;
  byCategory: Record<WebsiteCategory, number>;
  byDomain: Record<string, number>;
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface UserSettings {
  excludedDomains: string[];
  categoryMappings: Record<string, WebsiteCategory>;
  theme: 'light' | 'dark';
  pomodoro: PomodoroSettings;
}

export interface PomodoroSession {
  startTime: number;
  endTime: number;
  type: 'work' | 'break';
  completed: boolean;
} 