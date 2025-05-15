import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg ${
              isActive('/')
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/pomodoro"
            className={`px-4 py-2 rounded-lg ${
              isActive('/pomodoro')
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Pomodoro
          </Link>
          <Link
            to="/settings"
            className={`px-4 py-2 rounded-lg ${
              isActive('/settings')
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Settings
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
} 