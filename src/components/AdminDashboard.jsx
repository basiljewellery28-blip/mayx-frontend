import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { briefsAPI } from '../services/api';

// Constants for Image Management
const CATEGORIES = ['Ring', 'Earring', 'Necklace and Pendant', 'Bracelet'];
const RING_TYPES = ['Engagement Rings', 'Dress Rings', 'Mens Wedding Bands', 'Womens Wedding Bands and Eternity Rings', 'Diamond Band'];
const EARRING_TYPES = ['Studs', 'Drops', 'Hoops'];
const NECKLACE_TYPES = ['Pendants', 'Chokers', 'Chains'];
const BRACELET_TYPES = ['Bangles', 'Tennis Bracelets', 'Original Angel', 'B Bold', 'Timeless Classics'];

const RING_DESIGNS = {
    'Engagement Rings': ['Solitaire', 'Halo', 'Trilogy', 'Vintage', 'Side Stones'],
    'Dress Rings': ['Cocktail', 'Statement', 'Stackable'],
    'Mens Wedding Bands': ['Classic', 'Modern', 'Patterned'],
    'Womens Wedding Bands and Eternity Rings': ['Classic', 'Diamond', 'Curved'],
    'Diamond Band': ['Classic', 'Eternity', 'Half Eternity']
};

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
    // Safe JSON parse helper
    const safeParse = (jsonString) => {
        try {
            return JSON.parse(jsonString) || {};
        } catch (e) {
            console.error('Error parsing custom images:', e);
            return {};
        }
    };

    const [customImages, setCustomImages] = useState(safeParse(localStorage.getItem('adminCustomImages')));

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

        const handleStorageChange = () => {
            setCustomImages(safeParse(localStorage.getItem('adminCustomImages')));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleImageUpload = (e, type, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newCustomImages = {
                    ...customImages,
                    [`${type}_${key}`]: e.target.result
                };
                setCustomImages(newCustomImages);
                localStorage.setItem('adminCustomImages', JSON.stringify(newCustomImages));
            };
            reader.readAsDataURL(file);
        }
    };

    const resetImage = (type, key) => {
        const newCustomImages = { ...customImages };
        delete newCustomImages[`${type}_${key}`];
        setCustomImages(newCustomImages);
        localStorage.setItem('adminCustomImages', JSON.stringify(newCustomImages));
    };

    const getImage = (type, key) => {
        const customKey = `${type}_${key}`;
        return customImages[customKey] || null; // Return null if no custom image to show placeholder or default
    };

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
                    <button className={`nav-item ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>
                        <i className="fas fa-images"></i> Image Management
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

                {activeTab === 'images' && (
                    <div className="admin-section">
                        <h2>Image Management</h2>
                        <p className="section-desc">Upload custom images for the Brief Wizard categories and options.</p>

                        <div className="image-group">
                            <h3>Categories</h3>
                            <div className="admin-grid">
                                {CATEGORIES.map(cat => (
                                    <div key={cat} className="admin-image-card">
                                        <div className="image-preview-box">
                                            {getImage('categories', cat) ? (
                                                <img src={getImage('categories', cat)} alt={cat} />
                                            ) : (
                                                <div className="placeholder">Default</div>
                                            )}
                                        </div>
                                        <div className="card-info">
                                            <h4>{cat}</h4>
                                            <div className="actions">
                                                <label className="btn btn-small btn-secondary">
                                                    Upload
                                                    <input type="file" hidden onChange={(e) => handleImageUpload(e, 'categories', cat)} />
                                                </label>
                                                {getImage('categories', cat) && (
                                                    <button className="btn btn-small btn-danger" onClick={() => resetImage('categories', cat)}>Reset</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Ring Types */}
                        <div className="image-group">
                            <h3>Ring Types</h3>
                            <div className="admin-grid">
                                {RING_TYPES.map(type => (
                                    <div key={type} className="admin-image-card">
                                        <div className="image-preview-box">
                                            {getImage('ringTypes', type) ? (
                                                <img src={getImage('ringTypes', type)} alt={type} />
                                            ) : (
                                                <div className="placeholder">Default</div>
                                            )}
                                        </div>
                                        <div className="card-info">
                                            <h4>{type}</h4>
                                            <div className="actions">
                                                <label className="btn btn-small btn-secondary">
                                                    Upload
                                                    <input type="file" hidden onChange={(e) => handleImageUpload(e, 'ringTypes', type)} />
                                                </label>
                                                {getImage('ringTypes', type) && (
                                                    <button className="btn btn-small btn-danger" onClick={() => resetImage('ringTypes', type)}>Reset</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ring Designs */}
                        {Object.entries(RING_DESIGNS).map(([category, designs]) => (
                            <div key={category} className="image-group">
                                <h3>{category} Designs</h3>
                                <div className="admin-grid">
                                    {designs.map(design => (
                                        <div key={design} className="admin-image-card">
                                            <div className="image-preview-box">
                                                {getImage('ringDesigns', design) ? (
                                                    <img src={getImage('ringDesigns', design)} alt={design} />
                                                ) : (
                                                    <div className="placeholder">Default</div>
                                                )}
                                            </div>
                                            <div className="card-info">
                                                <h4>{design}</h4>
                                                <div className="actions">
                                                    <label className="btn btn-small btn-secondary">
                                                        Upload
                                                        <input type="file" hidden onChange={(e) => handleImageUpload(e, 'ringDesigns', design)} />
                                                    </label>
                                                    {getImage('ringDesigns', design) && (
                                                        <button className="btn btn-small btn-danger" onClick={() => resetImage('ringDesigns', design)}>Reset</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Earring Types */}
                        <div className="image-group">
                            <h3>Earring Types</h3>
                            <div className="admin-grid">
                                {EARRING_TYPES.map(type => (
                                    <div key={type} className="admin-image-card">
                                        <div className="image-preview-box">
                                            {getImage('earringTypes', type) ? (
                                                <img src={getImage('earringTypes', type)} alt={type} />
                                            ) : (
                                                <div className="placeholder">Default</div>
                                            )}
                                        </div>
                                        <div className="card-info">
                                            <h4>{type}</h4>
                                            <div className="actions">
                                                <label className="btn btn-small btn-secondary">
                                                    Upload
                                                    <input type="file" hidden onChange={(e) => handleImageUpload(e, 'earringTypes', type)} />
                                                </label>
                                                {getImage('earringTypes', type) && (
                                                    <button className="btn btn-small btn-danger" onClick={() => resetImage('earringTypes', type)}>Reset</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Necklace Types */}
                        <div className="image-group">
                            <h3>Necklace Types</h3>
                            <div className="admin-grid">
                                {NECKLACE_TYPES.map(type => (
                                    <div key={type} className="admin-image-card">
                                        <div className="image-preview-box">
                                            {getImage('necklaceTypes', type) ? (
                                                <img src={getImage('necklaceTypes', type)} alt={type} />
                                            ) : (
                                                <div className="placeholder">Default</div>
                                            )}
                                        </div>
                                        <div className="card-info">
                                            <h4>{type}</h4>
                                            <div className="actions">
                                                <label className="btn btn-small btn-secondary">
                                                    Upload
                                                    <input type="file" hidden onChange={(e) => handleImageUpload(e, 'necklaceTypes', type)} />
                                                </label>
                                                {getImage('necklaceTypes', type) && (
                                                    <button className="btn btn-small btn-danger" onClick={() => resetImage('necklaceTypes', type)}>Reset</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bracelet Types */}
                        <div className="image-group">
                            <h3>Bracelet Types</h3>
                            <div className="admin-grid">
                                {BRACELET_TYPES.map(type => (
                                    <div key={type} className="admin-image-card">
                                        <div className="image-preview-box">
                                            {getImage('braceletTypes', type) ? (
                                                <img src={getImage('braceletTypes', type)} alt={type} />
                                            ) : (
                                                <div className="placeholder">Default</div>
                                            )}
                                        </div>
                                        <div className="card-info">
                                            <h4>{type}</h4>
                                            <div className="actions">
                                                <label className="btn btn-small btn-secondary">
                                                    Upload
                                                    <input type="file" hidden onChange={(e) => handleImageUpload(e, 'braceletTypes', type)} />
                                                </label>
                                                {getImage('braceletTypes', type) && (
                                                    <button className="btn btn-small btn-danger" onClick={() => resetImage('braceletTypes', type)}>Reset</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
