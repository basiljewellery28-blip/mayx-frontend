import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { briefsAPI } from '../services/api';
import './BriefList.css';
import '../App.css';

const BriefList = () => {
    const [briefs, setBriefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: ''
    });

    const fetchBriefs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await briefsAPI.getAll(filters);
            setBriefs(response.data.briefs);
            setError(null);
        } catch (err) {
            setError('Failed to fetch briefs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Debounce search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBriefs();
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchBriefs]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="brief-list-container">
            <div className="dashboard-header">
                <h2>Briefs</h2>
                <Link to="/create-brief" className="btn btn-primary">Create New Brief</Link>
            </div>

            <div className="filters-container">
                <input
                    type="text"
                    name="search"
                    placeholder="Search briefs..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="form-input search-input"
                />
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="form-select status-filter"
                >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading briefs...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : briefs.length === 0 ? (
                <div className="no-briefs">
                    <p>No briefs found matching your criteria.</p>
                    {filters.search || filters.status ? (
                        <button
                            className="btn btn-outline"
                            onClick={() => setFilters({ search: '', status: '' })}
                        >
                            Clear Filters
                        </button>
                    ) : (
                        <Link to="/create-brief">Create your first brief</Link>
                    )}
                </div>
            ) : (
                <div className="brief-grid">
                    {briefs.map(brief => (
                        <Link to={`/briefs/${brief.id}`} key={brief.id} className="brief-card-link">
                            <div className="brief-card">
                                <div className="brief-header">
                                    <h3>{brief.title}</h3>
                                    <span className={`status-badge ${brief.status}`}>{brief.status.replace('_', ' ')}</span>
                                </div>
                                <p className="brief-description">{brief.description}</p>
                                <div className="brief-footer">
                                    <span className="brief-number">{brief.brief_number}</span>
                                    <span className="brief-date">{new Date(brief.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BriefList;
