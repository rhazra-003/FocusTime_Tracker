import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Pomodoro from './pages/Pomodoro';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div className="container mx-auto px-4 py-6">
            <Navigation />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
