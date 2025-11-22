// src/components/Dashboard.js
import React from 'react';
import BriefList from './BriefList';
import AnalyticsDashboard from './AnalyticsDashboard';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <AnalyticsDashboard />
      <BriefList />
    </div>
  );
};

export default Dashboard;