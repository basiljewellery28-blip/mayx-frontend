import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import '../App.css';

const UserProfile = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await usersAPI.getProfile();
            setUser({ ...response.data.user, password: '' });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const response = await usersAPI.updateProfile(user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setUser({ ...response.data.user, password: '' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h2>{user.name}</h2>
                    <p className="profile-email">{user.email}</p>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password <span className="optional-text">(leave blank to keep current)</span></label>
                        <input
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-block">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
