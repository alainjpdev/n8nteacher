import React from 'react';
import ChatBox from './components/ChatBox';
import EmbeddedBrowser from './components/EmbeddedBrowser';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-screen flex">
        {/* Browser Embebido - 2/3 del ancho */}
        <div className="w-2/3 h-full">
          <EmbeddedBrowser />
        </div>
        
        {/* Chat - 1/3 del ancho */}
        <div className="w-1/3 h-full border-l border-gray-700">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

export default App; 