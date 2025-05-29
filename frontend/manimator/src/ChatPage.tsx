import './App.css';
import ChatSidePanel from './SideChatBar'; 
import MediaPreviewInterface from './VideoCanvas';

// Default export for the App component
export default function ChatPage() {
  return (
    <div className="flex w-screen h-screen bg-background text-foreground">
      <ChatSidePanel />
      <div className="flex-1 overflow-auto flex"> 
        <MediaPreviewInterface />
      </div>
    </div>
  );
}
