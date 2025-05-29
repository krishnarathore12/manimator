import './App.css';
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
    <BrowserRouter>
      {/* You might want to add a simple navigation to switch between pages for testing */}
      {/* <nav style={{ padding: '10px', background: '#eee', marginBottom: '10px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Landing Page</Link>
        <Link to="/app">Main Application</Link>
      </nav> */}

      <Routes>
        {/* Route for the Landing Page (ManimatorPage) */}
        {/* This will be active when the path is exactly "/" */}
        <Route path="/" element={<ManimatorPage />} />

        {/* Route for the main application view (ChatSidePanel + MediaPreviewInterface) */}
        {/* This will be active when the path is "/app" */}
        <Route path="/app" element={<MainApplicationLayout />} />

        {/* You can add a "Not Found" route as well */}
        {/* <Route path="*" element={<div>404 - Page Not Found</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}