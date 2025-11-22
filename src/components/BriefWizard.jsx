import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { briefsAPI } from '../services/api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './BriefWizard.css';

// Constants
const CATEGORIES = ['Ring', 'Earring', 'Necklace and Pendant', 'Bracelet'];
const RING_TYPES = ['Engagement Rings', 'Dress Rings'];

const RING_DESIGNS = {
    'Engagement Rings': ['Solitaire', 'Classic Trilogy', 'Today & Forever', 'Queen of my heart', 'Angel Halo', 'Womens Wedding Bands and Eternity Rings'],
    'Dress Rings': ['Chorus', 'Dress Ring', 'Emerald and Diamond Scalloped', 'Pearl and Diamond Cluster', 'Protea Diamond Cluster', 'Royal Tanzanite and Diamond Cluster']
};

const EARRING_TYPES = ['Hoops', 'Drops', 'Studs', 'Original Angel', 'Angel Art', 'B Bold'];
const NECKLACE_TYPES = ['Angel Art', 'Blossom', 'Chorus', 'Journey', 'Multistone', 'Protea'];
const BRACELET_TYPES = ['Tennis Bracelets', 'Bangles', 'Original Angel', 'B Bold', 'Timeless Classics'];

const BRACELET_SIZES = {
    'Small': { in: '5.26 - 5.75', cm: '13.4 - 14.6', smartCm: '14.6' },
    'Medium': { in: '5.76 - 6.25', cm: '14.6 - 15.9', smartCm: '15.9' },
    'Large': { in: '6.26 - 6.75', cm: '15.9 - 17.1', smartCm: '17.1' },
    'Extra Large': { in: '6.76 - 7.25', cm: '17.2 - 18.4', smartCm: '18.4' }
};

const DIAMOND_COVERAGE_OPTIONS = ['25%', '50%', '70%', '100%'];
const SIZE_SYSTEMS = ['South Africa'];
const GEM_TYPES = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Tanzanite', 'Blue Sapphire', 'Pink Sapphire', 'Black Diamond', 'Cognac Diamond', 'Yellow Diamond', 'Aquamarine', 'Morganite', 'Other'];
const GEM_SHAPES = ['Round', 'Princess', 'Oval', 'Pear', 'Marquise', 'Cushion', 'Emerald', 'Asscher', 'Radiant', 'Heart'];
const DIAMOND_COLOR_GRADES = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const DIAMOND_CLARITY_GRADES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
const PART_OPTIONS = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5'];

// Ring Size Data (South Africa)
const RING_SIZE_DATA = {
    'South Africa': ['F', 'F½', 'G', 'G½', 'H', 'H½', 'I', 'I½', 'J', 'J½', 'K', 'K½', 'L', 'L½', 'M', 'M½', 'N', 'N½', 'O', 'O½', 'P', 'P½', 'Q', 'Q½', 'R', 'R½', 'S', 'S½', 'T', 'T½', 'U', 'U½', 'V', 'V½', 'W', 'W½', 'X', 'X½', 'Y', 'Z']
};

const DIAMETERS = {
    'South Africa': {
        'F': '14.05', 'F½': '14.25', 'G': '14.45', 'G½': '14.65', 'H': '14.86', 'H½': '15.06',
        'I': '15.27', 'I½': '15.47', 'J': '15.70', 'J½': '15.90', 'K': '16.10', 'K½': '16.31',
        'L': '16.51', 'L½': '16.71', 'M': '16.92', 'M½': '17.12', 'N': '17.35', 'N½': '17.55',
        'O': '17.75', 'O½': '17.96', 'P': '18.19', 'P½': '18.39', 'Q': '18.59', 'Q½': '18.80',
        'R': '19.00', 'R½': '19.20', 'S': '19.41', 'S½': '19.61', 'T': '19.84', 'T½': '20.04',
        'U': '20.24', 'U½': '20.45', 'V': '20.68', 'V½': '20.88', 'W': '21.08', 'W½': '21.29',
        'X': '21.49', 'X½': '21.69', 'Y': '21.89', 'Z': '22.10'
    }
};

const ADMIN_CONFIG = {
    password: 'admin123',
    sessionTimeout: 60 * 60 * 1000,
};

