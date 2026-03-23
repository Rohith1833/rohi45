import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from './layouts/AppLayout';
import ChatWindow from './components/ChatWindow';
import Dashboard from './components/Dashboard';
import Tickets from './components/Tickets';

// Placeholder pages for production SaaS feel
// Placeholder pages for production SaaS feel
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" expand={false} richColors />
      <Routes>
        {/* Customer View is standalone / full screen */}
        <Route path="/chat" element={<ChatWindow />} />
        
        {/* Admin Dashboard is wrapped in Sidebar Layout */}
        <Route path="/" element={<AppLayout />}>
           <Route index element={<Navigate to="/dashboard" replace />} />
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="admin-tickets" element={<Tickets />} />
        </Route>

        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
