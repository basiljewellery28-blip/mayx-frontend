import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import NotificationBell from './NotificationBell';
import '../App.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (token && user.id) {
            const socket = getSocket();
            socket.emit('join_user', user.id);
        }
    }, [token, user.id]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/">MAYX</Link>
                </div>
                <div className="navbar-menu">
                    {token ? (
                        <>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/clients" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Clients
                            </NavLink>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Profile
                            </NavLink>
                            <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Admin
                            </NavLink>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">Login</Link>
                    )}
                </div>
                <div className="navbar-actions">
                    {token && (
                        <>
                            <NotificationBell />
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
