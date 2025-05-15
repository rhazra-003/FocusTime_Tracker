import { useEffect, useState } from 'react';
import { TimeEntry } from '../types';

export default function CurrentTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const response = await chrome.runtime.sendMessage({ type: 'GET_TRACKING_STATUS' });
      setIsTracking(response.isTracking);
    };

    const checkEntry = async () => {
      const response = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_ENTRY' });
      setCurrentEntry(response.entry);
    };

    // Check initial status
    checkStatus();
    checkEntry();

    // Set up polling
    const interval = setInterval(() => {
      checkStatus();
      checkEntry();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isTracking || !currentEntry) {
    return null;
  }

  const duration = Math.floor((Date.now() - currentEntry.startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">Currently Tracking</h2>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Domain</p>
          <p className="font-medium">{currentEntry.domain}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
          <p className="font-medium">{currentEntry.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
          <p className="font-medium">{minutes}m {seconds}s</p>
        </div>
      </div>
    </div>
  );
} 