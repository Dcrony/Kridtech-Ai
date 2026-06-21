import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';

import Layout from './components/Layout/Layout';

import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Dashboard from './pages/Dashboard/Dashboard';
import Agents from './pages/Agents/Agents';
import AgentBuilder from './pages/Agents/AgentBuilder';
import Calls from './pages/Calls/Calls';
import CallDetail from './pages/Calls/CallDetail';
import Leads from './pages/Leads/Leads';
import LeadDetail from './pages/Leads/LeadDetail';
import Appointments from './pages/Appointments/Appointments';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import Notifications from './pages/Notifications/Notifications';

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  return token ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/new" element={<AgentBuilder />} />
        <Route path="/agents/:id" element={<AgentBuilder />} />

        <Route path="/calls" element={<Calls />} />
        <Route path="/calls/:id" element={<CallDetail />} />

        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadDetail />} />

        <Route path="/appointments" element={<Appointments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;