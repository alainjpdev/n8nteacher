import React from 'react';
import ChatBox from './components/ChatBox';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-screen flex flex-col">
        {/* Mobile-only Chat Box */}
        <div className="w-full h-full">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

export default App; 