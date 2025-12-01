import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentsSection from './CommentsSection';
import VersionHistory from './VersionHistory';
import { briefsAPI } from '../services/api';
import { getSocket, joinBriefRoom, leaveBriefRoom } from '../services/socket';

const BriefDetail = () => {
  const { id } = useParams();
  const [brief, setBrief] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const fetchBriefData = async () => {
    try {
      const [briefRes, versionsRes] = await Promise.all([
        briefsAPI.getById(id),
        briefsAPI.getVersions(id)
      ]);

      setBrief(briefRes.data.brief);
      setVersions(versionsRes.data.versions);
    } catch (err) {
      console.error("Error fetching brief data:", err);
      if (loading) setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefData();

    // Join the real-time room for this brief
    joinBriefRoom(id);
    const socket = getSocket();

    socket.on('brief_status_updated', (updatedBrief) => {
      setBrief(prevBrief => ({ ...prevBrief, status: updatedBrief.status }));
    });

    socket.on('brief_render_status_updated', (updatedBrief) => {
      setBrief(prevBrief => ({ ...prevBrief, render_status: updatedBrief.render_status, render_files: updatedBrief.render_files }));
    });

    return () => {
      leaveBriefRoom(id);
      socket.off('brief_status_updated');
      socket.off('brief_render_status_updated');
    };
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await briefsAPI.updateStatus(id, newStatus);
      setBrief(response.data.brief);
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRequestRender = async () => {
    try {
      await briefsAPI.requestRender(id);
      setBrief(prevBrief => ({ ...prevBrief, render_status: 'render_requested' }));
      alert('Render request sent successfully!');
    } catch (err) {
      alert('Error requesting render: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Loading brief details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!brief) return <div>Brief not found</div>;

  return (
    <div className="brief-detail-container">
      <div className="brief-header">
        <div className="brief-title-section">
          <h1>{brief.title}</h1>
          <span className="brief-number">{brief.brief_number}</span>
        </div>
        <div className="brief-actions">
          <select
            value={brief.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className={`status-select ${brief.status}`}
          >
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="brief-tabs">
        <button
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={activeTab === 'comments' ? 'active' : ''}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
        <button
          className={activeTab === 'versions' ? 'active' : ''}
          onClick={() => setActiveTab('versions')}
        >
          History
        </button>
      </div>

      <div className="brief-content">

        {activeTab === 'details' && (
          <div className="brief-details-view">
            <div className="detail-section">
              <h3>Description</h3>
              <p>{brief.description}</p>
            </div>

            <div className="detail-section">
              <h3>Client Info</h3>
              <p><strong>Name:</strong> {brief.client_name}</p>
            </div>

            {/* Render Request Section */}
            <div className="detail-section">
              <h3>3D Renders</h3>
              <div className="render-status-box">
                <p><strong>Status:</strong> {brief.render_status ? brief.render_status.replace('_', ' ') : 'None'}</p>

                {(!brief.render_status || brief.render_status === 'none' || brief.render_status === 'draft') && (
                  <button className="btn btn-secondary" onClick={handleRequestRender}>
                    Request Render
                  </button>
                )}

                {brief.render_status === 'render_requested' && (
                  <p className="status-info">Request sent to design team.</p>
                )}

                {brief.render_files && brief.render_files.length > 0 && (
                  <div className="render-gallery">
                    {brief.render_files.map((file, index) => (
                      <div key={index} className="render-item">
                        <img src={file.url || file} alt={`Render ${index + 1}`} />
                        <a href={file.url || file} download target="_blank" rel="noopener noreferrer">Download</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <CommentsSection briefId={id} />
        )}

        {activeTab === 'versions' && (
          <VersionHistory versions={versions} />
        )}
      </div>
    </div>
  );
};

export default BriefDetail;