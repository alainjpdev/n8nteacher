'use client';

import { useState } from 'react';
import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  Search,
  BookOpen,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HeaderUser from '@/components/HeaderUser';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Create Course', href: '/dashboard/courses/create', icon: Plus },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayoutClient({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  console.log('DashboardLayoutClient - userId:', userId);

  const isCurrentPage = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const current = isCurrentPage(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    current
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.name}
                  {current && <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />}
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile User Section */}
          <div className="p-4 border-t border-gray-100">
            <HeaderUser />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-white shadow-lg border-r border-gray-100">
          <div className="flex items-center h-16 px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const current = isCurrentPage(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    current
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.name}
                  {current && <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />}
                </Link>
              );
            })}
          </nav>
          
          {/* Desktop User Section */}
          <div className="p-4 border-t border-gray-100">
            <HeaderUser />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Search bar */}
              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Header User Component - Only show avatar on mobile */}
              <div className="lg:hidden">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}