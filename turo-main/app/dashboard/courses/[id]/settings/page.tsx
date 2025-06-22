'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { 
  Settings, 
  Save, 
  Trash2, 
  Eye, 
  EyeOff, 
  Users, 
  Calendar, 
  DollarSign,
  Bell,
  Shield,
  Globe,
  Lock,
  AlertTriangle
} from 'lucide-react';

// Mock course settings data
const getCourseSettings = (courseId: string) => {
  return {
    basic: {
      title: 'Advanced React Development',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and modern patterns.',
      category: 'Development',
      level: 'Advanced',
      language: 'English',
      tags: ['React', 'JavaScript', 'Frontend', 'Web Development']
    },
    enrollment: {
      isPublic: true,
      requiresApproval: false,
      maxStudents: 100,
      currentStudents: 67,
      enrollmentDeadline: '2024-02-28',
      allowWaitlist: true
    },
    pricing: {
      isFree: false,
      price: 299,
      currency: 'USD',
      discountEnabled: true,
      discountPercentage: 20,
      discountEndDate: '2024-02-15'
    },
    schedule: {
      startDate: '2024-02-15',
      endDate: '2024-04-15',
      timezone: 'America/New_York',
      weeklySchedule: [
        { day: 'Monday', time: '14:00', duration: 90 },
        { day: 'Wednesday', time: '14:00', duration: 90 }
      ]
    },
    notifications: {
      emailNotifications: true,
      assignmentReminders: true,
      discussionUpdates: false,
      weeklyDigest: true,
      studentNotifications: {
        newAnnouncements: true,
        assignmentGrades: true,
        courseUpdates: true
      }
    },
    privacy: {
      courseVisibility: 'public',
      studentListVisible: true,
      allowStudentDiscussion: true,
      requireRealNames: false
    }
  };
};

export default function SettingsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [settings, setSettings] = useState(getCourseSettings(courseId));
  const [activeTab, setActiveTab] = useState('basic');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Settings },
    { id: 'enrollment', label: 'Enrollment', icon: Users },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    // Show success message
  };

  const handleDeleteCourse = () => {
    // In a real app, this would delete the course
    console.log('Deleting course:', courseId);
    setShowDeleteConfirm(false);
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
        <input
          type="text"
          value={settings.basic.title}
          onChange={(e) => updateSetting('basic', 'title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={4}
          value={settings.basic.description}
          onChange={(e) => updateSetting('basic', 'description', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={settings.basic.category}
            onChange={(e) => updateSetting('basic', 'category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
          <select
            value={settings.basic.level}
            onChange={(e) => updateSetting('basic', 'level', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderEnrollmentSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Public Course</h3>
          <p className="text-sm text-gray-600">Allow anyone to discover and enroll in this course</p>
        </div>
        <button
          onClick={() => updateSetting('enrollment', 'isPublic', !settings.enrollment.isPublic)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.enrollment.isPublic ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.enrollment.isPublic ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Require Approval</h3>
          <p className="text-sm text-gray-600">Manually approve each enrollment request</p>
        </div>
        <button
          onClick={() => updateSetting('enrollment', 'requiresApproval', !settings.enrollment.requiresApproval)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.enrollment.requiresApproval ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.enrollment.requiresApproval ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Students</label>
        <input
          type="number"
          value={settings.enrollment.maxStudents}
          onChange={(e) => updateSetting('enrollment', 'maxStudents', parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Currently enrolled: {settings.enrollment.currentStudents} students
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Deadline</label>
        <input
          type="date"
          value={settings.enrollment.enrollmentDeadline}
          onChange={(e) => updateSetting('enrollment', 'enrollmentDeadline', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderPricingSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Free Course</h3>
          <p className="text-sm text-gray-600">Make this course available at no cost</p>
        </div>
        <button
          onClick={() => updateSetting('pricing', 'isFree', !settings.pricing.isFree)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.pricing.isFree ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.pricing.isFree ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {!settings.pricing.isFree && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={settings.pricing.price}
                  onChange={(e) => updateSetting('pricing', 'price', parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.pricing.currency}
                onChange={(e) => updateSetting('pricing', 'currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Enable Discount</h3>
              <p className="text-sm text-gray-600">Offer a promotional discount</p>
            </div>
            <button
              onClick={() => updateSetting('pricing', 'discountEnabled', !settings.pricing.discountEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pricing.discountEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pricing.discountEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {settings.pricing.discountEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
                <input
                  type="number"
                  value={settings.pricing.discountPercentage}
                  onChange={(e) => updateSetting('pricing', 'discountPercentage', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount End Date</label>
                <input
                  type="date"
                  value={settings.pricing.discountEndDate}
                  onChange={(e) => updateSetting('pricing', 'discountEndDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Instructor Notifications</h3>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => {
            if (key === 'studentNotifications') return null;
            return (
              <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {key === 'emailNotifications' && 'Receive email notifications for course activities'}
                    {key === 'assignmentReminders' && 'Get reminders about assignment due dates'}
                    {key === 'discussionUpdates' && 'Notifications for new discussion posts'}
                    {key === 'weeklyDigest' && 'Weekly summary of course activity'}
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('notifications', key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Notifications</h3>
        <div className="space-y-4">
          {Object.entries(settings.notifications.studentNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'newAnnouncements' && 'Notify students of new course announcements'}
                  {key === 'assignmentGrades' && 'Send notifications when assignments are graded'}
                  {key === 'courseUpdates' && 'Alert students about course content updates'}
                </p>
              </div>
              <button
                onClick={() => {
                  const newStudentNotifications = {
                    ...settings.notifications.studentNotifications,
                    [key]: !value
                  };
                  updateSetting('notifications', 'studentNotifications', newStudentNotifications);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicSettings();
      case 'enrollment':
        return renderEnrollmentSettings();
      case 'pricing':
        return renderPricingSettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return <div className="text-center py-8 text-gray-500">Settings for {activeTab} coming soon...</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Settings</h1>
          <p className="text-gray-600 mt-1">Manage your course configuration and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
            <p className="text-red-700 mt-1 mb-4">
              Once you delete a course, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Delete Course</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be undone and will permanently remove all course content, assignments, and student data.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}