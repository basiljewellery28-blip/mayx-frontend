// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BriefWizard from './components/BriefWizard';
import BriefList from './components/BriefList';
import BriefDetail from './components/BriefDetail';
import CommentsSection from './components/CommentsSection';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
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
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;