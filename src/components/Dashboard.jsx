// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateBrief = () => {
    navigate('/create-brief');
  };

  return (
    <div className="dashboard-page">
      {/* Hero Section - Full Screen */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <em>A LEGACY OF LOVE</em>
            <br />
            <em>AND CRAFTSMANSHIP</em>
          </h1>
          <p className="hero-subtitle">Timeless pieces handcrafted with passion.</p>
          <button className="hero-btn" onClick={handleCreateBrief}>
            CREATE NEW BRIEF
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;