// src/components/Dashboard.js
import React from 'react';
import BriefList from './BriefList';
import AnalyticsDashboard from './AnalyticsDashboard';

import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <AnalyticsDashboard />
        <BriefList />
      </div>
    </div>
  );
};

export default Dashboard;