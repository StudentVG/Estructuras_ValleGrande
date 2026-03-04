import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import PlatformLayout from "./pages/platform/PlatformLayout";
import Semester1 from "./pages/platform/Semester1";
import Semester2 from "./pages/platform/Semester2";
import Semester3 from "./pages/platform/Semester3";
import Semester4 from "./pages/platform/Semester4";
import Semester5 from "./pages/platform/Semester5";
import SemesterComingSoon from "./pages/platform/SemesterComingSoon";
import Documentation from "./pages/platform/Documentation";
import { useAuth } from "./context/useAuth";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/plataforma/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/plataforma/login" element={<Login />} />
      <Route
        path="/plataforma"
        element={
          <ProtectedRoute>
            <PlatformLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/plataforma/semestre/1" replace />} />
        <Route path="semestre/1" element={<Semester1 />} />
        <Route path="semestre/2" element={<Semester2 />} />
        <Route path="semestre/3" element={<Semester3 />} />
        <Route path="semestre/4" element={<Semester4 />} />
        <Route path="semestre/5" element={<Semester5 />} />
        <Route path="semestre/:id" element={<SemesterComingSoon />} />
        <Route path="documentacion" element={<Documentation />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
