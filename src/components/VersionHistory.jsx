import React from 'react';

const VersionHistory = ({ versions }) => {
    if (!versions || versions.length === 0) {
        return <div className="empty-state">No version history available.</div>;
    }

    // Helper to format the JSON data into a readable list
    const formatData = (data) => {
        if (!data) return null;
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            // Filter out empty or technical fields if needed
            return Object.entries(parsed).map(([key, value]) => {
                // Skip internal fields or empty values
                if (!value || key === 'step' || key === 'consultantId') return null;

                // Format key from camelCase to Title Case
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                return (
                    <div key={key} className="version-field">
                        <span className="field-label">{label}:</span>
                        <span className="field-value">{String(value)}</span>
                    </div>
                );
            });
        } catch (e) {
            return <pre>{JSON.stringify(data, null, 2)}</pre>;
        }
    };

    return (
        <div className="version-history-container">
            {versions.map((version, index) => (
                <div key={version.id} className="version-card">
                    <div className="version-header">
                        <div className="version-info">
                            <h4>Version {version.version_number}</h4>
                            <span className="version-date">
                                {new Date(version.created_at).toLocaleString()}
                            </span>
                        </div>
                        <div className="version-author">
                            <span>By {version.user_name || 'Unknown User'}</span>
                        </div>
                    </div>

                    <div className="version-content">
                        {index === versions.length - 1 && (
                            <div className="current-version-badge">Current Version</div>
                        )}
                        <div className="version-data-grid">
                            {formatData(version.data)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VersionHistory;
