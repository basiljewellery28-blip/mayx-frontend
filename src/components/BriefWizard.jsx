import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { briefsAPI } from '../services/api';
import SummaryView from './SummaryView';
import './BriefWizard.css';

// Constants
const CATEGORIES = ['Ring', 'Earring', 'Necklace and Pendant', 'Bracelet'];
const RING_TYPES = ['Engagement Rings', 'Dress Rings', 'Mens Wedding Bands', 'Womens Wedding Bands and Eternity Rings', 'Diamond Band'];
const EARRING_TYPES = ['Studs', 'Drops', 'Hoops'];
const NECKLACE_TYPES = ['Pendants', 'Chokers', 'Chains'];
const BRACELET_TYPES = ['Bangles', 'Tennis Bracelets', 'Original Angel', 'B Bold', 'Timeless Classics'];
const GEM_TYPES = ['Diamond', 'Sapphire', 'Ruby', 'Emerald', 'Tanzanite', 'Morganite'];
const GEM_SHAPES = ['Round', 'Oval', 'Cushion', 'Princess', 'Emerald', 'Pear', 'Marquise', 'Radiant', 'Asscher', 'Heart'];
const DIAMOND_COLOR_GRADES = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const DIAMOND_CLARITY_GRADES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
const PART_OPTIONS = ['Shank', 'Head', 'Prongs', 'Bezel', 'Halo', 'Gallery', 'Shoulders'];
const DIAMOND_COVERAGE_OPTIONS = ['25%', '50%', '75%', '100%'];

const RING_DESIGNS = {
    'Engagement Rings': ['Solitaire', 'Halo', 'Trilogy', 'Vintage', 'Side Stones'],
    'Dress Rings': ['Cocktail', 'Statement', 'Stackable'],
    'Mens Wedding Bands': ['Classic', 'Modern', 'Patterned'],
    'Womens Wedding Bands and Eternity Rings': ['Classic', 'Diamond', 'Curved'],
    'Diamond Band': ['Classic', 'Eternity', 'Half Eternity']
};

const BRACELET_SIZES = {
    'Small': { in: '6.0', cm: '15.2' },
    'Medium': { in: '6.5', cm: '16.5' },
    'Large': { in: '7.0', cm: '17.8' },
    'X-Large': { in: '7.5', cm: '19.1' }
};

const RING_SIZE_DATA = {
    'South Africa': ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
};

