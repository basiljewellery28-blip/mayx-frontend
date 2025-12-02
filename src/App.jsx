import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BriefWizard from './components/BriefWizard';
import BriefList from './components/BriefList';
import BriefDetail from './components/BriefDetail';
import CommentsSection from './components/CommentsSection';
import UserProfile from './components/UserProfile';
import ClientList from './components/ClientList';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import './App.css';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      <div style={{ minHeight: 'calc(100vh - 80px - 300px)' }}> {/* Push footer down */}
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

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;