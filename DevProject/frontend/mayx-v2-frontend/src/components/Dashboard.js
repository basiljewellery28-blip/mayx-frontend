// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { briefsAPI } from '../services/api';

const Dashboard = () => {
  const [briefs, setBriefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch briefs when the component mounts
  useEffect(() => {
    fetchBriefs();
  }, []);

  // Function to fetch briefs from the backend
  const fetchBriefs = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Fetching all briefs...');
      const response = await briefsAPI.getAll();
      setBriefs(response.data.briefs);
      console.log('Briefs loaded:', response.data.briefs.length);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setError('Failed to load briefs. Please ensure the backend is running and you are logged in.');
        console.error("Error fetching briefs:", err.response?.data || err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render status badges with appropriate colors
  const getStatusBadge = (status) => {
    const statusColors = {
      draft: '#6B7280',
      in_review: '#3B82F6',
      client_changes: '#F59E0B',
      pending_signoff: '#8B5CF6',
      signed_off: '#10B981',
      cancelled: '#EF4444'
    };
    const displayStatus = status ? status.replace('_', ' ') : 'Unknown';

    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: statusColors[status] || '#6B7280',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}
      >
        {displayStatus}
      </span>
    );
  };

  // Show loading state
  if (isLoading) return <div className="loading" style={{ padding: '20px' }}>Loading briefs...</div>;

  // Show error prominently if loading failed initially
  if (error && briefs.length === 0) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      <header className="dashboard-header" style={{ marginBottom: '20px' }}>
        <h1>My Briefs</h1>
        <button
          className="btn-primary"
          onClick={() => navigate('/create-brief')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Brief
        </button>
      </header>

      {error && briefs.length > 0 && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          {error}
        </div>
      )}

      <div className="briefs-grid" style={{ display: 'grid', gap: '20px' }}>
        {briefs.map(brief => (
          <div key={brief.id} className="brief-card" style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            borderRadius: '8px' 
          }}>
            <div className="brief-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{brief.title}</h3>
              {getStatusBadge(brief.status)}
            </div>
            <p className="brief-number" style={{ margin: '5px 0', color: '#666' }}>Brief #{brief.id}</p>
            <p className="brief-description" style={{ margin: '10px 0' }}>
              {brief.description?.substring(0, 100)}
              {brief.description?.length > 100 ? '...' : ''}
            </p>
            <div className="brief-meta" style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
              <span>Created: {new Date(brief.created_at).toLocaleDateString()}</span>
            </div>
            <Link 
              to={`/briefs/${brief.id}`} 
              className="btn-secondary"
              style={{ 
                display: 'inline-block', 
                padding: '8px 16px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {!isLoading && briefs.length === 0 && !error && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No briefs yet</h3>
          <p>Click "Create New Brief" to get started with your first design project.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;