'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image'
import { Play, Clock, Eye, MessageCircle, ThumbsUp, Share2, Download } from 'lucide-react';

// Mock stream data
const getStreamData = (courseId: string) => {
  return {
    liveStream: {
      isLive: true,
      title: 'Advanced React Patterns - Live Session',
      startTime: '2024-01-15T14:00:00Z',
      viewers: 127,
      duration: '1h 30m'
    },
    recordings: [
      {
        id: 1,
        title: 'Introduction to Advanced React Concepts',
        duration: '45:32',
        views: 234,
        date: '2024-01-10',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Overview of advanced React patterns and concepts we\'ll cover in this course.'
      },
      {
        id: 2,
        title: 'Custom Hooks Deep Dive',
        duration: '52:18',
        views: 189,
        date: '2024-01-08',
        thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Learn how to create powerful custom hooks for state management and side effects.'
      },
      {
        id: 3,
        title: 'Context API and State Management',
        duration: '38:45',
        views: 156,
        date: '2024-01-05',
        thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Master the Context API and learn when to use it for state management.'
      },
      {
        id: 4,
        title: 'Performance Optimization Techniques',
        duration: '1:02:15',
        views: 203,
        date: '2024-01-03',
        thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Optimize your React applications with memoization, lazy loading, and more.'
      }
    ]
  };
};

export default function StreamPage() {
  const params = useParams();
  const courseId = params.id as string;
  const streamData = getStreamData(courseId);

  return (
    <div className="space-y-8">
      {/* Live Stream Section */}
      {streamData.liveStream.isLive && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-medium">LIVE</span>
                </div>
                <h2 className="text-lg font-semibold">{streamData.liveStream.title}</h2>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{streamData.liveStream.viewers}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{streamData.liveStream.duration}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <p className="text-lg font-medium">Live Stream Player</p>
              <p className="text-sm opacity-80">Click to join the live session</p>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Play className="h-4 w-4" />
                  <span>Join Live</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </button>
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recorded Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recorded Sessions</h2>
          <p className="text-gray-600 mt-1">Access previous course sessions and lectures</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {streamData.recordings.map((recording) => (
              <div key={recording.id} className="group cursor-pointer">
                <div className="relative rounded-lg overflow-hidden mb-3">
                  <Image
                    src={recording.thumbnail}
                    alt={recording.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    width={500} height={300}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {recording.duration}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {recording.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {recording.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{recording.views} views</span>
                      </div>
                      <span>{new Date(recording.date).toLocaleDateString()}</span>
                    </div>
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stream Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          <p className="text-gray-600 mt-1">Schedule of upcoming live sessions</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">React Performance Deep Dive</h3>
                  <p className="text-sm text-gray-600">Advanced optimization techniques and best practices</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Jan 20, 2024</p>
                <p className="text-xs text-gray-500">2:00 PM EST</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Q&A Session</h3>
                  <p className="text-sm text-gray-600">Open discussion and questions from students</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Jan 25, 2024</p>
                <p className="text-xs text-gray-500">3:00 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}