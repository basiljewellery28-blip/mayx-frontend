import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socket';
import api from '../services/api';
import './ConsultantChat.css';

const ConsultantChat = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [lookupNumber, setLookupNumber] = useState('');
    const [lookupResult, setLookupResult] = useState(null);
    const messagesEndRef = useRef(null);
    const socket = getSocket();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch clients on mount
    useEffect(() => {
        fetchClients();
    }, []);

    // Join conversation room when client selected
    useEffect(() => {
        if (selectedClient?.conversation_id) {
            socket.emit('join_conversation', selectedClient.conversation_id);
            fetchMessages(selectedClient.conversation_id);
        }
        return () => {
            if (selectedClient?.conversation_id) {
                socket.emit('leave_conversation', selectedClient.conversation_id);
            }
        };
    }, [selectedClient]);

    // Listen for new messages
    useEffect(() => {
        socket.on('new_message', (message) => {
            if (message.conversation_id === selectedClient?.conversation_id) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
            // Refresh client list to update last message
            fetchClients();
        });
        return () => socket.off('new_message');
    }, [selectedClient]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchClients = async () => {
        try {
            const response = await api.get('/messages/clients');
            setClients(response.data.clients);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await api.get(`/messages/conversations/${conversationId}`);
            setMessages(response.data.messages);
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedClient?.conversation_id) return;

        try {
            await api.post(`/messages/conversations/${selectedClient.conversation_id}`, {
                content: newMessage
            });

            // Optimistic update
            const optimisticMessage = {
                id: Date.now(),
                sender_id: user.id,
                sender_name: user.name,
                content: newMessage,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMessage]);
            setNewMessage('');
            scrollToBottom();

            // Emit via socket
            socket.emit('send_message', {
                conversation_id: selectedClient.conversation_id,
                sender_id: user.id,
                content: newMessage
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleLookupClient = async () => {
        if (!lookupNumber.trim()) return;
        try {
            const response = await api.post('/messages/lookup-client', {
                profile_number: lookupNumber
            });
            setLookupResult(response.data);
        } catch (error) {
            setLookupResult({ error: error.response?.data?.message || 'Client not found' });
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString();
    };

    return (
        <div className="consultant-chat">
            {/* Sidebar - Client List */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                </div>

                {/* Client Lookup */}
                <div className="client-lookup">
                    <input
                        type="text"
                        placeholder="Client Profile # (e.g. AA092275)"
                        value={lookupNumber}
                        onChange={(e) => setLookupNumber(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleLookupClient()}
                    />
                    <button onClick={handleLookupClient}>Search</button>
                </div>

                {lookupResult && (
                    <div className={`lookup-result ${lookupResult.error ? 'error' : 'success'}`}>
                        {lookupResult.error ? (
                            <span>{lookupResult.error}</span>
                        ) : (
                            <div className="lookup-client-info">
                                <strong>{lookupResult.client.name}</strong>
                                <span>{lookupResult.client.profile_number}</span>
                                <span>{lookupResult.briefs?.length || 0} briefs</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Client List */}
                <div className="client-list">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : clients.length === 0 ? (
                        <div className="no-clients">No conversations yet</div>
                    ) : (
                        clients.map(client => (
                            <div
                                key={client.id}
                                className={`client-item ${selectedClient?.id === client.id ? 'active' : ''}`}
                                onClick={() => setSelectedClient(client)}
                            >
                                <div className="client-avatar">
                                    {client.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="client-info">
                                    <div className="client-name">
                                        {client.name}
                                        {client.unread_count > 0 && (
                                            <span className="unread-badge">{client.unread_count}</span>
                                        )}
                                    </div>
                                    <div className="client-last-message">
                                        {client.last_message || 'No messages yet'}
                                    </div>
                                </div>
                                <div className="client-time">
                                    {formatDate(client.last_message_at)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {selectedClient ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="header-avatar">
                                    {selectedClient.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="header-text">
                                    <h3>{selectedClient.name}</h3>
                                    <span>{selectedClient.profile_number || selectedClient.email}</span>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <button className="action-btn" title="View Briefs">📋</button>
                                <button className="action-btn" title="Client Profile">👤</button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div
                                    key={msg.id || index}
                                    className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">{msg.content}</div>
                                    <div className="message-time">{formatTime(msg.created_at)}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" disabled={!newMessage.trim()}>
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="empty-state">
                            <span className="empty-icon">💬</span>
                            <h3>Select a conversation</h3>
                            <p>Choose a client from the list to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultantChat;
