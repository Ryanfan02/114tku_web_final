import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import AppPage from "./pages/AppPage.jsx";

export default function App() {
  return (
     <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
