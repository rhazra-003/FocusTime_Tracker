// src/pages/Pomodoro.tsx
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { PomodoroSettings } from '../types';

export default function Pomodoro() {
  const [settings, setSettings] = useState<PomodoroSettings | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');

  useEffect(() => {
    loadSettings();
    checkCurrentSession();
    
    // Set up message listener
    chrome.runtime.onMessage.addListener(handleMessage);
    
    // Set up timer for countdown
    const timer = setInterval(() => {
      if (isRunning && timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      clearInterval(timer);
    };
  }, [isRunning]);

  const loadSettings = async () => {
    const userSettings = await storage.getUserSettings();
    setSettings(userSettings.pomodoro);
  };

  const checkCurrentSession = async () => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_SESSION' });
    if (response?.session) {
      const { type, endTime } = response.session;
      setSessionType(type);
      setTimeLeft(Math.ceil((endTime - Date.now()) / 1000));
      setIsRunning(true);
    }
  };

  const handleMessage = (message: { type: string; session?: any }) => {
    if (message.type === 'GET_CURRENT_SESSION') {
      const response = message.session;
      if (response) {
        setSessionType(response.type);
        setTimeLeft(Math.ceil((response.endTime - Date.now()) / 1000));
        setIsRunning(true);
      }
    }
  };

  const startWorkSession = async () => {
    chrome.runtime.sendMessage({ type: 'START_WORK_SESSION' });
    setSessionType('work');
    setIsRunning(true);
    setTimeLeft(settings?.workDuration ? settings.workDuration * 60 : 0);
  };

  const startBreakSession = async () => {
    chrome.runtime.sendMessage({ type: 'START_BREAK_SESSION' });
    setSessionType('break');
    setIsRunning(true);
    setTimeLeft(settings?.shortBreakDuration ? settings.shortBreakDuration * 60 : 0);
  };

  const resetTimer = async () => {
    chrome.runtime.sendMessage({ type: 'RESET_POMODORO' });
    setIsRunning(false);
    setTimeLeft(settings?.workDuration ? settings.workDuration * 60 : 0);
    setSessionType('work');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
          </h1>
          <div className="text-6xl font-mono mb-8">{formatTime(timeLeft)}</div>
          
          <div className="flex justify-center space-x-4 mb-8">
            {!isRunning ? (
              <>
                <button
                  onClick={startWorkSession}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Work
                </button>
                <button
                  onClick={startBreakSession}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Break
                </button>
              </>
            ) : (
              <button
                onClick={resetTimer}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Work Duration: {settings.workDuration} minutes</p>
            <p>Short Break: {settings.shortBreakDuration} minutes</p>
            <p>Long Break: {settings.longBreakDuration} minutes</p>
            <p>Sessions until long break: {settings.sessionsUntilLongBreak}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
