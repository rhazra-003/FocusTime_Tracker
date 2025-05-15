import { TimeEntry, DailyStats, UserSettings, PomodoroSession } from '../types';

const STORAGE_KEYS = {
  TIME_ENTRIES: 'timeEntries',
  DAILY_STATS: 'dailyStats',
  USER_SETTINGS: 'userSettings',
  POMODORO_SESSIONS: 'pomodoroSessions',
} as const;

export const storage = {
  async getTimeEntries(): Promise<TimeEntry[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.TIME_ENTRIES);
    return result[STORAGE_KEYS.TIME_ENTRIES] || [];
  },

  async saveTimeEntry(entry: TimeEntry): Promise<void> {
    const entries = await this.getTimeEntries();
    entries.push(entry);
    await chrome.storage.local.set({ [STORAGE_KEYS.TIME_ENTRIES]: entries });
  },

  async getDailyStats(): Promise<Record<string, DailyStats>> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.DAILY_STATS);
    return result[STORAGE_KEYS.DAILY_STATS] || {};
  },

  async saveDailyStats(date: string, stats: DailyStats): Promise<void> {
    const allStats = await this.getDailyStats();
    allStats[date] = stats;
    await chrome.storage.local.set({ [STORAGE_KEYS.DAILY_STATS]: allStats });
  },

  async getUserSettings(): Promise<UserSettings> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.USER_SETTINGS);
    return result[STORAGE_KEYS.USER_SETTINGS] || {
      excludedDomains: [],
      categoryMappings: {},
      theme: 'light',
      pomodoro: {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
      },
    };
  },

  async saveUserSettings(settings: UserSettings): Promise<void> {
    await chrome.storage.sync.set({ [STORAGE_KEYS.USER_SETTINGS]: settings });
  },

  async getPomodoroSessions(): Promise<PomodoroSession[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.POMODORO_SESSIONS);
    return result[STORAGE_KEYS.POMODORO_SESSIONS] || [];
  },

  async savePomodoroSession(session: PomodoroSession): Promise<void> {
    const sessions = await this.getPomodoroSessions();
    sessions.push(session);
    await chrome.storage.local.set({ [STORAGE_KEYS.POMODORO_SESSIONS]: sessions });
  },

  async clearAllData(): Promise<void> {
    await chrome.storage.local.clear();
    await chrome.storage.sync.clear();
  },
}; 