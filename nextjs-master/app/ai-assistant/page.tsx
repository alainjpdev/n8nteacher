"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";

export default function AiAssistantPage() {
  const [showVideo, setShowVideo] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [n8nResponse, setN8nResponse] = useState("");

  const vapiRef = useRef<Vapi | null>(null);

  const apiKey = "5a53fe75-568e-4cf2-8d1e-64e26d668a0e";
  const agentId = "c325866b-7fb3-49b4-bfcd-50504a2fd349";

  // Init Vapi
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      console.log("✅ Call started");
      setIsCalling(true);
    });

    vapi.on("call-end", () => {
      console.log("📴 Call ended");
      setIsCalling(false);
    });

    vapi.on("message", (data) => {
      if (data.type === "transcript") {
        console.log("🧍 User:", data.transcript);
        setMessages((prev) => [...prev, `🧍 ${data.transcript}`]);
      } else if (data.type === "agent") {
        console.log("🤖 Agent:", data.transcript);
        setMessages((prev) => [...prev, `🤖 ${data.transcript}`]);
      }
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const handleStartChat = () => {
    setShowVideo(true);
  };

  const handleSkip = () => {
    setShowVideo(false);
  };

  const startCall = () => {
    vapiRef.current?.start(agentId);
  };

  const stopCall = () => {
    vapiRef.current?.stop();
  };

  const callN8n = async () => {
    setN8nResponse("⏳ Sending...");
    try {
      const res = await fetch("/api/n8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            from: { id: 6433760200 },
            text: "Hello from AI Assistant Page",
          },
        }),
      });

      const data = await res.json();
      setN8nResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setN8nResponse(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-4 relative bg-black text-white">
      {!showVideo ? (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">AI Assistant</h1>
          <p className="text-lg text-white/80">How can I help you find your dream home today?</p>
         {/* <Button onClick={handleStartChat}>Start Chat</Button>*/}
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
            onEnded={handleSkip}
          />
          <div className="absolute inset-0 bg-black/40" />
          <Button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-50 bg-white text-black"
          >
            Skip
          </Button>
        </div>
      )}

      {/* Vapi UI after skipping or finishing video */}
      {!showVideo && (
        <div className="absolute bottom-4 w-full px-4">
          <div className="bg-white text-black rounded-xl shadow-lg p-4 max-w-3xl mx-auto">
            <div className="flex gap-4 mb-4">
              <Button onClick={startCall} disabled={isCalling}>
                🎤 Start Call
              </Button>
              <Button onClick={stopCall} disabled={!isCalling} variant="destructive">
                🛑 Stop Call
              </Button>
              {/*<Button onClick={callN8n} variant="secondary">
                📤 Send to n8n
              </Button>*/}
            </div>

            <div className="max-h-40 overflow-y-auto mb-2 border rounded p-2 bg-gray-100 text-black">
              <h3 className="font-semibold mb-1">📝 Conversation:</h3>
              {messages.map((msg, i) => (
                <p key={i} className="text-sm">{msg}</p>
              ))}
            </div>

            {n8nResponse && (
              <pre className="bg-gray-200 p-2 rounded text-sm overflow-x-auto">
                {n8nResponse}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}