import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { UserSettings, WebsiteCategory } from '../types';

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [newCategory, setNewCategory] = useState<WebsiteCategory>(WebsiteCategory.Other);
  const [newExcludedDomain, setNewExcludedDomain] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const userSettings = await storage.getUserSettings();
    setSettings(userSettings);
  };

  const updatePomodoroSettings = async (updates: Partial<UserSettings['pomodoro']>) => {
    if (!settings) return;
    
    const updatedSettings = {
      ...settings,
      pomodoro: {
        ...settings.pomodoro,
        ...updates,
      },
    };
    
    await storage.saveUserSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const addCategoryMapping = async () => {
    if (!settings || !newDomain) return;
    
    const updatedSettings = {
      ...settings,
      categoryMappings: {
        ...settings.categoryMappings,
        [newDomain]: newCategory,
      },
    };
    
    await storage.saveUserSettings(updatedSettings);
    setSettings(updatedSettings);
    setNewDomain('');
  };

  const removeCategoryMapping = async (domain: string) => {
    if (!settings) return;
    
    const { [domain]: removed, ...remainingMappings } = settings.categoryMappings;
    const updatedSettings = {
      ...settings,
      categoryMappings: remainingMappings,
    };
    
    await storage.saveUserSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const addExcludedDomain = async () => {
    if (!settings || !newExcludedDomain) return;
    
    const updatedSettings = {
      ...settings,
      excludedDomains: [...settings.excludedDomains, newExcludedDomain],
    };
    
    await storage.saveUserSettings(updatedSettings);
    setSettings(updatedSettings);
    setNewExcludedDomain('');
  };

  const removeExcludedDomain = async (domain: string) => {
    if (!settings) return;
    
    const updatedSettings = {
      ...settings,
      excludedDomains: settings.excludedDomains.filter(d => d !== domain),
    };
    
    await storage.saveUserSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pomodoro Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Work Duration (minutes)</label>
            <input
              type="number"
              value={settings.pomodoro.workDuration}
              onChange={(e) => updatePomodoroSettings({ workDuration: parseInt(e.target.value) })}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              min="1"
              max="60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Break Duration (minutes)</label>
            <input
              type="number"
              value={settings.pomodoro.shortBreakDuration}
              onChange={(e) => updatePomodoroSettings({ shortBreakDuration: parseInt(e.target.value) })}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              min="1"
              max="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Long Break Duration (minutes)</label>
            <input
              type="number"
              value={settings.pomodoro.longBreakDuration}
              onChange={(e) => updatePomodoroSettings({ longBreakDuration: parseInt(e.target.value) })}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              min="1"
              max="60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sessions until Long Break</label>
            <input
              type="number"
              value={settings.pomodoro.sessionsUntilLongBreak}
              onChange={(e) => updatePomodoroSettings({ sessionsUntilLongBreak: parseInt(e.target.value) })}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              min="1"
              max="10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoStartBreaks"
              checked={settings.pomodoro.autoStartBreaks}
              onChange={(e) => updatePomodoroSettings({ autoStartBreaks: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="autoStartBreaks">Auto-start breaks</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoStartPomodoros"
              checked={settings.pomodoro.autoStartPomodoros}
              onChange={(e) => updatePomodoroSettings({ autoStartPomodoros: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="autoStartPomodoros">Auto-start work sessions</label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Category Mappings</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter domain (e.g., youtube.com)"
              className="flex-1 min-w-[200px] p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as WebsiteCategory)}
              className="p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              {Object.values(WebsiteCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              onClick={addCategoryMapping}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(settings.categoryMappings).map(([domain, category]) => (
              <div key={domain} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span>{domain} → {category}</span>
                <button
                  onClick={() => removeCategoryMapping(domain)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Excluded Domains</h2>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newExcludedDomain}
              onChange={(e) => setNewExcludedDomain(e.target.value)}
              placeholder="Enter domain to exclude"
              className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <button
              onClick={addExcludedDomain}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {settings.excludedDomains.map((domain) => (
              <div key={domain} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span>{domain}</span>
                <button
                  onClick={() => removeExcludedDomain(domain)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 