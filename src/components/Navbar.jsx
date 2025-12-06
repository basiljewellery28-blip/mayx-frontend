import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const menuRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        if (token && user.id) {
            const socket = getSocket();
            socket.emit('join_user', user.id);
        }
    }, [token, user.id]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setProfileOpen(false);
        navigate('/login');
    };

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
        setProfileOpen(false);
    };

    const handleProfileClick = () => {
        setProfileOpen(!profileOpen);
        setMenuOpen(false);
    };

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar-wrapper">
            {/* Top Row: Main Navigation */}
            <div className="navbar-main">
                <div className="navbar-container">
                    {/* Left: Hamburger Menu */}
                    <div className="navbar-menu" ref={menuRef}>
                        {token && (
                            <>
                                <button
                                    className="menu-toggle"
                                    onClick={handleMenuClick}
                                    aria-label="Toggle menu"
                                >
                                    <span className="menu-icon">☰</span>
                                    <span className="menu-text">MENU</span>
                                </button>

                                {menuOpen && (
                                    <div className="dropdown-menu">
                                        <NavLink
                                            to="/dashboard"
                                            className="dropdown-item"
                                            onClick={handleNavClick}
                                        >
                                            Home
                                        </NavLink>
                                        <NavLink
                                            to="/overview"
                                            className="dropdown-item"
                                            onClick={handleNavClick}
                                        >
                                            Dashboard Overview
                                        </NavLink>
                                        <NavLink
                                            to="/briefs"
                                            className="dropdown-item"
                                            onClick={handleNavClick}
                                        >
                                            Briefs
                                        </NavLink>
                                        <NavLink
                                            to="/clients"
                                            className="dropdown-item"
                                            onClick={handleNavClick}
                                        >
                                            Clients
                                        </NavLink>
                                        <NavLink
                                            to="/messages"
                                            className="dropdown-item"
                                            onClick={handleNavClick}
                                        >
                                            Messages
                                        </NavLink>
                                        <NavLink
                                            to="/admin"
                                            className="dropdown-item"
                                            onClick={handleNavClick}
                                        >
                                            Admin
                                        </NavLink>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Center: Logo */}
                    <div className="navbar-brand">
                        <Link to="/dashboard" className="brand-link">
                            <img
                                src="https://brownsjewellers.com/cdn/shop/files/Group.svg?v=1760614234&width=200"
                                alt="Browns Jewellers"
                                className="brand-logo"
                            />
                            <span className="brand-name">BROWNS</span>
                        </Link>
                    </div>

                    {/* Right: Profile Icon */}
                    <div className="navbar-actions" ref={profileRef}>
                        {token && (
                            <>
                                <NotificationBell />
                                <button
                                    className="profile-toggle"
                                    onClick={handleProfileClick}
                                    aria-label="Profile menu"
                                >
                                    <svg
                                        className="profile-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </button>

                                {profileOpen && (
                                    <div className="dropdown-menu dropdown-right">
                                        <NavLink
                                            to="/profile"
                                            className="dropdown-item"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            My Profile
                                        </NavLink>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item dropdown-logout"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        {!token && (
                            <Link to="/login" className="nav-link">Login</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Tagline */}
            <div className="navbar-tagline-bar">
                <span className="brand-tagline">Only Natural Diamonds</span>
            </div>
        </nav>
    );
};

export default Navbar;
