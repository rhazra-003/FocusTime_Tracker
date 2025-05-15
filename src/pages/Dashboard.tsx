import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { storage } from '../utils/storage';
import { DailyStats, WebsiteCategory } from '../types';
import dayjs from 'dayjs';
import CurrentTracking from '../components/CurrentTracking';

const COLORS = {
  Work: '#4CAF50',
  Social: '#2196F3',
  Entertainment: '#F44336',
  Learning: '#9C27B0',
  Productivity: '#FF9800',
  Other: '#607D8B',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    loadStats();
    // Set up polling for real-time updates
    const interval = setInterval(loadStats, 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadStats = async () => {
    const allStats = await storage.getDailyStats();
    const today = dayjs().format('YYYY-MM-DD');
    
    if (timeRange === 'daily') {
      setStats(allStats[today] || null);
    } else if (timeRange === 'weekly') {
      // Aggregate last 7 days
      const weekStats = aggregateStats(allStats, 7);
      setStats(weekStats);
    } else {
      // Aggregate last 30 days
      const monthStats = aggregateStats(allStats, 30);
      setStats(monthStats);
    }
  };

  const aggregateStats = (allStats: Record<string, DailyStats>, days: number): DailyStats => {
    const endDate = dayjs();
    const startDate = endDate.subtract(days - 1, 'day');
    
    const aggregatedStats: DailyStats = {
      date: `${startDate.format('YYYY-MM-DD')} to ${endDate.format('YYYY-MM-DD')}`,
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

    for (let i = 0; i < days; i++) {
      const date = startDate.add(i, 'day').format('YYYY-MM-DD');
      const dayStats = allStats[date];
      
      if (dayStats) {
        aggregatedStats.totalTime += dayStats.totalTime;
        
        Object.entries(dayStats.byCategory).forEach(([category, time]) => {
          aggregatedStats.byCategory[category as WebsiteCategory] += time;
        });

        Object.entries(dayStats.byDomain).forEach(([domain, time]) => {
          aggregatedStats.byDomain[domain] = (aggregatedStats.byDomain[domain] || 0) + time;
        });
      }
    }

    return aggregatedStats;
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const categoryData = stats
    ? Object.entries(stats.byCategory)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  const domainData = stats
    ? Object.entries(stats.byDomain)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Time Tracking Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <CurrentTracking />

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Time by Category</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }: { name: string; percent: number }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name as WebsiteCategory]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatTime(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Top 10 Domains</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis tickFormatter={(value) => formatTime(value)} />
                  <Tooltip formatter={(value: number) => formatTime(value)} />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Time</div>
                <div className="text-2xl font-bold">{formatTime(stats.totalTime)}</div>
              </div>
              {Object.entries(stats.byCategory).map(([category, time]) => (
                <div key={category} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{category}</div>
                  <div className="text-2xl font-bold">{formatTime(time)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No data available for the selected time range.</p>
        </div>
      )}
    </div>
  );
} 