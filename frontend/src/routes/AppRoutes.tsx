import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.js';
import Dashboard from '../pages/Dashboard.js';
import ProtectedRoute from '../components/ProtectedRoute.js';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;