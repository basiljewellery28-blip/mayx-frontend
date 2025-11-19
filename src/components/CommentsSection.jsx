import React from 'react';

const CommentsSection = ({ briefId }) => {
    return (
        <div className="comments-section">
            <h3>Comments</h3>
            <p>Comments for brief {briefId} will go here.</p>
        </div>
    );
};

export default CommentsSection;
