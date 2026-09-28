import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ProjectsPage from "./pages/ProjectsPage";
import AssetsPage from "./pages/AssetsPage";
import ProjectAssignmentsPage from "./pages/ProjectAssignmentsPage";
import AssetAssignmentsPage from "./pages/AssetAssignmentsPage";
import AttendancePage from "./pages/AttendancePage";
import LeavePage from "./pages/LeavePage";
import NotificationsPage from "./pages/NotificationsPage";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route
                    path="/"
                    element={<DashboardPage />}
                  />

                  <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                  />

                  <Route
                    path="/employees"
                    element={<EmployeesPage />}
                  />

                  <Route
                    path="/departments"
                    element={<DepartmentsPage />}
                  />

                  <Route
                    path="/projects"
                    element={<ProjectsPage />}
                  />

                  <Route
                    path="/assets"
                    element={<AssetsPage />}
                  />

                  <Route
                    path="/project-assignments"
                    element={
                      <ProtectedRoute permission="employees.view_projectassignment">
                        <ProjectAssignmentsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/asset-assignments"
                    element={
                      <ProtectedRoute permission="employees.view_assetassignment">
                        <AssetAssignmentsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/attendance"
                    element={<AttendancePage />}
                  />

                  <Route
                    path="/leave"
                    element={<LeavePage />}
                  />

                  <Route
                    path="/notifications"
                    element={
                      <NotificationsPage />
                    }
                  />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;