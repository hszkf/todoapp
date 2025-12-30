import { useStats } from '../hooks';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export function StatsCard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-4 mb-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total */}
        <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
            <Circle className="w-4 h-4" />
            <span>Active</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Overdue</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>
      </div>

      {/* Completion Rate & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Completion Rate */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Completion Rate</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-gray-500 text-sm mb-2">By Priority</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600">Low: {stats.byPriority.low}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm text-gray-600">Med: {stats.byPriority.medium}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm text-gray-600">High: {stats.byPriority.high}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
