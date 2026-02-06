import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './Pages/AppShell';
import BlockEditor from './Pages/BlockEditor';
import AuthPage from './Pages/AuthPage';
import ProtectedRoute from './Pages/ProtectedRoute';
import AuthRoute from './Pages/AuthRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* AUTH PAGE (logged-in users blocked) */}
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <AuthPage />
            </AuthRoute>
          }
        />

        {/* EDITOR (logged-out users blocked) */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/page/:pageId" element={<BlockEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
