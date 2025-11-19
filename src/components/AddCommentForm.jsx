import React, { useState } from 'react';
import { briefsAPI } from '../services/api';

const AddCommentForm = ({ briefId, onCommentAdded }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await briefsAPI.addComment(briefId, {
        message: message.trim()
      });
      
      setMessage('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-comment-form">
      <h3>Add Comment</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="4"
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || !message.trim()}
          className="btn-primary"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default AddCommentForm;