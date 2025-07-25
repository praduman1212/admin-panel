import React from 'react';
import {
  Users,
  BookOpen,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{value}</h3>
        {trend && (
          <p className="text-sm font-medium text-green-600 dark:text-green-500 mt-2">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, description, iconBg, iconColor }) => (
  <div className="flex items-start gap-4 p-4">
    <div className={`p-2 rounded-lg ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

export default function Home() {
  const stats = [
    {
      title: 'Total Students',
      value: '2,543',
      trend: '+12.5% this month',
      icon: Users
    },
    {
      title: 'Active Courses',
      value: '148',
      trend: '+4.3% this month',
      icon: BookOpen
    },
    {
      title: 'Course Rating',
      value: '4.8',
      trend: '+2.1% this month',
      icon: Star
    }
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      title: 'New Course Published',
      description: '"Advanced React Patterns" by John Smith is now live',
      time: '2 hours ago',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-500'
    },
    {
      icon: AlertCircle,
      title: 'Course Report',
      description: 'A student reported an issue in "Python Basics" course',
      time: '4 hours ago',
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-500'
    },
    {
      icon: Clock,
      title: 'Course Update',
      description: '"Web Development Bootcamp" content has been updated',
      time: '6 hours ago',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-500'
    }
  ];

  return (
    <div className="px-2 sm:px-4 md:px-8 py-4 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
