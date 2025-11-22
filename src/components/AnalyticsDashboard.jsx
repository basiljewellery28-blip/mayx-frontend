import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import '../App.css';

const AnalyticsDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await analyticsAPI.getSummary();
                setSummary(response.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="analytics-loading">Loading analytics...</div>;
    if (error) return <div className="analytics-error">{error}</div>;
    if (!summary) return null;

    return (
        <div className="analytics-dashboard">
            <h2 className="analytics-title">Dashboard Overview</h2>

            <div className="analytics-cards">
                <div className="analytics-card total">
                    <h3>Total Briefs</h3>
                    <div className="analytics-value">{summary.totalBriefs}</div>
                </div>
                <div className="analytics-card active">
                    <h3>Active</h3>
                    <div className="analytics-value">{summary.activeBriefs}</div>
                </div>
                <div className="analytics-card completed">
                    <h3>Completed</h3>
                    <div className="analytics-value">{summary.completedBriefs}</div>
                </div>
            </div>

            {/* Placeholder for Chart - can be added later with Recharts */}
            {/* 
            <div className="analytics-chart-container">
                <h3>Brief Status Distribution</h3>
                 <ChartComponent data={distributionData} /> 
            </div> 
            */}
        </div>
    );
};

export default AnalyticsDashboard;
