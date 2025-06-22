'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  Calendar, 
  Clock, 
  DollarSign,
  Users,
  BookOpen,
  Save,
  Eye
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  'Development',
  'Design',
  'Data Science',
  'Marketing',
  'Cloud Computing',
  'Mobile Development',
  'Business',
  'Photography',
  'Music',
  'Language Learning'
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    instructor: '',
    category: '',
    level: '',
    duration: '',
    price: '',
    maxStudents: '',
    startDate: '',
    endDate: '',
    prerequisites: '',
    learningObjectives: '',
    courseImage: null as File | null,
    syllabus: [
      { week: 1, title: '', description: '' }
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        courseImage: file
      }));
    }
  };

  const addSyllabusWeek = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [
        ...prev.syllabus,
        { week: prev.syllabus.length + 1, title: '', description: '' }
      ]
    }));
  };

  const updateSyllabusWeek = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeSyllabusWeek = (index: number) => {
    if (formData.syllabus.length > 1) {
      setFormData(prev => ({
        ...prev,
        syllabus: prev.syllabus.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Course created:', formData);
      setIsSubmitting(false);
      router.push('/dashboard/courses');
    }, 2000);
  };

  const handlePreview = () => {
    console.log('Preview course:', formData);
    // In a real app, this would open a preview modal or navigate to a preview page
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
            <p className="mt-2 text-gray-600">
              Fill in the details below to create your course
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    id="shortDescription"
                    name="shortDescription"
                    required
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description for course cards"
                    maxLength={120}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/120 characters</p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide a detailed description of your course"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor Name *
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      required
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    id="level"
                    name="level"
                    required
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select difficulty level</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Course Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 8 weeks, 40 hours"
                  />
                </div>

                <div>
                  <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    id="maxStudents"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Learning Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Content</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-2">
                    Prerequisites
                  </label>
                  <textarea
                    id="prerequisites"
                    name="prerequisites"
                    rows={3}
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What should students know before taking this course?"
                  />
                </div>

                <div>
                  <label htmlFor="learningObjectives" className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives *
                  </label>
                  <textarea
                    id="learningObjectives"
                    name="learningObjectives"
                    required
                    rows={4}
                    value={formData.learningObjectives}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What will students learn? List the key outcomes..."
                  />
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Course Syllabus</h2>
                <button
                  type="button"
                  onClick={addSyllabusWeek}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Week
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.syllabus.map((week, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Week {week.week}</h3>
                      {formData.syllabus.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSyllabusWeek(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Week title"
                        value={week.title}
                        onChange={(e) => updateSyllabusWeek(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <textarea
                        placeholder="Week description and topics covered"
                        rows={2}
                        value={week.description}
                        onChange={(e) => updateSyllabusWeek(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Image */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Image</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload course thumbnail</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="courseImage"
                  />
                  <label
                    htmlFor="courseImage"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
                {formData.courseImage && (
                  <p className="text-sm text-gray-600">
                    Selected: {formData.courseImage.name}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Course
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Success</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Use a clear, descriptive title</li>
                <li>• Include specific learning outcomes</li>
                <li>• Structure your syllabus logically</li>
                <li>• Choose an engaging thumbnail image</li>
                <li>• Set realistic expectations for prerequisites</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}