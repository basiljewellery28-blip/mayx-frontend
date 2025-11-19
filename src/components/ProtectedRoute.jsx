import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  console.log('ProtectedRoute - Token exists:', !!token);
  
  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Token found, rendering children');
  return children;
};

export default ProtectedRoute;