import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './Pages/AppShell';
import BlockEditor from './Pages/BlockEditor';
import HomePage from './Pages/HomePage';
import SchedulePage from './Pages/SchedulePage';
import AIChatPage from './Pages/AiChatPage';
import AuthPage from './Pages/AuthPage';
import ProtectedRoute from './Pages/ProtectedRoute';
import AuthRoute from './Pages/AuthRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default - redirect to home for logged in users */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* AUTH PAGE (logged-in users blocked) */}
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <AuthPage />
            </AuthRoute>
          }
        />

        {/* PROTECTED ROUTES (logged-out users blocked) */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          {/* Home Page - Document Grid */}
          <Route path="/home" element={<HomePage />} />

          {/* Schedule Page - Calendar */}
          <Route path="/schedule" element={<SchedulePage />} />

          {/* AI Chat Page - Study Assistant */}
          <Route path="/ai-chat" element={<AIChatPage />} />

          {/* Editor Page */}
          <Route path="/page/:pageId" element={<BlockEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
