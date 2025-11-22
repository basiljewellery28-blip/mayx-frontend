import React, { useState, useEffect } from 'react';
import { briefsAPI } from '../services/api';
import { getSocket } from '../services/socket';

const CommentsSection = ({ briefId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await briefsAPI.getComments(briefId);
            setComments(response.data.comments);
            setError(null);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Failed to load comments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();

        const socket = getSocket();

        const handleNewComment = (comment) => {

            setComments(prevComments => [comment, ...prevComments]);
        };

        socket.on('new_comment', handleNewComment);

        return () => {
            socket.off('new_comment', handleNewComment);
        };
    }, [briefId]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() && !selectedFile) return;

        setSubmitting(true);
        try {
            let data;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('message', newComment);
                formData.append('attachment', selectedFile);
                data = formData;
            } else {
                data = { message: newComment };
            }

            const response = await briefsAPI.addComment(briefId, data);
            setNewComment('');
            setSelectedFile(null);
            // Reset file input
            document.getElementById('file-input').value = '';

            setComments(prev => [response.data.comment, ...prev]);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment: ' + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading comments...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-author">{comment.user_name || 'User'}</span>
                                <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p className="comment-message">{comment.message}</p>
                            {comment.attachment_url && (
                                <div className="comment-attachment">
                                    {comment.attachment_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                        <img
                                            src={`http://localhost:5000${comment.attachment_url}`}
                                            alt="Attachment"
                                            style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <a
                                            href={`http://localhost:5000${comment.attachment_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: 'block', marginTop: '10px', color: '#007bff' }}
                                        >
                                            View Attachment
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    required={!selectedFile}
                />
                <div className="file-input-wrapper" style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <input
                        type="file"
                        id="file-input"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};

export default CommentsSection;
