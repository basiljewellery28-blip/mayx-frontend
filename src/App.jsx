import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import OverviewPage from './components/OverviewPage';
import BriefWizard from './components/BriefWizard';
import BriefList from './components/BriefList';
import BriefDetail from './components/BriefDetail';
import CommentsSection from './components/CommentsSection';
import UserProfile from './components/UserProfile';
import ClientList from './components/ClientList';
import AdminDashboard from './components/AdminDashboard';
import ConsultantChat from './components/ConsultantChat';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import './App.css';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      <div className={isDashboardPage ? '' : 'content-wrapper'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-brief"
            element={
              <ProtectedRoute>
                <BriefWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/briefs"
            element={
              <ProtectedRoute>
                <BriefList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/briefs/:id"
            element={
              <ProtectedRoute>
                <BriefDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comments/:briefId"
            element={
              <ProtectedRoute>
                <CommentsSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <ClientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <ConsultantChat />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      {!isLoginPage && !isDashboardPage && <Footer />}
    </div>
  );
}

export default App;