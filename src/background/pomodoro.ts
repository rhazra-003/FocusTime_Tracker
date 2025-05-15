import { PomodoroSettings, PomodoroSession } from '../types';
import { storage } from '../utils/storage';

class PomodoroTimer {
  public currentSession: PomodoroSession | null = null;
  private sessionCount = 0;
  private settings: PomodoroSettings | null = null;
  private alarmName = 'pomodoroTimer';

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const userSettings = await storage.getUserSettings();
    this.settings = userSettings.pomodoro;
    
    chrome.alarms.onAlarm.addListener(this.handleAlarm.bind(this));
    
    // Set up message listener
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  private async handleMessage(message: any, _sender: any, sendResponse: (response?: any) => void) {
    switch (message.type) {
      case 'GET_CURRENT_SESSION':
        sendResponse({ session: this.currentSession });
        break;
      case 'START_WORK_SESSION':
        await this.startWorkSession();
        break;
      case 'START_BREAK_SESSION':
        await this.startBreakSession();
        break;
      case 'RESET_POMODORO':
        await this.resetTimer();
        break;
    }
  }

  private async handleAlarm(alarm: chrome.alarms.Alarm) {
    if (alarm.name === this.alarmName && this.currentSession) {
      this.currentSession.completed = true;
      
      if (this.currentSession.type === 'work') {
        this.sessionCount++;
        await this.showNotification(
          'Work Session Complete',
          'Time for a break!'
        );
        
        if (this.settings?.autoStartBreaks) {
          await this.startBreakSession();
        }
      } else {
        await this.showNotification(
          'Break Complete',
          'Ready to start a new work session?'
        );
        
        if (this.settings?.autoStartPomodoros) {
          await this.startWorkSession();
        }
      }
    }
  }

  async startWorkSession() {
    if (!this.settings) return;

    this.currentSession = {
      startTime: Date.now(),
      endTime: Date.now() + this.settings.workDuration * 60 * 1000,
      type: 'work',
      completed: false,
    };

    await chrome.alarms.create(this.alarmName, {
      delayInMinutes: this.settings.workDuration,
    });

    await this.showNotification(
      'Work Session Started',
      'Focus time begins now! Stay productive!'
    );
  }

  async startBreakSession() {
    if (!this.settings) return;

    const isLongBreak = this.sessionCount >= this.settings.sessionsUntilLongBreak;
    const breakDuration = isLongBreak ? this.settings.longBreakDuration : this.settings.shortBreakDuration;

    this.currentSession = {
      startTime: Date.now(),
      endTime: Date.now() + breakDuration * 60 * 1000,
      type: 'break',
      completed: false,
    };

    await chrome.alarms.create(this.alarmName, {
      delayInMinutes: breakDuration,
    });

    if (isLongBreak) {
      this.sessionCount = 0;
    }

    await this.showNotification(
      'Break Started',
      `Time for a ${isLongBreak ? 'long' : 'short'} break!`
    );
  }

  async resetTimer() {
    this.currentSession = null;
    this.sessionCount = 0;
    await chrome.alarms.clear(this.alarmName);
  }

  private async showNotification(title: string, message: string) {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icons/icon128.png',
      title,
      message,
    });
  }
}

export const pomodoroTimer = new PomodoroTimer(); 