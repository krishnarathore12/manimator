// App.tsx or ChatPage.tsx
import { useState } from 'react'; // Import useState
import './App.css';
import ChatSidePanel from './SideChatBar';
import MediaPreviewInterface from './VideoCanvas';

// Default export for the App component
export default function ChatPage() {
  // 1. State for the video path, initialized to null or a default
  const [currentVideoPath, setCurrentVideoPath] = useState<string | null>(null);
  // Or, if you want a default video pre-selected:
  // const [currentVideoPath, setCurrentVideoPath] = useState<string | null>("videos/default_intro.mp4");


  // 2. Function to update the video path, to be passed to ChatSidePanel
  const handleVideoSelect = (newPath: string | null) => {
    setCurrentVideoPath(newPath);
  };

  return (
    <div className="flex w-screen h-screen bg-background text-foreground">
      {/* 3. Pass the handler function to ChatSidePanel */}
      <ChatSidePanel onVideoSelect={handleVideoSelect} />
      <div className="flex-1 overflow-auto flex">
        {/* 4. Pass the currentVideoPath state to MediaPreviewInterface */}
        <MediaPreviewInterface videoPath={currentVideoPath} />
      </div>
    </div>
  );
}