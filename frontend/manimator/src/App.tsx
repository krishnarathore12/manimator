import './App.css';
import ChatPage from './ChatPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // Import routing components

import ChatSidePanel from './SideChatBar';
import MediaPreviewInterface from './VideoCanvas';
import ManimatorPage from './LandingPage';

// This component will group ChatSidePanel and MediaPreviewInterface for a specific route
function MainApplicationLayout() {
  return (
    <div className="flex w-screen h-screen bg-background text-foreground">
      <ChatSidePanel />
      <div className="flex-1 overflow-auto flex">
        <MediaPreviewInterface />
      </div>
    </div>
  );
}

// Default export for the App component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ManimatorPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}