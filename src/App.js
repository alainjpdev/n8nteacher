import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import VectorizedDataCollector from './components/VectorizedDataCollector';
import SimpleBrowserControl from './components/SimpleBrowserControl';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-screen flex flex-col">
        {/* Tabs */}
        <div className="flex bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'chat'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab('collector')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'collector'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Recolector Vectorizado
          </button>
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'simple'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌐 Control Simple
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' ? (
            <ChatBox />
          ) : activeTab === 'collector' ? (
            <div className="h-full overflow-y-auto p-4">
              <VectorizedDataCollector />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-4">
              <SimpleBrowserControl />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 