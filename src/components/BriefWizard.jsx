import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { briefsAPI, usersAPI, productsAPI } from '../services/api';
import ProductSearch from './ProductSearch';
import SummaryView from './SummaryView';
import ProductSlider from './ProductSlider';
import './BriefWizard.css';

// Constants
const CATEGORIES = ['Ring', 'Earring', 'Necklace and Pendant', 'Bracelet'];
const RING_TYPES = ['Engagement Rings', 'Dress Rings', 'Mens Wedding Bands', 'Womens Wedding Bands and Eternity Rings'];
const EARRING_TYPES = ['Diamond Studs', 'Drops', 'Hoops', 'Original Angel'];
const NECKLACE_TYPES = ['Original Angel', 'Original Angel Colour', 'Angel Art', 'Diamond Trilogy'];
const BRACELET_TYPES = ['Bangles', 'Tennis Bracelets', 'Original Angel', 'B Bold', 'Timeless Classics'];
const GEM_TYPES = ['Diamond', 'Sapphire', 'Ruby', 'Emerald', 'Tanzanite', 'Morganite'];
const GEM_SHAPES = ['Round', 'Oval', 'Cushion', 'Princess', 'Emerald', 'Pear', 'Marquise', 'Radiant', 'Asscher', 'Heart'];
const DIAMOND_COLOR_GRADES = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const DIAMOND_CLARITY_GRADES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
const PART_OPTIONS = ['Shank', 'Head', 'Prongs', 'Bezel', 'Halo', 'Gallery', 'Shoulders'];
const DIAMOND_COVERAGE_OPTIONS = ['25%', '50%', '75%', '100%'];
const EARRING_CLOSURES = ['Stud Back', 'Hook', 'Lever Back', 'Clip-On', 'French Wire', 'Hinged Hoop'];
const NECKLACE_LENGTHS = ['14" (Choker)', '16" (Collar)', '18" (Princess)', '20" (Matinee)', '24" (Opera)', '30"+ (Rope)'];

const BROWNS_STORES = [
    // Gauteng - Johannesburg
    'Sandton City Shopping Centre',
    'Nelson Mandela Square',
    'Rosebank Mall',
    'Hyde Park Corner',
    'Mall of Africa',
    'Fourways Mall',
    'Eastgate Shopping Centre',
    'Cresta Shopping Centre',
    'Clearwater Mall',
    'Bedford Centre',
    'Cradlestone Mall',
    'Mall of the South',
    'Waterfall Mall',
    'Vaal Mall',
    'OR Tambo International Airport',
    // Gauteng - Pretoria
    'Menlyn Park Shopping Centre',
    'Woodlands Boulevard Shopping Centre',
    'Centurion Mall',
    'Brooklyn Mall',
    // North West
    'The Palace of the Lost City',
    // Limpopo
    'Mall of the North',
    // Mpumalanga
    "i'langa Mall",
    // KwaZulu-Natal
    'The Pavilion Shopping Centre',
    'Gateway Theatre of Shopping',
    'La Lucia Mall',
    'Galleria Mall',
    'Ballito Junction Mall',
    'The Midlands Mall',
    // Western Cape
    'V&A Waterfront',
    'Cavendish Square',
    'Canal Walk Shopping Centre',
    'Tyger Valley Shopping Centre',
    'Somerset Mall',
    'Garden Route Mall',
    'Cape Town International Airport'
];



