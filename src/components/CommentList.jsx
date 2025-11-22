// src/components/CommentList.js - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { briefsAPI } from '../services/api';

const CommentList = ({ briefId }) => {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [briefId, currentPage]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError('');


      const response = await briefsAPI.getComments(briefId, currentPage, 10);


      setComments(response.data.comments);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching comments:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) return <div className="loading">Loading comments...</div>;

  return (
    <div className="comment-list">
      <h3>Discussion ({pagination.totalComments || 0})</h3>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchComments} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}

      {!error && comments.length === 0 && (
        <div className="empty-state">
          <p>No comments yet. Start the conversation!</p>
        </div>
      )}

      {!error && comments.length > 0 && (
        <>
          <div className="comments">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.user_name || `User ${comment.user_id}`}</strong>
                  <span className="user-role">{comment.user_role && `(${comment.user_role})`}</span>
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>
                <p className="comment-message">{comment.message}</p>
                {comment.attachment_url && (
                  <a href={comment.attachment_url} target="_blank" rel="noopener noreferrer">
                    View Attachment
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={!pagination.hasPrev}
                className="btn-secondary"
              >
                Previous
              </button>

              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNext}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;