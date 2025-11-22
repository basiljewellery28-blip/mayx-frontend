import React, { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api';
import '../App.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        const results = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(results);
    }, [searchTerm, clients]);

    const fetchClients = async () => {
        try {
            const response = await clientsAPI.getAll();
            setClients(response.data.clients);
            setFilteredClients(response.data.clients);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading clients...</div>;

    return (
        <div className="client-list-container">
            <div className="dashboard-header">
                <h2>Clients</h2>
                <button className="btn btn-primary">Add New Client</button>
            </div>

            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search clients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input search-input"
                />
            </div>

            <div className="client-table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Profile Number</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.length > 0 ? (
                            filteredClients.map(client => (
                                <tr key={client.id}>
                                    <td>
                                        <div className="client-name-cell">
                                            <div className="client-avatar-small">
                                                {client.name.charAt(0).toUpperCase()}
                                            </div>
                                            {client.name}
                                        </div>
                                    </td>
                                    <td>{client.email}</td>
                                    <td>{client.contact_number}</td>
                                    <td><span className="profile-badge">{client.profile_number}</span></td>
                                    <td>{new Date(client.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn-icon">Edit</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">No clients found matching "{searchTerm}"</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientList;
