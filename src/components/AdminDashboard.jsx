import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { briefsAPI } from '../services/api';



const ADMIN_CONFIG = {
    password: 'admin123',
};

const RenderQueueSection = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            // In a real app, we'd have a specific endpoint or filter for this
            // For now, fetch all and filter client-side
            const res = await briefsAPI.getAll();
            const pending = res.data.briefs.filter(b => b.render_status === 'render_requested');
            setRequests(pending);
        } catch (err) {
            console.error("Error fetching render requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleUpload = async (briefId, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await briefsAPI.uploadRender(briefId, formData);
            alert('Render uploaded successfully!');
            fetchRequests(); // Refresh list
        } catch (err) {
            alert('Failed to upload render');
            console.error(err);
        }
    };

    if (loading) return <div>Loading queue...</div>;

    return (
        <div className="admin-section">
            <h2>Render Queue</h2>
            <p className="section-desc">Manage pending render requests from consultants.</p>

            {requests.length === 0 ? (
                <div className="empty-state">No pending render requests.</div>
            ) : (
                <div className="requests-list">
                    {requests.map(req => (
                        <div key={req.id} className="request-card">
                            <div className="req-info">
                                <h4>{req.title}</h4>
                                <span className="req-id">{req.brief_number}</span>
                                <span className="req-date">Requested: {new Date(req.updated_at).toLocaleDateString()}</span>
                            </div>
                            <div className="req-actions">
                                <label className="btn btn-primary">
                                    Upload Render
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleUpload(req.id, e.target.files[0])}
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    // Stats (Mock data for now)
    const stats = {
        totalBriefs: 12,
        completedBriefs: 5,
        pendingBriefs: 7,
        totalUsers: 3
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_CONFIG.password) {
            setIsAdminLoggedIn(true);
            localStorage.setItem('adminSession', 'true');
        } else {
            alert('Invalid Password');
        }
    };

    const handleLogout = () => {
        setIsAdminLoggedIn(false);
        localStorage.removeItem('adminSession');
        setPasswordInput('');
    };

    useEffect(() => {
        const session = localStorage.getItem('adminSession');
        if (session === 'true') {
            setIsAdminLoggedIn(true);
        }
    }, []);
    if (!isAdminLoggedIn) {
        return (
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <h2>Admin Access</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter Admin Password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary full-width">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <i className="fas fa-chart-line"></i> Overview
                    </button>

                    <button className={`nav-item ${activeTab === 'renderQueue' ? 'active' : ''}`} onClick={() => setActiveTab('renderQueue')}>
                        <i className="fas fa-paint-brush"></i> Render Queue
                    </button>
                    <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <i className="fas fa-users"></i> Users
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="btn btn-outline full-width" onClick={handleLogout}>Logout</button>
                </div>
            </aside>

            <main className="admin-content">
                {activeTab === 'overview' && (
                    <div className="admin-section">
                        <h2>Dashboard Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Briefs</h3>
                                <p className="stat-value">{stats.totalBriefs}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Completed</h3>
                                <p className="stat-value">{stats.completedBriefs}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Pending</h3>
                                <p className="stat-value">{stats.pendingBriefs}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Users</h3>
                                <p className="stat-value">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'renderQueue' && (
                    <RenderQueueSection />
                )}

                {activeTab === 'users' && (
                    <div className="admin-section">
                        <h2>User Management</h2>
                        <p>User management functionality coming soon.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