const BriefWizard = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        clientName: '',
        clientContact: '',
        clientEmail: '',
        clientProfile: '',
        consultantName: '',
        consultantSurname: '',
        storeName: '',
        category: '',
        ringType: '',
        ringDesign: '',
        earringType: '',
        necklaceType: '',
        braceletType: '',
        sizeSystem: 'South Africa',
        sizeValue: '',
        diameter: '',
        bangleShape: 'Round',
        bangleDiameter: '',
        bangleHeight: '',
        bangleWidth: '',
        useBangleProfiles: false,
        braceletSize: '',
        gems: [],
        description: '',
        inspirationImages: [],
        alloys: [],
        engraving: '',
        logo: null,
        diamondCoverage: '',
        stoneCount: '',
        estimatedGemCount: '',
        stoneDiameter: ''
    });

    const [uiState, setUiState] = useState({
        showSummaryModal: false
    });

    // Handlers
    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategorySelect = (cat) => setFormData(prev => ({ ...prev, category: cat, ringType: '', ringDesign: '', earringType: '', necklaceType: '', braceletType: '' }));
    const handleRingTypeSelect = (type) => setFormData(prev => ({ ...prev, ringType: type, ringDesign: '' }));
    const handleRingDesignSelect = (design) => setFormData(prev => ({ ...prev, ringDesign: design }));
    const handleEarringTypeSelect = (type) => setFormData(prev => ({ ...prev, earringType: type }));
    const handleNecklaceTypeSelect = (type) => setFormData(prev => ({ ...prev, necklaceType: type }));
    const handleBraceletTypeSelect = (type) => setFormData(prev => ({ ...prev, braceletType: type }));
    const handleBraceletSizeSelect = (size) => setFormData(prev => ({ ...prev, braceletSize: size }));
    const handleBangleShapeSelect = (shape) => setFormData(prev => ({ ...prev, bangleShape: shape }));
    const handleDiamondCoverageSelect = (coverage) => setFormData(prev => ({ ...prev, diamondCoverage: coverage }));

    const addGem = () => {
        setFormData(prev => ({
            ...prev,
            gems: [...prev.gems, { id: Date.now(), type: 'Diamond', shape: 'Round', size: '', quantity: 1, width: '', length: '', color: 'G', clarity: 'VS1' }]
        }));
    };

    const removeGem = (id) => {
        setFormData(prev => ({
            ...prev,
            gems: prev.gems.filter(g => g.id !== id)
        }));
    };

    const updateGem = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            gems: prev.gems.map(g => g.id === id ? { ...g, [field]: value } : g)
        }));
    };

    const addAlloy = () => {
        setFormData(prev => ({
            ...prev,
            alloys: [...prev.alloys, { id: Date.now(), metal: '18ct Yellow Gold', finish: 'Polished', part: 'Shank' }]
        }));
    };

    const removeAlloy = (id) => {
        setFormData(prev => ({
            ...prev,
            alloys: prev.alloys.filter(a => a.id !== id)
        }));
    };

    const updateAlloy = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            alloys: prev.alloys.map(a => a.id === id ? { ...a, [field]: value } : a)
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setFormData(prev => ({ ...prev, logo: e.target.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleInspirationUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    inspirationImages: [...prev.inspirationImages, e.target.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeInspirationImage = (index) => {
        setFormData(prev => ({
            ...prev,
            inspirationImages: prev.inspirationImages.filter((_, i) => i !== index)
        }));
    };

    const saveBrief = async () => {
        try {
            await briefsAPI.create(formData);
            alert('Brief saved successfully!');
            navigate('/briefs');
        } catch (error) {
            console.error('Error saving brief:', error);
            alert('Failed to save brief.');
        }
    };

    // Safe JSON parse helper
    const safeParse = (jsonString) => {
        try {
            return JSON.parse(jsonString) || {};
        } catch (e) {
            console.error('Error parsing custom images:', e);
            return {};
        }
    };

    const [customImages, setCustomImages] = useState(safeParse(localStorage.getItem('adminCustomImages')));

    useEffect(() => {
        const handleStorageChange = () => {
            setCustomImages(safeParse(localStorage.getItem('adminCustomImages')));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Helper to get images
    const getImage = (type, key) => {
        const customKey = `${type}_${key}`;
        return customImages[customKey] || `https://placehold.co/400x400?text=${encodeURIComponent(key)}`;
    };

    const renderCarousel = (items, selectedItem, onSelect, type, keyPrefix) => {
        return (
            <div className="grid grid-4">
                {items.map(item => (
                    <div
                        key={item}
                        className={`visual-card-select ${selectedItem === item ? 'active' : ''}`}
                        onClick={() => onSelect(item)}
                    >
                        <img src={getImage(keyPrefix, item)} alt={item} />
                        <span className="visual-card-label">{item}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="brief-wizard-container">
            <header className="wizard-header">
                <div className="header-content">
                    <h1>Create New Brief</h1>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={() => setUiState(prev => ({ ...prev, showSummaryModal: true }))}>
                            <i className="fas fa-file-alt"></i> Generate Summary
                        </button>
                        <button className="btn btn-primary" onClick={saveBrief}>
                            <i className="fas fa-save"></i> Save Brief
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                {/* Client Details */}
                <section className="section">
                    <h2 className="section-title">Client Details</h2>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Brief Title</label>
                            <input type="text" id="title" className="form-input" value={formData.title} onChange={handleInputChange} placeholder="e.g. Smith Engagement Ring" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" id="clientName" className="form-input" value={formData.clientName} onChange={handleInputChange} placeholder="Enter client's full name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contact Number</label>
                            <input type="tel" id="clientContact" className="form-input" value={formData.clientContact} onChange={handleInputChange} placeholder="Enter contact number" />
                        </div>
                    </div>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" id="clientEmail" className="form-input" value={formData.clientEmail} onChange={handleInputChange} placeholder="Enter email address" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Client Profile Number</label>
                            <input type="text" id="clientProfile" className="form-input" value={formData.clientProfile} onChange={handleInputChange} placeholder="Enter client profile number" />
                        </div>
                    </div>
                </section>

                {/* Consultant Details */}
                <section className="section">
                    <h2 className="section-title">Consultant Details</h2>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Consultant Name</label>
                            <input type="text" id="consultantName" className="form-input" value={formData.consultantName} onChange={handleInputChange} placeholder="Enter consultant name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Consultant Surname</label>
                            <input type="text" id="consultantSurname" className="form-input" value={formData.consultantSurname} onChange={handleInputChange} placeholder="Enter consultant surname" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Store Name</label>
                        <input type="text" id="storeName" className="form-input" value={formData.storeName} onChange={handleInputChange} placeholder="Enter store name" />
                    </div>
                </section>

                {/* Category Selection */}
                <section className="section">
                    <h2 className="section-title">What are we making today?</h2>
                    <div className="grid grid-4">
                        {CATEGORIES.map(cat => (
                            <div
                                key={cat}
                                className={`visual-card-select ${formData.category === cat ? 'active' : ''}`}
                                onClick={() => handleCategorySelect(cat)}
                            >
                                <img src={getImage('categories', cat)} alt={cat} />
                                <span className="visual-card-label">{cat.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ring Type Selection */}
                {formData.category === 'Ring' && (
                    <section className="section">
                        <h2 className="section-title">What type of Ring?</h2>
                        <div className="grid grid-6">
                            {RING_TYPES.map(type => (
                                <div
                                    key={type}
                                    className={`visual-card-select ${formData.ringType === type ? 'active' : ''}`}
                                    onClick={() => handleRingTypeSelect(type)}
                                >
                                    <img src={getImage('ringTypes', type)} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Ring Design Selection */}
                {formData.category === 'Ring' && formData.ringType && RING_DESIGNS[formData.ringType] && (
                    <section className="section">
                        <h2 className="section-title">Select {formData.ringType} Design</h2>
                        {renderCarousel(RING_DESIGNS[formData.ringType], formData.ringDesign, handleRingDesignSelect, formData.ringType, 'ringDesigns')}
                    </section>
                )}

                {/* Earring Type Selection */}
                {formData.category === 'Earring' && (
                    <section className="section">
                        <h2 className="section-title">What type of Earring?</h2>
                        <div className="grid grid-4">
                            {EARRING_TYPES.map(type => (
                                <div
                                    key={type}
                                    className={`visual-card-select ${formData.earringType === type ? 'active' : ''}`}
                                    onClick={() => handleEarringTypeSelect(type)}
                                >
                                    <img src={getImage('earringTypes', type)} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Necklace Type Selection */}
                {formData.category === 'Necklace and Pendant' && (
                    <section className="section">
                        <h2 className="section-title">What type of Necklace?</h2>
                        <div className="grid grid-4">
                            {NECKLACE_TYPES.map(type => (
                                <div
                                    key={type}
                                    className={`visual-card-select ${formData.necklaceType === type ? 'active' : ''}`}
                                    onClick={() => handleNecklaceTypeSelect(type)}
                                >
                                    <img src={getImage('necklaceTypes', type)} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Bracelet Type Selection */}
                {formData.category === 'Bracelet' && (
                    <section className="section">
                        <h2 className="section-title">What type of Bracelet?</h2>
                        <div className="grid grid-5">
                            {BRACELET_TYPES.map(type => (
                                <div
                                    key={type}
                                    className={`visual-card-select ${formData.braceletType === type ? 'active' : ''}`}
                                    onClick={() => handleBraceletTypeSelect(type)}
                                >
                                    <img src={getImage('braceletTypes', type)} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Ring Size */}
                {formData.category === 'Ring' && formData.ringDesign && (
                    <section className="section">
                        <h2 className="section-title">Select Ring Size</h2>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Size System</label>
                                <select className="form-select" value={formData.sizeSystem} disabled>
                                    <option>South Africa</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Size</label>
                                <select
                                    className="form-select"
                                    value={formData.sizeValue}
                                    onChange={(e) => setFormData(prev => ({ ...prev, sizeValue: e.target.value }))}
                                >
                                    <option value="">Select Size</option>
                                    {RING_SIZE_DATA['South Africa'].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>
                )}

                {/* Diamond Band Specs */}
                {formData.category === 'Ring' && (formData.ringDesign === 'Womens Wedding Bands and Eternity Rings' || formData.ringDesign === 'Diamond Band') && (
                    <section className="section">
                        <h2 className="section-title">Diamond Band Specifications</h2>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Diamond Coverage</label>
                                <div className="grid grid-4">
                                    {DIAMOND_COVERAGE_OPTIONS.map(option => (
                                        <button
                                            key={option}
                                            className={`card-select ${formData.diamondCoverage === option ? 'active' : ''}`}
                                            onClick={() => handleDiamondCoverageSelect(option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Gemstone Details */}
                <section className="section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="section-title">Gemstone Details</h2>
                        <button className="btn btn-success" onClick={addGem}>
                            <i className="fas fa-plus"></i> Add Gem
                        </button>
                    </div>
                    {formData.gems.map((gem, index) => (
                        <div key={gem.id} className="gem-details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ fontWeight: 600 }}>Gem {index + 1}</h4>
                                <button className="btn btn-danger" onClick={() => removeGem(gem.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                            <div className="grid grid-4">
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={gem.type} onChange={(e) => updateGem(gem.id, 'type', e.target.value)}>
                                        {GEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Shape</label>
                                    <select className="form-select" value={gem.shape} onChange={(e) => updateGem(gem.id, 'shape', e.target.value)}>
                                        {GEM_SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Size (ct)</label>
                                    <input type="number" className="form-input" value={gem.size} onChange={(e) => updateGem(gem.id, 'size', e.target.value)} placeholder="0.00" step="0.01" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input type="number" className="form-input" value={gem.quantity} onChange={(e) => updateGem(gem.id, 'quantity', e.target.value)} min="1" />
                                </div>
                            </div>
                            <div className="grid grid-4">
                                <div className="form-group">
                                    <label className="form-label">Width (mm)</label>
                                    <input type="number" className="form-input" value={gem.width} onChange={(e) => updateGem(gem.id, 'width', e.target.value)} placeholder="0.00" step="0.01" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Length (mm)</label>
                                    <input type="number" className="form-input" value={gem.length} onChange={(e) => updateGem(gem.id, 'length', e.target.value)} placeholder="0.00" step="0.01" />
                                </div>
                                {gem.type === 'Diamond' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Color</label>
                                            <select className="form-select" value={gem.color} onChange={(e) => updateGem(gem.id, 'color', e.target.value)}>
                                                {DIAMOND_COLOR_GRADES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Clarity</label>
                                            <select className="form-select" value={gem.clarity} onChange={(e) => updateGem(gem.id, 'clarity', e.target.value)}>
                                                {DIAMOND_CLARITY_GRADES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Description */}
                <section className="section">
                    <h2 className="section-title">Describe your ideal design</h2>
                    <textarea id="description" className="form-textarea" value={formData.description} onChange={handleInputChange} placeholder="This is a trilogy ring..."></textarea>
                </section>

                {/* Inspiration Images */}
                <section className="section">
                    <h2 className="section-title">Upload Inspiration Images</h2>
                    <div className="upload-area" onClick={() => document.getElementById('inspiration-upload').click()}>
                        <div className="upload-icon">
                            <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <p>Drag & drop or click to upload</p>
                        <input type="file" id="inspiration-upload" multiple accept="image/*" style={{ display: 'none' }} onChange={handleInspirationUpload} />
                    </div>
                    <div className="image-grid">
                        {formData.inspirationImages.map((img, index) => (
                            <div key={index} className="image-item">
                                <img src={img} alt={`Inspiration ${index}`} className="image-preview" />
                                <div className="image-actions">
                                    <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => removeInspirationImage(index)}>
                                        <i className="fas fa-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Alloy Specification */}
                <section className="section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="section-title">Metal Type</h2>
                        <button className="btn btn-success" onClick={addAlloy}>
                            <i className="fas fa-plus"></i> Add Metal Type
                        </button>
                    </div>
                    {formData.alloys.map((alloy, index) => (
                        <div key={alloy.id} className="alloy-details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ fontWeight: 600 }}>Metal {index + 1}</h4>
                                <button className="btn btn-danger" onClick={() => removeAlloy(alloy.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                            <div className="grid grid-3">
                                <div className="form-group">
                                    <label className="form-label">Metal</label>
                                    <select className="form-select" value={alloy.metal} onChange={(e) => updateAlloy(alloy.id, 'metal', e.target.value)}>
                                        <option>18ct Yellow Gold</option>
                                        <option>18ct White Gold</option>
                                        <option>18ct Rose Gold</option>
                                        <option>Platinum</option>
                                        <option>9ct Yellow Gold</option>
                                        <option>9ct White Gold</option>
                                        <option>9ct Rose Gold</option>
                                        <option>Silver</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Finish</label>
                                    <select className="form-select" value={alloy.finish} onChange={(e) => updateAlloy(alloy.id, 'finish', e.target.value)}>
                                        <option>Polished</option>
                                        <option>Brushed</option>
                                        <option>Matte</option>
                                        <option>Hammered</option>
                                        <option>Satin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Part</label>
                                    <select className="form-select" value={alloy.part} onChange={(e) => updateAlloy(alloy.id, 'part', e.target.value)}>
                                        {PART_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Engraving */}
                <section className="section">
                    <h2 className="section-title">Engraving</h2>
                    <div className="form-group">
                        <input type="text" id="engraving" className="form-input" value={formData.engraving} onChange={handleInputChange} placeholder="Enter engraving text..." />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="file" id="logo-upload" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                        <button className="btn btn-secondary" onClick={() => document.getElementById('logo-upload').click()}>
                            Upload Logo
                        </button>
                        {formData.logo && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={formData.logo} alt="Logo" style={{ height: '4rem', width: '4rem', objectFit: 'contain', border: '1px solid var(--gray-300)', borderRadius: '0.375rem' }} />
                                <button className="btn btn-danger" style={{ marginLeft: '0.5rem' }} onClick={() => setFormData(prev => ({ ...prev, logo: null }))}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Summary Modal */}
            {uiState.showSummaryModal && (
                <SummaryView
                    formData={formData}
                    onClose={() => setUiState(prev => ({ ...prev, showSummaryModal: false }))}
                />
            )}
        </div>
    );
};

export default BriefWizard;
