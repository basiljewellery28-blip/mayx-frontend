import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">MAYX</div>
            <div className="navbar-menu">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/briefs">Briefs</Link>
                <button onClick={handleLogout}>Logout ({user.name || 'User'})</button>
            </div>
        </nav>
    );
};

export default Navbar;
