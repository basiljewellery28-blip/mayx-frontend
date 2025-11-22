import React from 'react';
import './SummaryView.css';

const SummaryView = ({ formData, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="summary-modal-overlay">
            <div className="summary-modal-content">
                <div className="summary-header no-print">
                    <h2>Brief Summary</h2>
                    <div className="summary-actions">
                        <button className="btn btn-secondary" onClick={handlePrint}>
                            <i className="fas fa-print"></i> Print
                        </button>
                        <button className="btn btn-outline" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>

                <div className="printable-content" id="printable-brief">
                    {/* Header / Branding */}
                    <div className="print-header">
                        <div className="brand-logos">
                            {formData.brownsLogo && <img src={formData.brownsLogo} alt="BROWNS" className="print-logo" />}
                        </div>
                        <div className="brief-meta">
                            <h1>{formData.title || 'Untitled Brief'}</h1>
                            <p>Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <hr className="print-divider" />

                    {/* Client Details */}
                    <section className="print-section">
                        <h3>Client Details</h3>
                        <div className="print-grid">
                            <div className="print-field">
                                <label>Name:</label>
                                <span>{formData.clientName}</span>
                            </div>
                            <div className="print-field">
                                <label>Contact:</label>
                                <span>{formData.clientContact}</span>
                            </div>
                            <div className="print-field">
                                <label>Email:</label>
                                <span>{formData.clientEmail}</span>
                            </div>
                            <div className="print-field">
                                <label>Profile #:</label>
                                <span>{formData.clientProfile}</span>
                            </div>
                        </div>
                    </section>

                    {/* Consultant Details */}
                    <section className="print-section">
                        <h3>Consultant Details</h3>
                        <div className="print-grid">
                            <div className="print-field">
                                <label>Consultant:</label>
                                <span>{formData.consultantName} {formData.consultantSurname}</span>
                            </div>
                            <div className="print-field">
                                <label>Store:</label>
                                <span>{formData.storeName}</span>
                            </div>
                        </div>
                    </section>

                    <hr className="print-divider" />

                    {/* Product Details */}
                    <section className="print-section">
                        <h3>Product Specification</h3>
                        <div className="print-grid">
                            <div className="print-field">
                                <label>Category:</label>
                                <span>{formData.category}</span>
                            </div>
                            {formData.ringType && (
                                <div className="print-field">
                                    <label>Ring Type:</label>
                                    <span>{formData.ringType}</span>
                                </div>
                            )}
                            {formData.ringDesign && (
                                <div className="print-field">
                                    <label>Design:</label>
                                    <span>{formData.ringDesign}</span>
                                </div>
                            )}
                            {formData.metal && (
                                <div className="print-field">
                                    <label>Metal:</label>
                                    <span>{formData.metal}</span>
                                </div>
                            )}
                            {formData.sizeValue && (
                                <div className="print-field">
                                    <label>Size:</label>
                                    <span>{formData.sizeValue} ({formData.sizeSystem})</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Description */}
                    {formData.description && (
                        <section className="print-section">
                            <h3>Description / Notes</h3>
                            <p className="print-text">{formData.description}</p>
                        </section>
                    )}

                    {/* Images */}
                    {formData.inspirationImages && formData.inspirationImages.length > 0 && (
                        <section className="print-section">
                            <h3>Inspiration Images</h3>
                            <div className="print-images">
                                {formData.inspirationImages.map((img, index) => (
                                    <img key={index} src={img} alt={`Inspiration ${index + 1}`} className="print-image-thumb" />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryView;
