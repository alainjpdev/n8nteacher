'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock
} from 'lucide-react';

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Active Users',
    value: '2,350',
    change: '+180.1%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Conversion Rate',
    value: '12.5%',
    change: '-4.3%',
    changeType: 'negative',
    icon: TrendingUp,
  },
  {
    name: 'System Health',
    value: '99.9%',
    change: '+0.2%',
    changeType: 'positive',
    icon: Activity,
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'Alice Johnson',
    action: 'completed purchase',
    amount: '$299.00',
    time: '2 minutes ago',
  },
  {
    id: 2,
    user: 'Bob Smith',
    action: 'signed up for pro plan',
    amount: '$49.00',
    time: '5 minutes ago',
  },
  {
    id: 3,
    user: 'Carol Davis',
    action: 'upgraded account',
    amount: '$99.00',
    time: '12 minutes ago',
  },
  {
    id: 4,
    user: 'David Wilson',
    action: 'completed onboarding',
    amount: null,
    time: '1 hour ago',
  },
];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { user } = useUser();

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userName}!
            </h1>
            <p className="mt-2 text-gray-600">
              Here s what s happening with your business today.
            </p>
            <p className="mt-1 text-sm text-blue-600 font-medium">
              User ID: {user?.id?.slice(-12) || 'Loading...'}
            </p>
          </div>
          {currentTime && (
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`ml-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-sm text-gray-500">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600">Latest user interactions and transactions</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user} {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">Add User</h4>
                <p className="text-xs text-gray-500 mt-1">Create new user account</p>
              </button>
              
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">Generate Report</h4>
                <p className="text-xs text-gray-500 mt-1">Export analytics data</p>
              </button>
              
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900">Campaign</h4>
                <p className="text-xs text-gray-500 mt-1">Launch marketing campaign</p>
              </button>
              
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200">
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900">System Check</h4>
                <p className="text-xs text-gray-500 mt-1">Run health diagnostics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}