const RING_DESIGNS = {
    'Engagement Rings': ['Solitaire', 'Halo', 'Trilogy', 'Vintage', 'Side Stones'],
    'Dress Rings': ['Cocktail', 'Statement', 'Stackable'],
    'Mens Wedding Bands': ['Classic', 'Modern', 'Patterned'],
    'Womens Wedding Bands and Eternity Rings': ['Classic', 'Diamond', 'Curved']
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
        budget: '',
        category: '',
        ringType: '',
        ringDesign: '',

        earringType: '',
        earringClosure: '', // NEW: Earring closure type
        necklaceType: '',
        necklaceLength: '', // NEW: Necklace length
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
        engravingFont: 'Regular', // NEW: Font style for engraving
        logo: null,
        diamondCoverage: '',
        stoneCount: '',
        estimatedGemCount: '',
        stoneDiameter: ''
    });

    const [uiState, setUiState] = useState({
        showSummaryModal: false
    });

    // State for dynamic product lists
    const [mensWeddingBands, setMensWeddingBands] = useState([]);
    const [dressRings, setDressRings] = useState([]);
    const [engagementRings, setEngagementRings] = useState([]);
    const [womensWeddingBands, setWomensWeddingBands] = useState([]);
    const [diamondStuds, setDiamondStuds] = useState([]);
    const [drops, setDrops] = useState([]);
    const [hoops, setHoops] = useState([]);
    const [originalAngel, setOriginalAngel] = useState([]);
    const [lookingUpClient, setLookingUpClient] = useState(false);
    const [clientLookupMessage, setClientLookupMessage] = useState(null);

    // Selection Handlers
    const handleMensRingSelect = (ring) => {
        setFormData(prev => ({
            ...prev,
            ringDesign: ring.name,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Band: ${ring.name} (SKU: ${ring.sku})`
        }));
    };

    const handleDressRingSelect = (ring) => {
        setFormData(prev => ({
            ...prev,
            ringDesign: ring.name,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Ring: ${ring.name} (SKU: ${ring.sku})`
        }));
    };

    const handleEngagementRingSelect = (ring) => {
        setFormData(prev => ({
            ...prev,
            ringDesign: ring.name,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Engagement Ring: ${ring.name} (SKU: ${ring.sku})`
        }));
    };

    const handleWomensRingSelect = (ring) => {
        setFormData(prev => ({
            ...prev,
            ringDesign: ring.name,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Womens Wedding Band: ${ring.name} (SKU: ${ring.sku})`
        }));
    };

    const handleDiamondStudsSelect = (stud) => {
        setFormData(prev => ({
            ...prev,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Diamond Stud: ${stud.name} (SKU: ${stud.sku})`
        }));
    };

    const handleDropsSelect = (drop) => {
        setFormData(prev => ({
            ...prev,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Earring: ${drop.name} (SKU: ${drop.sku})`
        }));
    };

    const handleHoopsSelect = (hoop) => {
        setFormData(prev => ({
            ...prev,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Earring: ${hoop.name} (SKU: ${hoop.sku})`
        }));
    };

    const handleOriginalAngelSelect = (angel) => {
        setFormData(prev => ({
            ...prev,
            description: `${prev.description ? prev.description + '\n' : ''}Selected Earring: ${angel.name} (SKU: ${angel.sku})`
        }));
    };

    // Lookup client by Profile Number (format: AA092275)
    const handleLookupClient = async () => {
        if (!formData.clientProfile) return;

        setLookingUpClient(true);
        setClientLookupMessage(null);

        try {
            const response = await api.post('/messages/lookup-client', {
                profile_number: formData.clientProfile.toUpperCase()
            });

            // Auto-populate client data
            setFormData(prev => ({
                ...prev,
                clientName: response.data.client.name || prev.clientName,
                clientEmail: response.data.client.email || prev.clientEmail,
                clientContact: response.data.client.contact_number || prev.clientContact,
                clientProfile: response.data.client.profile_number || prev.clientProfile
            }));

            const briefCount = response.data.briefs?.length || 0;
            setClientLookupMessage({
                type: 'success',
                text: `✓ Found: ${response.data.client.name} (${briefCount} existing brief${briefCount !== 1 ? 's' : ''})`
            });
        } catch (error) {
            setClientLookupMessage({
                type: 'error',
                text: error.response?.data?.message || 'Client not found'
            });
        } finally {
            setLookingUpClient(false);
        }
    };

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [mens, dress, engagement, womens, studs, dropsData, hoopsData, originalAngelData] = await Promise.all([
                    productsAPI.getAll({ category: 'Ring', sub_category: 'Mens Wedding Bands' }),
                    productsAPI.getAll({ category: 'Ring', sub_category: 'Dress Rings' }),
                    productsAPI.getAll({ category: 'Ring', sub_category: 'Engagement Rings' }),
                    productsAPI.getAll({ category: 'Ring', sub_category: 'Womens Wedding Bands and Eternity Rings' }),
                    productsAPI.getAll({ category: 'Earring', sub_category: 'Diamond Studs' }),
                    productsAPI.getAll({ category: 'Earring', sub_category: 'Drops' }),
                    productsAPI.getAll({ category: 'Earring', sub_category: 'Hoops' }),
                    productsAPI.getAll({ category: 'Earring', sub_category: 'Original Angel' })
                ]);

                setMensWeddingBands(mens.data.products || []);
                setDressRings(dress.data.products || []);
                setEngagementRings(engagement.data.products || []);
                setWomensWeddingBands(womens.data.products || []);
                setDiamondStuds(studs.data.products || []);
                setDrops(dropsData.data.products || []);
                setHoops(hoopsData.data.products || []);
                setOriginalAngel(originalAngelData.data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Fetch consultant info on mount
    useEffect(() => {
        const fetchConsultantInfo = async () => {
            try {
                const response = await usersAPI.getMe();
                const user = response.data.user;
                const nameParts = (user.name || '').split(' ');
                setFormData(prev => ({
                    ...prev,
                    consultantName: nameParts[0] || '',
                    consultantSurname: nameParts.slice(1).join(' ') || ''
                }));
            } catch (error) {
                console.error('Error fetching consultant info:', error);
            }
        };
        fetchConsultantInfo();
    }, []);

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

    // Default images for specific items
    const DEFAULT_IMAGES = {
        // Categories
        'categories_Ring': 'https://brownsjewellers.com/cdn/shop/files/MC9556PT_1_51e4beda-39d1-4156-8a47-e02dc890769e.png?v=1760594033&width=800',
        'categories_Earring': 'https://brownsjewellers.com/cdn/shop/files/9487T_1.png?v=1760585830&width=800',
        'categories_Necklace and Pendant': 'https://brownsjewellers.com/cdn/shop/files/mc9345t.png?v=1760584837&width=1600',
        'categories_Bracelet': 'https://brownsjewellers.com/cdn/shop/files/TTBM_1.png?v=1760593019&width=800',

        // Ring Types
        'ringTypes_Engagement Rings': 'https://brownsjewellers.com/cdn/shop/files/MC9556PT_1_51e4beda-39d1-4156-8a47-e02dc890769e.png?v=1760594033&width=800', // Use main Ring image
        'ringTypes_Dress Rings': 'https://brownsjewellers.com/cdn/shop/files/MC9556PT_1_51e4beda-39d1-4156-8a47-e02dc890769e.png?v=1760594033&width=800', // Use main Ring image
        'ringTypes_Mens Wedding Bands': 'https://brownsjewellers.com/cdn/shop/files/9754P_1.png?v=1760963607&width=1600',
        'ringTypes_Womens Wedding Bands and Eternity Rings': 'https://brownsjewellers.com/cdn/shop/files/MC9556PT_1_51e4beda-39d1-4156-8a47-e02dc890769e.png?v=1760594033&width=800', // Use main Ring image

        // Earring Types
        'earringTypes_Diamond Studs': 'https://brownsjewellers.com/cdn/shop/files/9487T_1.png?v=1760585830&width=800', // Use main Earring image
        'earringTypes_Drops': 'https://brownsjewellers.com/cdn/shop/files/9487T_1.png?v=1760585830&width=800', // Use main Earring image
        'earringTypes_Hoops': 'https://brownsjewellers.com/cdn/shop/files/9487T_1.png?v=1760585830&width=800', // Use main Earring image
        'earringTypes_Original Angel': 'https://brownsjewellers.com/cdn/shop/files/9401T_1.png?v=1760584862&width=1600',

        // Necklace Types
        'necklaceTypes_Original Angel': 'https://brownsjewellers.com/cdn/shop/files/9746T_38b95e38-c522-4606-961d-7340e1f3ff41.png?v=1760586076&width=1600',
        'necklaceTypes_Original Angel Colour': 'https://brownsjewellers.com/cdn/shop/files/10067TZRW_1.png?v=1760584638&width=800',
        'necklaceTypes_Angel Art': 'https://brownsjewellers.com/cdn/shop/files/9953y.png?v=1760585554&width=1600',
        'necklaceTypes_Diamond Trilogy': 'https://brownsjewellers.com/cdn/shop/files/9832PT_1_26001f86-b1cd-4bd9-bd6f-41b47f7647f3.png?v=1760598388&width=800',

        // Bracelet Types
        'braceletTypes_Bangles': 'https://brownsjewellers.com/cdn/shop/files/TTBM_1.png?v=1760593019&width=800', // Use main Bracelet image
        'braceletTypes_Tennis Bracelets': 'https://brownsjewellers.com/cdn/shop/files/TTBM_1.png?v=1760593019&width=800', // Use main Bracelet image
        'braceletTypes_Original Angel': 'https://brownsjewellers.com/cdn/shop/files/TTBM_1.png?v=1760593019&width=800', // Use main Bracelet image
        'braceletTypes_B Bold': 'https://brownsjewellers.com/cdn/shop/files/TTBM_1.png?v=1760593019&width=800', // Use main Bracelet image
        'braceletTypes_Timeless Classics': 'https://brownsjewellers.com/cdn/shop/files/TTBM_1.png?v=1760593019&width=800' // Use main Bracelet image
    };

    // Helper to get images
    const getImage = (type, key) => {
        const customKey = `${type}_${key}`;
        // Priority: custom image > default image > placeholder
        return customImages[customKey] || DEFAULT_IMAGES[customKey] || `https://placehold.co/400x400?text=${encodeURIComponent(key)}`;
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
                            <div className="profile-lookup-input">
                                <input
                                    type="text"
                                    id="clientProfile"
                                    className="form-input"
                                    value={formData.clientProfile}
                                    onChange={handleInputChange}
                                    placeholder="e.g. AA092275"
                                    style={{ textTransform: 'uppercase' }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-lookup"
                                    onClick={handleLookupClient}
                                    disabled={lookingUpClient || !formData.clientProfile}
                                >
                                    {lookingUpClient ? 'Looking...' : 'Lookup'}
                                </button>
                            </div>
                            {clientLookupMessage && (
                                <span className={`lookup-message ${clientLookupMessage.type}`}>
                                    {clientLookupMessage.text}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Budget Range</label>
                            <select id="budget" className="form-select" value={formData.budget} onChange={handleInputChange}>
                                <option value="">Select Budget</option>
                                <option value="Under R20,000">Under R20,000</option>
                                <option value="R20,000 - R50,000">R20,000 - R50,000</option>
                                <option value="R50,000 - R100,000">R50,000 - R100,000</option>
                                <option value="R100,000 - R200,000">R100,000 - R200,000</option>
                                <option value="R200,000+">R200,000+</option>
                            </select>
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
                        <label className="form-label">Browns Boutique Location</label>
                        <select id="storeName" className="form-select" value={formData.storeName} onChange={handleInputChange}>
                            <option value="">Select Store Location</option>
                            {BROWNS_STORES.map(store => (
                                <option key={store} value={store}>{store}</option>
                            ))}
                        </select>
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
                        <div className="grid grid-4">
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
                    <>
                        <section className="section" style={{ paddingBottom: '0', position: 'relative', zIndex: 5 }}>
                            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                <ProductSearch
                                    category="Ring"
                                    subCategory={formData.ringType}
                                    onSelect={(product) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            ringDesign: product.name,
                                            description: `${prev.description ? prev.description + '\n' : ''}Selected Ring: ${product.name} (SKU: ${product.sku})`
                                        }));
                                    }}
                                />
                            </div>
                        </section>

                        <section className="section">
                            <h2 className="section-title">Select {formData.ringType} Design</h2>

                            {formData.ringType === 'Engagement Rings' ? (
                                <ProductSlider
                                    products={engagementRings}
                                    onSelect={handleEngagementRingSelect}
                                    selectedSku={engagementRings.find(r => r.name === formData.ringDesign)?.sku}
                                />
                            ) : formData.ringType === 'Womens Wedding Bands and Eternity Rings' ? (
                                <ProductSlider
                                    products={womensWeddingBands}
                                    onSelect={handleWomensRingSelect}
                                    selectedSku={womensWeddingBands.find(r => r.name === formData.ringDesign)?.sku}
                                />
                            ) : formData.ringType === 'Mens Wedding Bands' ? (
                                <ProductSlider
                                    products={mensWeddingBands}
                                    onSelect={handleMensRingSelect}
                                    selectedSku={mensWeddingBands.find(r => r.name === formData.ringDesign)?.sku}
                                />
                            ) : formData.ringType === 'Dress Rings' ? (
                                <ProductSlider
                                    products={dressRings}
                                    onSelect={handleDressRingSelect}
                                    selectedSku={dressRings.find(r => r.name === formData.ringDesign)?.sku}
                                />
                            ) : (
                                renderCarousel(RING_DESIGNS[formData.ringType], formData.ringDesign, handleRingDesignSelect, formData.ringType, 'ringDesigns')
                            )}
                        </section>
                    </>
                )
                }

                {/* Earring Type Selection */}
                {
                    formData.category === 'Earring' && (
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
                            {formData.earringType && (
                                <div style={{ marginTop: '1rem' }}>
                                </div>
                            )}

                            {/* Diamond Studs Slider */}
                            {formData.earringType === 'Diamond Studs' && (
                                <>
                                    <div className="section" style={{ paddingBottom: '0', position: 'relative', zIndex: 5 }}>
                                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                            <ProductSearch
                                                category="Earring"
                                                subCategory="Diamond Studs"
                                                onSelect={(product) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        // For earrings, we might not have a 'design' field per se, but we can use description
                                                        description: `${prev.description ? prev.description + '\n' : ''}Selected Earring: ${product.name} (SKU: ${product.sku})`
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <h2 className="section-title" style={{ marginTop: '2rem' }}>Select Diamond Studs Design</h2>
                                    <ProductSlider
                                        products={diamondStuds}
                                        onSelect={handleDiamondStudsSelect}
                                        selectedSku={null}
                                    />
                                </>
                            )}

                            {/* Drops Slider */}
                            {formData.earringType === 'Drops' && (
                                <>
                                    <div className="section" style={{ paddingBottom: '0', position: 'relative', zIndex: 5 }}>
                                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                            <ProductSearch
                                                category="Earring"
                                                subCategory="Drops"
                                                onSelect={(product) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        description: `${prev.description ? prev.description + '\n' : ''}Selected Earring: ${product.name} (SKU: ${product.sku})`
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <h2 className="section-title" style={{ marginTop: '2rem' }}>Select Drops Design</h2>
                                    <ProductSlider
                                        products={drops}
                                        onSelect={handleDropsSelect}
                                        selectedSku={null}
                                    />
                                </>
                            )}

                            {/* Hoops Slider */}
                            {formData.earringType === 'Hoops' && (
                                <>
                                    <div className="section" style={{ paddingBottom: '0', position: 'relative', zIndex: 5 }}>
                                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                            <ProductSearch
                                                category="Earring"
                                                subCategory="Hoops"
                                                onSelect={(product) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        description: `${prev.description ? prev.description + '\n' : ''}Selected Earring: ${product.name} (SKU: ${product.sku})`
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <h2 className="section-title" style={{ marginTop: '2rem' }}>Select Hoops Design</h2>
                                    <ProductSlider
                                        products={hoops}
                                        onSelect={handleHoopsSelect}
                                        selectedSku={null}
                                    />
                                </>
                            )}

                            {/* Original Angel Slider */}
                            {formData.earringType === 'Original Angel' && (
                                <>
                                    <div className="section" style={{ paddingBottom: '0', position: 'relative', zIndex: 5 }}>
                                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                            <ProductSearch
                                                category="Earring"
                                                subCategory="Original Angel"
                                                onSelect={(product) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        description: `${prev.description ? prev.description + '\n' : ''}Selected Earring: ${product.name} (SKU: ${product.sku})`
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <h2 className="section-title" style={{ marginTop: '2rem' }}>Select Original Angel Design</h2>
                                    <ProductSlider
                                        products={originalAngel}
                                        onSelect={handleOriginalAngelSelect}
                                        selectedSku={null}
                                    />
                                </>
                            )}
                        </section>
                    )
                }

                {/* Necklace Type Selection */}
                {
                    formData.category === 'Necklace and Pendant' && (
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
                            {formData.necklaceType && (
                                <div className="grid grid-2" style={{ marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Chain/Necklace Length</label>
                                        <select
                                            id="necklaceLength"
                                            className="form-select"
                                            value={formData.necklaceLength}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Length</option>
                                            {NECKLACE_LENGTHS.map(length => (
                                                <option key={length} value={length}>{length}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </section>
                    )
                }

                {/* Bracelet Type Selection */}
                {
                    formData.category === 'Bracelet' && (
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
                    )
                }

                {/* Ring Size */}
                {
                    formData.category === 'Ring' && formData.ringDesign && (
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
                    )
                }

                {/* Diamond Band Specs */}
                {
                    formData.category === 'Ring' && (formData.ringDesign === 'Womens Wedding Bands and Eternity Rings' || formData.ringDesign === 'Diamond Band') && (
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
                    )
                }

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

                    {/* Font Selection */}
                    <div className="form-group">
                        <label className="form-label">Choose your font</label>
                        <div className="grid grid-2" style={{ gap: '1rem', marginTop: '0.75rem' }}>
                            <div
                                className={`visual-card-select ${formData.engravingFont === 'Regular' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, engravingFont: 'Regular' }))}
                                style={{
                                    padding: '2rem',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    border: formData.engravingFont === 'Regular' ? '2px solid #007bff' : '2px solid #e0e0e0',
                                    borderRadius: '0.5rem',
                                    background: formData.engravingFont === 'Regular' ? '#f0f7ff' : '#fff',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ fontSize: '2rem', fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem' }}>
                                    ABC abc 123
                                </div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>
                                    Regular
                                </div>
                            </div>

                            <div
                                className={`visual-card-select ${formData.engravingFont === 'Italic' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, engravingFont: 'Italic' }))}
                                style={{
                                    padding: '2rem',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    border: formData.engravingFont === 'Italic' ? '2px solid #007bff' : '2px solid #e0e0e0',
                                    borderRadius: '0.5rem',
                                    background: formData.engravingFont === 'Italic' ? '#f0f7ff' : '#fff',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                                    ABC abc 123
                                </div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>
                                    Italic
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Engraving Text Input */}
                    <div className="form-group">
                        <label className="form-label">Type your engraving</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                id="engraving"
                                className="form-input"
                                value={formData.engraving}
                                onChange={handleInputChange}
                                placeholder="e.g. Forever & Always, John ❤️ Jane"
                                maxLength="50"
                                style={{
                                    fontStyle: formData.engravingFont === 'Italic' ? 'italic' : 'normal',
                                    fontFamily: formData.engravingFont === 'Italic' ? 'Georgia, serif' : 'Arial, sans-serif',
                                    fontSize: '1.125rem',
                                    paddingRight: '5rem'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '0.75rem',
                                color: '#999'
                            }}>
                                {formData.engraving.length}/50
                            </div>
                        </div>
                        <div style={{
                            marginTop: '0.75rem',
                            padding: '1.5rem',
                            background: '#f9f9f9',
                            borderRadius: '0.5rem',
                            border: '1px solid #e0e0e0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Preview
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontStyle: formData.engravingFont === 'Italic' ? 'italic' : 'normal',
                                fontFamily: formData.engravingFont === 'Italic' ? 'Georgia, serif' : 'Arial, sans-serif',
                                color: formData.engraving ? '#333' : '#ccc',
                                minHeight: '2rem'
                            }}>
                                {formData.engraving || 'Your engraving will appear here'}
                            </div>
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Or upload a logo</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input type="file" id="logo-upload" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                            <button className="btn btn-secondary" onClick={() => document.getElementById('logo-upload').click()}>
                                <i className="fas fa-upload" style={{ marginRight: '0.5rem' }}></i>
                                Upload Logo
                            </button>
                            {formData.logo && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: '#f9f9f9',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <img src={formData.logo} alt="Logo" style={{
                                        height: '4rem',
                                        width: '4rem',
                                        objectFit: 'contain',
                                        border: '1px solid #ddd',
                                        borderRadius: '0.375rem',
                                        background: '#fff'
                                    }} />
                                    <button className="btn btn-danger" onClick={() => setFormData(prev => ({ ...prev, logo: null }))}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main >

            {/* Summary Modal */}
            {
                uiState.showSummaryModal && (
                    <SummaryView
                        formData={formData}
                        onClose={() => setUiState(prev => ({ ...prev, showSummaryModal: false }))}
                    />
                )
            }
        </div >
    );
};

export default BriefWizard;
