import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './Pages/AppShell';
import BlockEditor from './Pages/BlockEditor';
import AuthPage from './Pages/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default entry → Auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Editor layout */}
        <Route element={<AppShell />}>
          <Route path="/page/:pageId" element={<BlockEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
