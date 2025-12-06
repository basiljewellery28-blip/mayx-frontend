// src/components/OverviewPage.jsx
import React from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import './OverviewPage.css';

const OverviewPage = () => {
    return (
        <div className="overview-page">
            <div className="overview-header">
                <h1 className="overview-title">Dashboard Overview</h1>
                <p className="overview-subtitle">Your business analytics at a glance</p>
            </div>
            <div className="overview-content">
                <AnalyticsDashboard />
            </div>
        </div>
    );
};

export default OverviewPage;
