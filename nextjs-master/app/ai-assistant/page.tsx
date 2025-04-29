"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AiAssistantPage() {
  const [showVideo, setShowVideo] = useState(false);

  const handleStartChat = () => {
    setShowVideo(true);
  };

  return (
    <div className="flex items-center justify-center h-screen p-4 relative bg-black">
      {!showVideo ? (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white">AI Assistant</h1>
          <p className="text-lg text-white/80">How can I help you find your dream home today?</p>
          <Button onClick={handleStartChat}>Start Chat</Button>
        </div>
      ) : (
        <div className="absolute inset-0 z-50">
          <video
            src="https://YOUR_SUPABASE_STORAGE_URL/your-ai-intro.mp4"
            autoPlay
            muted={false}
            controls={false}
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => setShowVideo(false)} // Opcional: ocultar el video cuando termine
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
    </div>
  );
}