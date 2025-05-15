import { TimeEntry, WebsiteCategory } from '../types';
import { storage } from '../utils/storage';

class TimeTracker {
  private currentEntry: TimeEntry | null = null;
  private isTracking = false;

  constructor() {
    this.initializeListeners();
  }

  private async initializeListeners() {
    // Track tab changes
    chrome.tabs.onActivated.addListener(this.handleTabChange.bind(this));
    chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
    
    // Track window focus
    chrome.windows.onFocusChanged.addListener(this.handleWindowFocus.bind(this));
    
    // Track idle state
    chrome.idle.onStateChanged.addListener(this.handleIdleState.bind(this));
  }

  private async handleTabChange(activeInfo: chrome.tabs.TabActiveInfo) {
    if (!this.isTracking) return;
    
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (!tab.url) return;

    await this.stopTracking();
    await this.startTracking(tab.url);
  }

  private async handleTabUpdate(
    _tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    _tab: chrome.tabs.Tab
  ) {
    if (!this.isTracking || !changeInfo.url) return;
    await this.stopTracking();
    await this.startTracking(changeInfo.url);
  }

  private async handleWindowFocus(windowId: number) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      await this.stopTracking();
    } else {
      const tabs = await chrome.tabs.query({ active: true, windowId });
      if (tabs[0]?.url) {
        await this.startTracking(tabs[0].url);
      }
    }
  }

  private async handleIdleState(state: chrome.idle.IdleState) {
    if (state === 'active') {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]?.url) {
        await this.startTracking(tabs[0].url);
      }
    } else {
      await this.stopTracking();
    }
  }

  private async startTracking(url: string) {
    const settings = await storage.getUserSettings();
    const domain = new URL(url).hostname;

    if (settings.excludedDomains.includes(domain)) {
      return;
    }

    const category = settings.categoryMappings[domain] || this.getDefaultCategory(domain);
    
    this.currentEntry = {
      domain,
      category,
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
    };
    
    this.isTracking = true;
  }

  private async stopTracking() {
    if (!this.currentEntry) return;

    this.currentEntry.endTime = Date.now();
    this.currentEntry.duration = this.currentEntry.endTime - this.currentEntry.startTime;

    if (this.currentEntry.duration > 0) {
      await storage.saveTimeEntry(this.currentEntry);
      await this.updateDailyStats(this.currentEntry);
    }

    this.currentEntry = null;
    this.isTracking = false;
  }

  private getDefaultCategory(domain: string): WebsiteCategory {
    const socialDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'];
    const workDomains = ['github.com', 'gitlab.com', 'bitbucket.org', 'jira.com'];
    const learningDomains = ['udemy.com', 'coursera.org', 'edx.org', 'youtube.com'];

    if (socialDomains.some(d => domain.includes(d))) return WebsiteCategory.Social;
    if (workDomains.some(d => domain.includes(d))) return WebsiteCategory.Work;
    if (learningDomains.some(d => domain.includes(d))) return WebsiteCategory.Learning;
    
    return WebsiteCategory.Other;
  }

  private async updateDailyStats(entry: TimeEntry) {
    const date = new Date(entry.startTime).toISOString().split('T')[0];
    const stats = await storage.getDailyStats();
    
    if (!stats[date]) {
      stats[date] = {
        date,
        totalTime: 0,
        byCategory: {
          Work: 0,
          Social: 0,
          Entertainment: 0,
          Learning: 0,
          Productivity: 0,
          Other: 0,
        },
        byDomain: {},
      };
    }

    stats[date].totalTime += entry.duration;
    stats[date].byCategory[entry.category] += entry.duration;
    stats[date].byDomain[entry.domain] = (stats[date].byDomain[entry.domain] || 0) + entry.duration;

    await storage.saveDailyStats(date, stats[date]);
  }

  // Add public methods to get tracking status
  public getCurrentEntry(): TimeEntry | null {
    return this.currentEntry;
  }

  public isCurrentlyTracking(): boolean {
    return this.isTracking;
  }
}

// Initialize the time tracker
export const timeTracker = new TimeTracker(); 