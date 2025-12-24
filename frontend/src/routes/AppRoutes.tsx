import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
