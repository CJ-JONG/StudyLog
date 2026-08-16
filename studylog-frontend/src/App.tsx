import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RootRedirect from "./pages/RootRedirect";
import SignupPage from "./pages/SignupPage";
import StudyLogDetailPage from "./pages/StudyLogDetailPage";
import StudyLogEditPage from "./pages/StudyLogEditPage";
import StudyLogNewPage from "./pages/StudyLogNewPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />
              <Route
                path="/categories"
                element={<CategoriesPage />}
              />
              <Route
                path="/studylogs/new"
                element={<StudyLogNewPage />}
              />
              <Route
                path="/studylogs/:studyLogId"
                element={<StudyLogDetailPage />}
              />
              <Route
                path="/studylogs/:studyLogId/edit"
                element={<StudyLogEditPage />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
