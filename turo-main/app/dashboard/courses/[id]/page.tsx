'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image'
import { BookOpen, Clock, Users, Star, Calendar, Award, Target, CheckCircle, FileText } from 'lucide-react';

// Mock course data - in a real app, this would come from an API
const getCourseDetails = (id: string) => {
  const courses = {
    '1': {
      id: '1',
      title: 'Advanced React Development',
      instructor: 'Sarah Johnson',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and modern patterns. This comprehensive course will take you from intermediate to expert level.',
      duration: '8 weeks',
      students: 234,
      rating: 4.8,
      price: '$299',
      category: 'Development',
      level: 'Advanced',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2024-02-15',
      progress: 65,
      completedLessons: 13,
      totalLessons: 20,
      nextLesson: 'Advanced State Management with Zustand',
      objectives: [
        'Master React Hooks and Custom Hooks',
        'Implement Advanced State Management',
        'Optimize React Performance',
        'Build Scalable Component Architecture',
        'Deploy Production-Ready Applications'
      ],
      recentActivity: [
        { type: 'lesson', title: 'Context API Deep Dive', date: '2 days ago' },
        { type: 'assignment', title: 'Build a Custom Hook', date: '5 days ago' },
        { type: 'quiz', title: 'React Performance Quiz', date: '1 week ago' }
      ]
    },
    '2': {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Michael Chen',
      description: 'Learn the principles of user interface and user experience design from scratch. Create beautiful, functional designs that users love.',
      duration: '6 weeks',
      students: 189,
      rating: 4.9,
      price: '$199',
      category: 'Design',
      level: 'Beginner',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2024-02-20',
      progress: 40,
      completedLessons: 8,
      totalLessons: 20,
      nextLesson: 'Color Theory and Psychology',
      objectives: [
        'Understand Design Principles',
        'Master Typography and Color',
        'Create User-Centered Designs',
        'Build Interactive Prototypes',
        'Conduct User Research'
      ],
      recentActivity: [
        { type: 'lesson', title: 'Typography Fundamentals', date: '1 day ago' },
        { type: 'project', title: 'Design System Creation', date: '3 days ago' },
        { type: 'feedback', title: 'Wireframe Review', date: '1 week ago' }
      ]
    }
  };
  
  return courses[id as keyof typeof courses] || {
    id,
    title: `Course ${id}`,
    instructor: 'Unknown Instructor',
    description: 'Course description not available.',
    duration: 'N/A',
    students: 0,
    rating: 0,
    price: '$0',
    category: 'General',
    level: 'Beginner',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    startDate: '2024-01-01',
    progress: 0,
    completedLessons: 0,
    totalLessons: 10,
    nextLesson: 'Getting Started',
    objectives: ['Learn the basics'],
    recentActivity: []
  };
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = getCourseDetails(courseId);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to {course.title}!</h2>
            <p className="text-blue-100 mb-4">Continue your learning journey</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>{course.rating}/5</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src={course.image}
              alt={course.title}
              className="w-32 h-32 rounded-lg object-cover border-4 border-white/20"
              width={128} height={128}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Completion</span>
                  <span className="text-sm text-gray-500">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{course.completedLessons}</div>
                  <div className="text-sm text-green-700">Lessons Completed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{course.totalLessons - course.completedLessons}</div>
                  <div className="text-sm text-blue-700">Lessons Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Lesson */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Next: {course.nextLesson}</h4>
                  <p className="text-sm text-gray-600">Lesson {course.completedLessons + 1} of {course.totalLessons}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Continue
              </button>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Learning Objectives
            </h3>
            <div className="space-y-3">
              {course.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Instructor</span>
                <span className="text-sm font-medium text-gray-900">{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Level</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <span className="text-sm font-medium text-gray-900">{course.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Start Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(course.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {course.recentActivity.length > 0 ? (
                course.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`p-1 rounded-full ${
                      activity.type === 'lesson' ? 'bg-blue-100' :
                      activity.type === 'assignment' ? 'bg-green-100' :
                      activity.type === 'quiz' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'lesson' && <BookOpen className="h-3 w-3 text-blue-600" />}
                      {activity.type === 'assignment' && <FileText className="h-3 w-3 text-green-600" />}
                      {activity.type === 'quiz' && <Award className="h-3 w-3 text-yellow-600" />}
                      {activity.type === 'project' && <Target className="h-3 w-3 text-purple-600" />}
                      {activity.type === 'feedback' && <CheckCircle className="h-3 w-3 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Download Course Materials
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Contact Instructor
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                View Certificate
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Course Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}