const BriefWizard = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    // State
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        ringType: '',
        ringDesign: '',
        earringType: '',
        necklaceType: '',
        braceletType: '',
        braceletSize: 'Medium',
        partFinishing: 'Finished',
        sizeSystem: 'South Africa',
        sizeValue: 'N',
        diameter: '17.35',
        bangleShape: 'Round',
        bangleDiameter: '65.0',
        bangleHeight: '45.0',
        bangleWidth: '55.0',
        useBangleProfiles: false,
        braceletLength: '15.9',
        stoneDiameter: '3.0',
        estimatedGemCount: '53',
        diamondCoverage: '50%',
        stoneCount: '7',
        gems: [],
        description: '',
        inspirationImages: [],
        alloys: [],
        engraving: '',
        logo: null,
        clientName: '',
        clientContact: '',
        clientEmail: '',
        clientProfile: '',
        consultantName: '',
        consultantSurname: '',
        storeName: '',
        brownsLogo: '/images/logos/browns logo.png',
        onlyNaturalDiamondsLogo: '/images/logos/only natural diamonds.png'
    });

    const [admin, setAdmin] = useState({
        isLoggedIn: false,
        loginTime: null,
        customImages: JSON.parse(localStorage.getItem('adminCustomImages')) || {},
        showLoginModal: false,
        showPanelModal: false,
        passwordInput: ''
    });

    const [uiState, setUiState] = useState({
        engagementRingCarouselPosition: 0,
        dressRingCarouselPosition: 0,
        showMarkupModal: false,
        showSummaryModal: false,
        markupMode: 'draw',
        drawColor: '#FF0000',
        penThickness: 3,
        fontSize: 20,
        textInput: '',
        savedBriefs: []
    });

    // Helper to get images (handling admin custom images)
    const getImage = (type, key) => {
        const customKey = `${type}_${key}`;
        if (admin.customImages[customKey]) {
            return admin.customImages[customKey];
        }

        // Default images mapping
        const defaults = {
            categories: {
                'Ring': '/images/categories/category ring.jpg',
                'Earring': '/images/categories/category earrings.jpg',
                'Necklace and Pendant': '/images/categories/category necklaces.jpg',
                'Bracelet': '/images/categories/category bracelet.jpg'
            },
            ringTypes: {
                'Engagement Rings': '/images/ring types/engagement rings.jpg',
                'Dress Rings': '/images/ring types/dress ring.jpg'
            },
            ringDesigns: {
                'Solitaire': '/images/ring designs/engagement/solitaire ring.jpg',
                'Classic Trilogy': '/images/ring designs/engagement/classic trilogy ring.jpg',
                'Today & Forever': '/images/ring designs/engagement/today and forever ring.jpg',
                'Queen of my heart': '/images/ring designs/engagement/queen of my heart ring.jpg',
                'Angel Halo': '/images/ring designs/engagement/angel halo ring.jpg',
                'Womens Wedding Bands and Eternity Rings': '/images/ring designs/engagement/womens wedding and eternity bands ring.jpg',
                'Chorus': '/images/ring designs/dress/chorus ring.jpg',
                'Dress Ring': '/images/ring designs/dress/dress ring.jpg',
                'Emerald and Diamond Scalloped': '/images/ring designs/dress/emerald and diamond scalloped ring.jpg',
                'Pearl and Diamond Cluster': '/images/ring designs/dress/pearl and diamond cluster ring.jpg',
                'Protea Diamond Cluster': '/images/ring designs/dress/protea diamond cluster ring.jpg',
                'Royal Tanzanite and Diamond Cluster': '/images/ring designs/dress/royal tanzanite and diamond cluster ring.jpg'
            },
            earringTypes: {
                'Hoops': '/images/earring types/hoops.jpg',
                'Drops': '/images/earring types/drops.jpg',
                'Studs': '/images/earring types/studs.jpg',
                'Original Angel': '/images/earring types/original angel.jpg',
                'Angel Art': '/images/earring types/angel-art.jpg',
                'B Bold': '/images/earring types/b-bold.jpg'
            },
            necklaceTypes: {
                'Angel Art': '/images/necklace types/angel-art.jpg',
                'Blossom': '/images/necklace types/blossom.jpg',
                'Chorus': '/images/necklace types/chorus.jpg',
                'Journey': '/images/necklace types/journey.jpg',
                'Multistone': '/images/necklace types/multistone.jpg',
                'Protea': '/images/necklace types/protea.jpg'
            },
            braceletTypes: {
                'Tennis Bracelets': '/images/bracelet types/tennis.jpg',
                'Bangles': '/images/bracelet types/bangle.jpg',
                'Original Angel': '/images/bracelet types/original-angel bangle.jpg',
                'B Bold': '/images/bracelet types/b-bold bangle.jpg',
                'Timeless Classics': '/images/bracelet types/timeless.jpg'
            }
        };

        return defaults[type]?.[key] || '';
    };

    // Calculations
    const updateTennisBraceletEstimate = useCallback(() => {
        const length = parseFloat(formData.braceletLength) || 0;
        const stoneDia = parseFloat(formData.stoneDiameter) || 0;

        if (length > 0 && stoneDia > 0) {
            const lengthMm = length * 10;
            const gemCount = Math.round(lengthMm / stoneDia);
            setFormData(prev => ({ ...prev, estimatedGemCount: gemCount.toString() }));
        }
    }, [formData.braceletLength, formData.stoneDiameter]);

    const updateDiamondBandStoneCount = useCallback(() => {
        const coverage = parseFloat(formData.diamondCoverage) || 0;
        const diameter = parseFloat(formData.diameter) || 0;

        if (coverage > 0 && diameter > 0) {
            const circumference = Math.PI * diameter;
            let gemWidth = 3.0;
            if (formData.gems.length > 0 && formData.gems[0].width) {
                gemWidth = parseFloat(formData.gems[0].width);
            }

            const coverageLength = circumference * (coverage / 100);
            const stoneCount = Math.round(coverageLength / gemWidth);

            setFormData(prev => {
                const newGems = [...prev.gems];
                if (newGems.length > 0) {
                    newGems[0].quantity = stoneCount.toString();
                }
                return { ...prev, stoneCount: stoneCount.toString(), gems: newGems };
            });
        }
    }, [formData.diamondCoverage, formData.diameter, formData.gems]);

    // Effects
    useEffect(() => {
        if (formData.braceletType === 'Tennis Bracelets') {
            updateTennisBraceletEstimate();
        }
    }, [formData.braceletLength, formData.stoneDiameter, formData.braceletType, updateTennisBraceletEstimate]);

    useEffect(() => {
        if (formData.ringDesign === 'Womens Wedding Bands and Eternity Rings' || formData.ringDesign === 'Diamond Band') {
            updateDiamondBandStoneCount();
        }
    }, [formData.diamondCoverage, formData.diameter, formData.ringDesign, updateDiamondBandStoneCount]);

    useEffect(() => {
        // Update diameter when size changes
        const diameter = DIAMETERS[formData.sizeSystem]?.[formData.sizeValue] || '';
        if (diameter) {
            setFormData(prev => ({ ...prev, diameter }));
        }
    }, [formData.sizeSystem, formData.sizeValue]);

    // Handlers
    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id.replace(/-/g, '')]: type === 'checkbox' ? checked : value // Simple mapping, might need adjustment for specific IDs
        }));

        // Specific mappings for IDs that don't match state keys exactly
        if (id === 'client-name') setFormData(prev => ({ ...prev, clientName: value }));
        if (id === 'client-contact') setFormData(prev => ({ ...prev, clientContact: value }));
        if (id === 'client-email') setFormData(prev => ({ ...prev, clientEmail: value }));
        if (id === 'client-profile') setFormData(prev => ({ ...prev, clientProfile: value }));
        if (id === 'consultant-name') setFormData(prev => ({ ...prev, consultantName: value }));
        if (id === 'consultant-surname') setFormData(prev => ({ ...prev, consultantSurname: value }));
        if (id === 'store-name') setFormData(prev => ({ ...prev, storeName: value }));
        if (id === 'bangle-diameter') setFormData(prev => ({ ...prev, bangleDiameter: value }));
        if (id === 'bangle-height') setFormData(prev => ({ ...prev, bangleHeight: value }));
        if (id === 'bangle-width') setFormData(prev => ({ ...prev, bangleWidth: value }));
        if (id === 'stone-diameter') setFormData(prev => ({ ...prev, stoneDiameter: value }));
        if (id === 'description') setFormData(prev => ({ ...prev, description: value }));
        if (id === 'engraving') setFormData(prev => ({ ...prev, engraving: value }));
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({
            ...prev,
            category,
            ringType: '',
            ringDesign: '',
            earringType: '',
            necklaceType: '',
            braceletType: ''
        }));
    };

    const handleRingTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, ringType: type, ringDesign: '' }));
    };

    const handleRingDesignSelect = (design) => {
        setFormData(prev => ({ ...prev, ringDesign: design }));
    };

    const handleEarringTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, earringType: type }));
    };

    const handleNecklaceTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, necklaceType: type }));
    };

    const handleBraceletTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, braceletType: type }));
    };

    const handleBraceletSizeSelect = (size) => {
        setFormData(prev => ({
            ...prev,
            braceletSize: size,
            braceletLength: BRACELET_SIZES[size].smartCm
        }));
    };

    const handleDiamondCoverageSelect = (coverage) => {
        setFormData(prev => ({ ...prev, diamondCoverage: coverage }));
    };

    const handleBangleShapeSelect = (shape) => {
        setFormData(prev => ({ ...prev, bangleShape: shape }));
    };

    // Gem Management
    const addGem = () => {
        setFormData(prev => ({
            ...prev,
            gems: [...prev.gems, {
                id: Date.now(),
                type: 'Diamond',
                shape: 'Round',
                size: '',
                width: '',
                length: '',
                quantity: '1',
                color: 'G',
                clarity: 'VS1',
                cut: 'Very Good',
                setting: 'Claw'
            }]
        }));
    };

    const updateGem = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            gems: prev.gems.map(gem => gem.id === id ? { ...gem, [field]: value } : gem)
        }));
    };

    const removeGem = (id) => {
        setFormData(prev => ({
            ...prev,
            gems: prev.gems.filter(gem => gem.id !== id)
        }));
    };

    // Alloy Management
    const addAlloy = () => {
        setFormData(prev => ({
            ...prev,
            alloys: [...prev.alloys, {
                id: Date.now(),
                metal: '18ct Yellow Gold',
                finish: 'Polished',
                part: 'Part 1'
            }]
        }));
    };

    const updateAlloy = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            alloys: prev.alloys.map(alloy => alloy.id === id ? { ...alloy, [field]: value } : alloy)
        }));
    };

    const removeAlloy = (id) => {
        setFormData(prev => ({
            ...prev,
            alloys: prev.alloys.filter(alloy => alloy.id !== id)
        }));
    };

    // Image Uploads
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

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({ ...prev, logo: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Admin Functions
    const handleAdminLogin = () => {
        if (admin.passwordInput === ADMIN_CONFIG.password) {
            setAdmin(prev => ({
                ...prev,
                isLoggedIn: true,
                loginTime: Date.now(),
                showLoginModal: false,
                showPanelModal: true,
                passwordInput: ''
            }));
        } else {
            alert('Invalid password!');
        }
    };

    const handleAdminImageUpload = (e, type, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newCustomImages = {
                    ...admin.customImages,
                    [`${type}_${key}`]: e.target.result
                };
                setAdmin(prev => ({ ...prev, customImages: newCustomImages }));
                localStorage.setItem('adminCustomImages', JSON.stringify(newCustomImages));
            };
            reader.readAsDataURL(file);
        }
    };

    const resetAdminImage = (type, key) => {
        const newCustomImages = { ...admin.customImages };
        delete newCustomImages[`${type}_${key}`];
        setAdmin(prev => ({ ...prev, customImages: newCustomImages }));
        localStorage.setItem('adminCustomImages', JSON.stringify(newCustomImages));
    };

    // Saving and PDF
    const saveBrief = async () => {
        try {
            if (!formData.title) {
                alert('Please enter a Brief Title.');
                return;
            }

            const response = await briefsAPI.create(formData);

            alert('Brief saved successfully!');
            // Redirect to the new brief's detail page or the dashboard
            if (response.data.brief && response.data.brief.id) {
                navigate(`/briefs/${response.data.brief.id}`);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error saving brief:', error);
            alert('Failed to save brief. ' + (error.response?.data?.message || error.message));
        }
    };

    const generatePDF = async () => {
        // Simple PDF generation placeholder - in a real app, you'd render the summary to a hidden div and capture it
        const doc = new jsPDF();
        doc.text(`Brief for ${formData.clientName}`, 10, 10);
        doc.save('brief.pdf');
    };

    // Render Helpers
    const renderCarousel = (items, selectedItem, onSelect, type, imageType) => {
        // Simple carousel implementation
        return (
            <div className="carousel-container">
                <div className="carousel-track" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                    {items.map(item => (
                        <div
                            key={item}
                            className={`carousel-item visual-card-select ${selectedItem === item ? 'active' : ''}`}
                            onClick={() => onSelect(item)}
                            style={{ width: '150px', margin: '0.5rem' }}
                        >
                            <img src={getImage(imageType, item)} alt={item} />
                            <span className="visual-card-label">{item.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="brief-wizard-container">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo-container">
                        <div className="brand-logos">
                            <img src={formData.brownsLogo} alt="BROWNS" className="brand-logo" />
                            <img src={formData.onlyNaturalDiamondsLogo} alt="Only Natural Diamonds" className="brand-logo-small" />
                        </div>
                    </div>
                    <div className="header-buttons">
                        <button className="btn btn-outline" onClick={() => setAdmin(prev => ({ ...prev, showLoginModal: true }))}>
                            <i className="fas fa-cog"></i> Admin
                        </button>
                        <button className="btn btn-secondary" onClick={() => alert('Summary View Not Implemented Yet')}>
                            <i className="fas fa-file-alt"></i> Generate Summary
                        </button>
                        <button className="btn btn-primary" onClick={generatePDF}>
                            <i className="fas fa-file-pdf"></i> Save as PDF
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
                            <input type="text" id="client-name" className="form-input" value={formData.clientName} onChange={handleInputChange} placeholder="Enter client's full name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contact Number</label>
                            <input type="tel" id="client-contact" className="form-input" value={formData.clientContact} onChange={handleInputChange} placeholder="Enter contact number" />
                        </div>
                    </div>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" id="client-email" className="form-input" value={formData.clientEmail} onChange={handleInputChange} placeholder="Enter email address" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Client Profile Number</label>
                            <input type="text" id="client-profile" className="form-input" value={formData.clientProfile} onChange={handleInputChange} placeholder="Enter client profile number" />
                        </div>
                    </div>
                </section>

                {/* Consultant Details */}
                <section className="section">
                    <h2 className="section-title">Consultant Details</h2>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Consultant Name</label>
                            <input type="text" id="consultant-name" className="form-input" value={formData.consultantName} onChange={handleInputChange} placeholder="Enter consultant name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Consultant Surname</label>
                            <input type="text" id="consultant-surname" className="form-input" value={formData.consultantSurname} onChange={handleInputChange} placeholder="Enter consultant surname" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Store Name</label>
                        <input type="text" id="store-name" className="form-input" value={formData.storeName} onChange={handleInputChange} placeholder="Enter store name" />
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
                {formData.category === 'Ring' && formData.ringType && (
                    <section className="section">
                        <h2 className="section-title">Select {formData.ringType.slice(0, -1)} Design</h2>
                        {renderCarousel(RING_DESIGNS[formData.ringType], formData.ringDesign, handleRingDesignSelect, formData.ringType, 'ringDesigns')}
                    </section>
                )}

                {/* Earring Type Selection */}
                {formData.category === 'Earring' && (
                    <section className="section">
                        <h2 className="section-title">What type of Earring?</h2>
                        <div className="grid grid-6">
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
                        <h2 className="section-title">What type of Necklace and Pendant?</h2>
                        <div className="grid grid-6">
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
                                    {RING_SIZE_DATA['South Africa'].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="info-box">
                            <p className="info-text">Your selected size is {formData.diameter} mm inside diameter.</p>
                        </div>
                    </section>
                )}

                {/* Bangle Dimensions */}
                {formData.category === 'Bracelet' && formData.braceletType === 'Bangles' && (
                    <section className="section">
                        <h2 className="section-title">Bangle/Cuff Dimensions</h2>
                        <div className="grid grid-2 mb-4">
                            <div>
                                <label className="form-label">Shape</label>
                                <div className="grid grid-2">
                                    <button
                                        className={`card-select ${formData.bangleShape === 'Round' ? 'active' : ''}`}
                                        onClick={() => handleBangleShapeSelect('Round')}
                                    >
                                        Round
                                    </button>
                                    <button
                                        className={`card-select ${formData.bangleShape === 'Oval' ? 'active' : ''}`}
                                        onClick={() => handleBangleShapeSelect('Oval')}
                                    >
                                        Oval
                                    </button>
                                </div>
                            </div>
                            {formData.bangleShape === 'Round' ? (
                                <div>
                                    <label className="form-label">Diameter (mm)</label>
                                    <input type="number" id="bangle-diameter" className="form-input" value={formData.bangleDiameter} onChange={handleInputChange} step="0.1" />
                                </div>
                            ) : (
                                <div className="grid grid-2">
                                    <div>
                                        <label className="form-label">Height (mm)</label>
                                        <input type="number" id="bangle-height" className="form-input" value={formData.bangleHeight} onChange={handleInputChange} step="0.1" />
                                    </div>
                                    <div>
                                        <label className="form-label">Width (mm)</label>
                                        <input type="number" id="bangle-width" className="form-input" value={formData.bangleWidth} onChange={handleInputChange} step="0.1" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <input type="checkbox" id="use-bangle-profiles" checked={formData.useBangleProfiles} onChange={handleInputChange} /> Use Bangle Profiles?
                            </label>
                        </div>
                    </section>
                )}

                {/* Bracelet Specs */}
                {formData.category === 'Bracelet' && (formData.braceletType === 'Tennis Bracelets' || formData.braceletType === 'Original Angel' || formData.braceletType === 'B Bold' || formData.braceletType === 'Timeless Classics') && (
                    <section className="section">
                        <h2 className="section-title">Bracelet Specifications</h2>
                        <div className="form-group">
                            <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Select your size</h3>
                            <div className="grid grid-4">
                                {Object.keys(BRACELET_SIZES).map(size => (
                                    <div
                                        key={size}
                                        className={`size-card ${formData.braceletSize === size ? 'active' : ''}`}
                                        onClick={() => handleBraceletSizeSelect(size)}
                                    >
                                        <span className="size-card-name">{size}</span>
                                        <span className="size-card-dims">{BRACELET_SIZES[size].in} in. | {BRACELET_SIZES[size].cm} cm</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {formData.braceletType === 'Tennis Bracelets' && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Tennis Bracelet Details</h3>
                                <div className="form-group">
                                    <label className="form-label">Stone Diameter (mm)</label>
                                    <input type="number" id="stone-diameter" className="form-input" value={formData.stoneDiameter} onChange={handleInputChange} step="0.1" style={{ maxWidth: '200px' }} />
                                </div>
                                <div className="info-box">
                                    <p className="info-text">Based on a {formData.braceletSize} size, you require approximately {formData.estimatedGemCount} gems.</p>
                                </div>
                            </div>
                        )}
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
                            <div className="form-group">
                                <label className="form-label">Estimated Stone Count</label>
                                <input type="text" className="form-input" value={formData.stoneCount} readOnly />
                            </div>
                        </div>
                        <div className="info-box">
                            <p className="info-text">Using Gem 1 Width at {formData.gems[0]?.width || '3.0'}mm you need approximately {formData.stoneCount} gems.</p>
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

            {/* Admin Login Modal */}
            {admin.showLoginModal && (
                <div className="modal-overlay">
                    <div className="modal login-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Admin Login</h2>
                            <button className="modal-close" onClick={() => setAdmin(prev => ({ ...prev, showLoginModal: false }))}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="login-form">
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={admin.passwordInput}
                                        onChange={(e) => setAdmin(prev => ({ ...prev, passwordInput: e.target.value }))}
                                        placeholder="Enter admin password"
                                    />
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAdminLogin}>
                                    <i className="fas fa-sign-in-alt"></i> Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Panel Modal - Simplified for now */}
            {admin.showPanelModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '1000px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Admin Panel <span className="admin-indicator">ADMIN MODE</span></h2>
                            <button className="modal-close" onClick={() => setAdmin(prev => ({ ...prev, showPanelModal: false }))}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="admin-panel">
                                <p>Admin functionality (image management) is partially implemented in this React version. You can extend this to manage custom images.</p>
                                {/* Add Image Management UI here if needed */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BriefWizard;
