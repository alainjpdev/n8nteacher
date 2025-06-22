'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Plus,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

const dummyCourses = [
  {
    id: 1,
    title: 'Advanced React Development',
    description: 'Master advanced React concepts including hooks, context, and performance optimization.',
    instructor: 'Sarah Johnson',
    duration: '8 weeks',
    students: 234,
    rating: 4.8,
    price: '$299',
    category: 'Development',
    level: 'Advanced',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2024-02-15',
    status: 'Active'
  },
  {
    id: 2,
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design from scratch.',
    instructor: 'Michael Chen',
    duration: '6 weeks',
    students: 189,
    rating: 4.9,
    price: '$199',
    category: 'Design',
    level: 'Beginner',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2024-02-20',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Data Science with Python',
    description: 'Comprehensive introduction to data science using Python, pandas, and machine learning.',
    instructor: 'Dr. Emily Rodriguez',
    duration: '12 weeks',
    students: 156,
    rating: 4.7,
    price: '$399',
    category: 'Data Science',
    level: 'Intermediate',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2024-03-01',
    status: 'Upcoming'
  },
  {
    id: 4,
    title: 'Digital Marketing Strategy',
    description: 'Build effective digital marketing campaigns across multiple channels.',
    instructor: 'Alex Thompson',
    duration: '4 weeks',
    students: 298,
    rating: 4.6,
    price: '$149',
    category: 'Marketing',
    level: 'Beginner',
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2024-02-10',
    status: 'Active'
  },
  {
    id: 5,
    title: 'Cloud Architecture with AWS',
    description: 'Design and implement scalable cloud solutions using Amazon Web Services.',
    instructor: 'David Kim',
    duration: '10 weeks',
    students: 87,
    rating: 4.9,
    price: '$449',
    category: 'Cloud Computing',
    level: 'Advanced',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2024-03-15',
    status: 'Upcoming'
  },
  {
    id: 6,
    title: 'Mobile App Development',
    description: 'Create native mobile applications for iOS and Android platforms.',
    instructor: 'Lisa Wang',
    duration: '14 weeks',
    students: 203,
    rating: 4.8,
    price: '$349',
    category: 'Mobile Development',
    level: 'Intermediate',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2024-02-25',
    status: 'Active'
  }
];

const categories = ['All', 'Development', 'Design', 'Data Science', 'Marketing', 'Cloud Computing', 'Mobile Development'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredCourses = dummyCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="mt-2 text-gray-600">
              Discover and manage your learning journey
            </p>
          </div>
          <Link
            href="/dashboard/courses/create"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{dummyCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {dummyCourses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(dummyCourses.reduce((sum, course) => sum + course.rating, 0) / dummyCourses.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative">
              <Image
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
                width={500} height={300}
              />
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">by {course.instructor}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Starts {new Date(course.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{course.price}</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new course.</p>
        </div>
      )}
    </div>
  );
}