import './timeTracker';
import { pomodoroTimer } from './pomodoro';
import { timeTracker } from './timeTracker';

type MessageType = 
  | { type: 'GET_CURRENT_SESSION' }
  | { type: 'START_WORK_SESSION' }
  | { type: 'START_BREAK_SESSION' }
  | { type: 'RESET_POMODORO' }
  | { type: 'GET_TRACKING_STATUS' }
  | { type: 'GET_CURRENT_ENTRY' };

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message: MessageType, _sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_SESSION') {
    // Handle getting current Pomodoro session
    sendResponse({ success: true, session: pomodoroTimer.currentSession });
  } else if (message.type === 'START_WORK_SESSION') {
    // Handle starting a work session
    pomodoroTimer.startWorkSession();
    sendResponse({ success: true });
  } else if (message.type === 'START_BREAK_SESSION') {
    // Handle starting a break session
    pomodoroTimer.startBreakSession();
    sendResponse({ success: true });
  } else if (message.type === 'RESET_POMODORO') {
    // Handle resetting the Pomodoro timer
    pomodoroTimer.resetTimer();
    sendResponse({ success: true });
  } else if (message.type === 'GET_TRACKING_STATUS') {
    // Handle getting time tracking status
    sendResponse({ success: true, isTracking: timeTracker.isCurrentlyTracking() });
  } else if (message.type === 'GET_CURRENT_ENTRY') {
    // Handle getting current time entry
    sendResponse({ success: true, entry: timeTracker.getCurrentEntry() });
  }
  return true; // Keep the message channel open for async responses
}); 