'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, Upload, Download, Eye } from 'lucide-react';

// Mock assignments data
const getAssignmentsData = (courseId: string) => {
  return [
    {
      id: 1,
      title: 'Build a Custom React Hook',
      description: 'Create a custom hook that manages local storage state with automatic synchronization.',
      dueDate: '2024-01-25',
      status: 'submitted',
      points: 100,
      earnedPoints: 85,
      submittedAt: '2024-01-23T10:30:00Z',
      feedback: 'Great work! Your hook implementation is clean and well-documented. Consider adding error handling for edge cases.',
      type: 'project'
    },
    {
      id: 2,
      title: 'Context API Implementation',
      description: 'Implement a theme context provider with dark/light mode switching functionality.',
      dueDate: '2024-01-30',
      status: 'in-progress',
      points: 75,
      earnedPoints: null,
      submittedAt: null,
      feedback: null,
      type: 'coding'
    },
    {
      id: 3,
      title: 'Performance Optimization Quiz',
      description: 'Test your knowledge of React performance optimization techniques and best practices.',
      dueDate: '2024-02-05',
      status: 'pending',
      points: 50,
      earnedPoints: null,
      submittedAt: null,
      feedback: null,
      type: 'quiz'
    },
    {
      id: 4,
      title: 'Component Architecture Design',
      description: 'Design and document a scalable component architecture for a large React application.',
      dueDate: '2024-02-10',
      status: 'pending',
      points: 150,
      earnedPoints: null,
      submittedAt: null,
      feedback: null,
      type: 'design'
    }
  ];
};

export default function AssignmentsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [selectedTab, setSelectedTab] = useState('all');
  const assignments = getAssignmentsData(courseId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return '🚀';
      case 'coding':
        return '💻';
      case 'quiz':
        return '📝';
      case 'design':
        return '🎨';
      default:
        return '📄';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedTab === 'all') return true;
    return assignment.status === selectedTab;
  });

  const tabs = [
    { id: 'all', label: 'All Assignments', count: assignments.length },
    { id: 'pending', label: 'Pending', count: assignments.filter(a => a.status === 'pending').length },
    { id: 'in-progress', label: 'In Progress', count: assignments.filter(a => a.status === 'in-progress').length },
    { id: 'submitted', label: 'Submitted', count: assignments.filter(a => a.status === 'submitted').length }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  selectedTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Assignments List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl">{getTypeIcon(assignment.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1 capitalize">{assignment.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Points: {assignment.points}</span>
                        </div>
                        {assignment.submittedAt && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {assignment.feedback && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Feedback:</strong> {assignment.feedback}
                          </p>
                          {assignment.earnedPoints && (
                            <p className="text-sm text-blue-700 mt-1">
                              <strong>Score:</strong> {assignment.earnedPoints}/{assignment.points} points
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {assignment.status === 'pending' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <FileText className="h-4 w-4" />
                        <span>Start</span>
                      </button>
                    )}
                    
                    {assignment.status === 'in-progress' && (
                      <>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>Submit</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>Preview</span>
                        </button>
                      </>
                    )}
                    
                    {assignment.status === 'submitted' && (
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600">
                {selectedTab === 'all' 
                  ? 'No assignments have been created for this course yet.'
                  : `No ${selectedTab.replace('-', ' ')} assignments found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}