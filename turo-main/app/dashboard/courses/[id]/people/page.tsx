'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image'
import { Users, Search, Mail, MessageCircle, UserPlus, Crown, Award, Calendar } from 'lucide-react';

// Mock people data
const getPeopleData = (courseId: string) => {
  return {
    instructor: {
      id: 'instructor-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Instructor',
      bio: 'Senior React Developer with 8+ years of experience. Passionate about teaching and modern web development.',
      joinedDate: '2023-01-15',
      coursesCreated: 12,
      totalStudents: 2500
    },
    teachingAssistants: [
      {
        id: 'ta-1',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Teaching Assistant',
        bio: 'Full-stack developer helping students with assignments and technical questions.',
        joinedDate: '2023-06-01',
        responseTime: '< 2 hours'
      }
    ],
    students: [
      {
        id: 'student-1',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Student',
        progress: 85,
        joinedDate: '2024-01-10',
        lastActive: '2024-01-15T10:30:00Z',
        assignmentsCompleted: 8,
        totalAssignments: 10
      },
      {
        id: 'student-2',
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Student',
        progress: 92,
        joinedDate: '2024-01-08',
        lastActive: '2024-01-14T15:45:00Z',
        assignmentsCompleted: 9,
        totalAssignments: 10
      },
      {
        id: 'student-3',
        name: 'Carol Davis',
        email: 'carol.davis@example.com',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Student',
        progress: 67,
        joinedDate: '2024-01-12',
        lastActive: '2024-01-13T09:20:00Z',
        assignmentsCompleted: 6,
        totalAssignments: 10
      },
      {
        id: 'student-4',
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Student',
        progress: 78,
        joinedDate: '2024-01-05',
        lastActive: '2024-01-15T14:10:00Z',
        assignmentsCompleted: 7,
        totalAssignments: 10
      },
      {
        id: 'student-5',
        name: 'Emma Brown',
        email: 'emma.brown@example.com',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Student',
        progress: 95,
        joinedDate: '2024-01-03',
        lastActive: '2024-01-15T16:30:00Z',
        assignmentsCompleted: 10,
        totalAssignments: 10
      },
      {
        id: 'student-6',
        name: 'Frank Miller',
        email: 'frank.miller@example.com',
        avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Student',
        progress: 45,
        joinedDate: '2024-01-14',
        lastActive: '2024-01-14T11:15:00Z',
        assignmentsCompleted: 4,
        totalAssignments: 10
      }
    ]
  };
};

export default function PeoplePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  const peopleData = getPeopleData(courseId);
  const allPeople = [
    peopleData.instructor,
    ...peopleData.teachingAssistants,
    ...peopleData.students
  ];

  const filteredPeople = allPeople.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || person.role.toLowerCase().includes(selectedRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Instructor':
        return 'bg-purple-100 text-purple-800';
      case 'Teaching Assistant':
        return 'bg-blue-100 text-blue-800';
      case 'Student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Instructor':
        return <Crown className="h-4 w-4" />;
      case 'Teaching Assistant':
        return <Award className="h-4 w-4" />;
      case 'Student':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getLastActiveText = (lastActive: string) => {
    const now = new Date();
    const activeDate = new Date(lastActive);
    const diffInHours = Math.floor((now.getTime() - activeDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Instructors</p>
              <p className="text-xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">TAs</p>
              <p className="text-xl font-bold text-gray-900">{peopleData.teachingAssistants.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-xl font-bold text-gray-900">{peopleData.students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round(peopleData.students.reduce((sum, student) => sum + student.progress, 0) / peopleData.students.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="instructor">Instructors</option>
              <option value="teaching">Teaching Assistants</option>
              <option value="student">Students</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Invite People</span>
          </button>
        </div>
      </div>

      {/* Instructor Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Crown className="h-5 w-5 mr-2 text-purple-600" />
            Course Instructor
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <Image
              src={peopleData.instructor.avatar}
              alt={peopleData.instructor.name}
              className="w-16 h-16 rounded-full object-cover"
              width={64} height={64}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{peopleData.instructor.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(peopleData.instructor.role)}`}>
                  {getRoleIcon(peopleData.instructor.role)}
                  <span className="ml-1">{peopleData.instructor.role}</span>
                </span>
              </div>
              <p className="text-gray-600 mb-3">{peopleData.instructor.bio}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                <span>{peopleData.instructor.coursesCreated} courses created</span>
                <span>{peopleData.instructor.totalStudents.toLocaleString()} total students</span>
                <span>Joined {new Date(peopleData.instructor.joinedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* People List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">All Course Members</h2>
          <p className="text-gray-600 mt-1">
            {filteredPeople.length} of {allPeople.length} people
          </p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredPeople.map((person) => (
            <div key={person.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image
                    src={person.avatar}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover"
                    width={48} height={48}
                  />
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-medium text-gray-900">{person.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(person.role)}`}>
                        {getRoleIcon(person.role)}
                        <span className="ml-1">{person.role}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{person.email}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>Joined {new Date(person.joinedDate).toLocaleDateString()}</span>
                      {'lastActive' in person && (
                        <span>Last active {getLastActiveText(person.lastActive)}</span>
                      )}
                      {'progress' in person && (
                        <span>{person.progress}% complete</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {'progress' in person && (
                    <div className="hidden sm:block w-24">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{person.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${person.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPeople.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No people found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}