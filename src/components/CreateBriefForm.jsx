// src/components/CreateBriefForm.js
import React, { useState, useEffect } from 'react';
import { briefsAPI } from '../services/api';

const CreateBriefForm = ({ onClose, onBriefCreated }) => {
  // Get logged-in consultant's ID
  const [consultantId, setConsultantId] = useState('');
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'consultant') {
      setConsultantId(user.id);
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '', // User will input this
    style_code_id: '' // Optional
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consultantId) {
      setError('Could not identify consultant. Please log in again.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    // Prepare data to send (including the consultant ID)
    const briefDataToSend = {
      ...formData,
      consultant_id: consultantId,
      // Convert empty strings to null for optional fields if needed by backend
      style_code_id: formData.style_code_id || null,
      client_id: parseInt(formData.client_id) // Ensure client_id is a number
    };

    try {
      console.log('Creating brief with data:', briefDataToSend);
      const response = await briefsAPI.create(briefDataToSend);
      console.log('Brief created successfully:', response.data.brief);
      onBriefCreated(response.data.brief); // Call parent callback
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create brief. Please try again.');
      console.error('Error creating brief:', err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  return (
    // Modal container
    <div className="modal-overlay" onClick={onClose}> {/* Close modal on overlay click */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
        <h2>Create New Brief</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          {/* Client ID */}
          <div className="form-group">
            <label htmlFor="client_id">Client ID *</label>
            <input
              type="number" // Use number input
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Enter client's user ID"
            />
          </div>

          {/* Style Code ID (Optional) */}
          <div className="form-group">
            <label htmlFor="style_code_id">Style Code ID (Optional)</label>
            <input
              type="number" // Use number input
              id="style_code_id"
              name="style_code_id"
              value={formData.style_code_id}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter base style code ID if applicable"
            />
          </div>

          {/* Hidden consultant ID for info */}
          <input type="hidden" name="consultant_id" value={consultantId} readOnly />

          {/* Form Actions (Buttons) */}
          <div className="form-actions">
            <button
              type="button" // Important: type="button" for cancel
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary" // Style as secondary
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !consultantId} // Disable if consultant ID not found
              className="btn-primary" // Style as primary
            >
              {isSubmitting ? 'Creating...' : 'Create Brief'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBriefForm;