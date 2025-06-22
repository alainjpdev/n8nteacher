'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, FileText, Users, Settings } from 'lucide-react';

// Mock course data - in a real app, this would come from an API
const getCourseById = (id: string) => {
  const courses = {
    '1': { id: '1', title: 'Advanced React Development', instructor: 'Sarah Johnson' },
    '2': { id: '2', title: 'UI/UX Design Fundamentals', instructor: 'Michael Chen' },
    '3': { id: '3', title: 'Data Science with Python', instructor: 'Dr. Emily Rodriguez' },
    '4': { id: '4', title: 'Digital Marketing Strategy', instructor: 'Alex Thompson' },
    '5': { id: '5', title: 'Cloud Architecture with AWS', instructor: 'David Kim' },
    '6': { id: '6', title: 'Mobile App Development', instructor: 'Lisa Wang' },
  };
  return courses[id as keyof typeof courses] || { id, title: `Course ${id}`, instructor: 'Unknown Instructor' };
};

const tabs = [
  { name: 'Overview', href: '', icon: BookOpen },
  { name: 'Stream', href: '/stream', icon: Play },
  { name: 'Assignments', href: '/assignments', icon: FileText },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (courseId) {
      setCourse(getCourseById(courseId));
    }
  }, [courseId]);

  const getCurrentTab = () => {
    const basePath = `/dashboard/courses/${courseId}`;
    if (pathname === basePath) return '';
    if (pathname.endsWith('/stream')) return '/stream';
    if (pathname.endsWith('/assignments')) return '/assignments';
    if (pathname.endsWith('/people')) return '/people';
    if (pathname.endsWith('/settings')) return '/settings';
    return '';
  };

  const currentTab = getCurrentTab();

  if (!course) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/dashboard/courses"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-2 text-gray-600">
              Instructor: {course.instructor}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <nav className="flex space-x-0" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.href;
              const href = `/dashboard/courses/${courseId}${tab.href}`;
              
              return (
                <Link
                  key={tab.name}
                  href={href}
                  className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span>{tab.name}</span>
                  </div>
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="pb-8">
        {children}
      </div>
    </div>
  );
}