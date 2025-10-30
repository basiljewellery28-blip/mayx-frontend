import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Constants (Moved from old script) ---
const categories = ['Ring', 'Earring', 'Necklaces and Pendants', 'Bracelet'];
const ringTypes = ['Solitaire', 'Classic Trilogy', 'Today & Forever', 'Queen of my heart', 'Angel Halo', 'Womens Wedding Bands and Eternity Rings'];
const earringTypes = ['Hoops', 'Drops', 'Studs', 'Original Angel', 'Angel Art', 'B Bold'];
const necklaceTypes = ['Angel Art', 'Blossom', 'Chorus', 'Journey', 'Multistone', 'Protea'];
const braceletTypes = ['Tennis Bracelets', 'Bangles', 'Original Angel', 'B Bold', 'Timeless Classics'];
const braceletSizes = {
    'Small': { in: '5.26 - 5.75', cm: '13.4 - 14.6', smartCm: '14.6' },
    'Medium': { in: '5.76 - 6.25', cm: '14.6 - 15.9', smartCm: '15.9' },
    'Large': { in: '6.26 - 6.75', cm: '15.9 - 17.1', smartCm: '17.1' },
    'Extra Large': { in: '6.76 - 7.25', cm: '17.2 - 18.4', smartCm: '18.4' }
};
const diamondCoverageOptions = ['25%', '50%', '70%', '100%'];
const sizeSystems = ['British/Australian', 'South Africa', 'US/Canada', 'French/Russian', 'German', 'Japanese', 'Swiss'];
const gemTypes = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Other'];
const gemShapes = ['Round', 'Princess', 'Oval', 'Pear', 'Marquise', 'Cushion', 'Emerald', 'Asscher', 'Radiant', 'Heart'];
const diamondColorGrades = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const diamondClarityGrades = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
const diamondCutGrades = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
const partOptions = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5'];

const categoryImages = {
    'Ring': 'images/category-ring.jpg',
    'Earring': 'images/category-earrings.jpg',
    'Necklaces and Pendants': 'images/category-necklaces.jpg',
    'Bracelet': 'images/category-bracelet.jpg'
};

const ringTypeImages = {
    'Solitaire': 'images/solitaire.jpg',
    'Classic Trilogy': 'images/classic trilogy.jpg',
    'Today & Forever': 'images/today and forever.jpg',
    'Queen of my heart': 'images/queen of my heart.jpg',
    'Angel Halo': 'images/angel halo.jpg',
    'Womens Wedding Bands and Eternity Rings': 'images/womens wedding and eternity bands.jpg'
};

const earringTypeImages = {
    'Hoops': 'images/hoops.jpg',
    'Drops': 'images/drops.jpg',
    'Studs': 'images/studs.jpg',
    'Original Angel': 'images/original-angel.jpg',
    'Angel Art': 'images/angel-art.jpg',
    'B Bold': 'images/b-bold.jpg'
};

const necklaceTypeImages = {
    'Angel Art': 'images/aangel-art.jpg',
    'Blossom': 'images/blossom.jpg',
    'Chorus': 'images/chorus.jpg',
    'Journey': 'images/journey.jpg',
    'Multistone': 'images/multistone.jpg',
    'Protea': 'images/protea.jpg'
};

const braceletTypeImages = {
    'Tennis Bracelets': 'images/tennis.jpg',
    'Bangles': 'images/bangle.jpg',
    'Original Angel': 'images/ooriginal-angel.jpg',
    'B Bold': 'images/bb-bold.jpg',
    'Timeless Classics': 'images/timeless.jpg'
};

const alloyOptions = [
    '18ct Yellow Gold', '18ct White Gold', '18ct Rose Gold', '18ct Green Gold',
    '14ct Yellow Gold', '14ct White Gold', '14ct Rose Gold', '10ct Yellow Gold',
    '9ct Yellow Gold', '9ct White Gold', '9ct Rose Gold', '22ct Yellow Gold',
    '24ct Yellow Gold', 'Platinum 950', 'Platinum 900', 'Platinum Iridium 95%',
    'Palladium 950', 'Palladium 500', 'Sterling Silver (925)', 'Fine Silver (999)',
    'Argentium Silver', 'Titanium', 'Tungsten Carbide', 'Cobalt Chrome', 'Stainless Steel', 'Tantalum'
];

const ringSizeData = {
    'British/Australian': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    'South Africa': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Z+1', 'Z+2', 'Z+3', 'Z+4'],
    'US/Canada': ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    'French/Russian': ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
    'German': ['41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
    'Japanese': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    'Swiss': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
};

const diameters = {
    'British/Australian': { 'A': '12.0', 'B': '12.4', 'C': '12.8', 'D': '13.2', 'E': '13.5', 'F': '13.9', 'G': '14.3', 'H': '14.7', 'I': '15.1', 'J': '15.5', 'K': '15.9', 'L': '16.3', 'M': '16.7', 'N': '17.1', 'O': '17.5', 'P': '17.9', 'Q': '18.3', 'R': '18.7', 'S': '19.1', 'T': '19.4', 'U': '19.8', 'V': '20.2', 'W': '20.6', 'X': '21.0', 'Y': '21.4', 'Z': '21.8' },
    'South Africa': { 'A': '12.0', 'B': '12.4', 'C': '12.8', 'D': '13.2', 'E': '13.5', 'F': '13.9', 'G': '14.3', 'H': '14.7', 'I': '15.1', 'J': '15.5', 'K': '15.9', 'L': '16.3', 'M': '16.7', 'N': '17.1', 'O': '17.5', 'P': '17.9', 'Q': '18.3', 'R': '18.7', 'S': '19.1', 'T': '19.4', 'U': '19.8', 'V': '20.2', 'W': '20.6', 'X': '21.0', 'Y': '21.4', 'Z': '21.8', 'Z+1': '22.2', 'Z+2': '22.6', 'Z+3': '23.0', 'Z+4': '23.4' },
    'US/Canada': { '3': '14.5', '3.5': '14.9', '4': '15.3', '4.5': '15.7', '5': '16.1', '5.5': '16.5', '6': '16.9', '6.5': '17.3', '7': '17.7', '7.5': '18.1', '8': '18.5', '8.5': '18.9', '9': '19.3', '9.5': '19.7', '10': '20.1', '10.5': '20.5', '11': '20.9', '11.5': '21.3', '12': '21.7' },
    'French/Russian': { '40': '13.1', '41': '13.5', '42': '13.8', '43': '14.1', '44': '14.4', '45': '14.7', '46': '15.0', '47': '15.3', '48': '15.7', '49': '16.0', '50': '16.3', '51': '16.6', '52': '17.0', '53': '17.3', '54': '17.6', '55': '17.9', '56': '18.2', '57': '18.5', '58': '18.9', '59': '19.2', '60': '19.5' },
    'German': { '41': '13.5', '42': '13.8', '43': '14.1', '44': '14.4', '45': '14.7', '46': '15.0', '47': '15.3', '48': '15.7', '49': '16.0', '50': '16.3', '51': '16.6', '52': '17.0', '53': '17.3', '54': '17.6', '55': '17.9', '56': '18.2', '57': '18.5', '58': '18.9', '59': '19.2', '60': '19.5' },
    'Japanese': { '1': '12.5', '2': '12.9', '3': '13.3', '4': '13.7', '5': '14.1', '6': '14.5', '7': '14.9', '8': '15.3', '9': '15.7', '10': '16.1', '11': '16.5', '12': '16.9', '13': '17.3', '14': '17.7', '15': '18.1', '16': '18.5', '17': '18.9', '18': '19.3', '19': '19.7', '20': '20.1' },
    'Swiss': { '1': '13.1', '2': '13.4', '3': '13.7', '4': '14.1', '5': '14.4', '6': '14.7', '7': '15.0', '8': '15.4', '9': '15.7', '10': '16.0', '11': '16.3', '12': '16.6', '13': '17.0', '14': '17.3', '15': '17.6', '16': '17.9', '17': '18.2', '18': '18.6', '19': '18.9', '20': '19.2' }
};

// --- React Component ---

function BriefWizard() {

    // --- State Management ---
    // Top-level categories
    const [category, setCategory] = useState('');
    const [ringType, setRingType] = useState('');
    const [earringType, setEarringType] = useState('');
    const [necklaceType, setNecklaceType] = useState('');
    const [braceletType, setBraceletType] = useState('');

    // Ring Size
    const [sizeSystem, setSizeSystem] = useState('British/Australian');
    const [availableSizes, setAvailableSizes] = useState(ringSizeData['British/Australian']);
    const [sizeValue, setSizeValue] = useState('N');
    const [diameter, setDiameter] = useState('16.92');

    // Bangle/Cuff
    const [bangleShape, setBangleShape] = useState('Round');
    const [bangleDiameter, setBangleDiameter] = useState('65.0');
    const [bangleHeight, setBangleHeight] = useState('45.0');
    const [bangleWidth, setBangleWidth] = useState('55.0');
    const [useBangleProfiles, setUseBangleProfiles] = useState(false);

    // Bracelet Specs
    const [braceletSize, setBraceletSize] = useState('Medium');
    const [braceletLength, setBraceletLength] = useState('15.9');
    const [stoneDiameter, setStoneDiameter] = useState('3.0');
    const [estimatedGemCount, setEstimatedGemCount] = useState('53');

    // Diamond Band
    const [diamondCoverage, setDiamondCoverage] = useState('50%');
    const [stoneCount, setStoneCount] = useState('7');

    // Core Data
    const [gems, setGems] = useState([]);
    const [alloys, setAlloys] = useState([]);
    const [inspirationImages, setInspirationImages] = useState([]);
    const [description, setDescription] = useState('');
    const [engraving, setEngraving] = useState('');
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');

    // Client Details
    const [clientName, setClientName] = useState('');
    const [clientContact, setClientContact] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');

    // UI State (Modals, etc.)
    const [tcwValue, setTcwValue] = useState('0.00');
    const [isTcwVisible, setIsTcwVisible] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isMarkupModalOpen, setIsMarkupModalOpen] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    
    // NEW: API Loading/Error State
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    
    // Markup Tool State
    const [selectedImage, setSelectedImage] = useState(null);
    const [markupMode, setMarkupMode] = useState('draw');
    const [drawColor, setDrawColor] = useState('#FF0000');
    const [penThickness, setPenThickness] = useState(3);
    const [fontSize, setFontSize] = useState(20);
    const [textInput, setTextInput] = useState('');
    const [markupHistory, setMarkupHistory] = useState([]);
    
    // Refs for file inputs and canvas
    const inspirationUploadRef = useRef(null);
    const logoUploadRef = useRef(null);
    const canvasRef = useRef(null);

    // --- Gemology Calculations (useCallback) ---

    const estimateCaratWeight = useCallback((width, length, shape, type) => {
        if (!width) return '';
        const w = parseFloat(width);
        const l = parseFloat(length) || w;

        const sgMap = { 'Ruby': 4.00, 'Sapphire': 4.00, 'Emerald': 2.72, 'Tourmaline': 3.10, 'Garnet': 3.90, 'Diamond': 3.52 };
        const sg = sgMap[type] || 3.52;

        const factorMap = { 'Round': 1.00, 'Oval': 0.785, 'Cushion': 0.90, 'Pear': 0.785, 'Emerald': 0.85, 'Octagon': 1.00, 'Princess': 1.00, 'Asscher': 1.00, 'Marquise': 0.785, 'Heart': 0.70, 'Radiant': 0.90 };
        const factor = factorMap[shape] || 1.0;

        const area = factor * w * l;
        const d_gem = 2 * Math.sqrt(area / Math.PI); // Equivalent round diameter
        const base_carat = Math.pow(d_gem / 6.5, 3);
        const carat = base_carat * (sg / 3.52);

        return carat < 0.1 ? carat.toFixed(4) : carat.toFixed(2);
    }, []);

    const estimateDimensionsFromCarat = useCallback((carat, shape, type) => {
        if (!carat || !shape || !type) return { length: '', width: '' };

        const sgMap = { 'Ruby': 4.00, 'Sapphire': 4.00, 'Emerald': 2.72, 'Tourmaline': 3.10, 'Garnet': 3.90, 'Diamond': 3.52 };
        const sg = sgMap[type] || 3.52;

        const factorMap = { 'Round': 1.00, 'Oval': 0.785, 'Cushion': 0.90, 'Pear': 0.785, 'Emerald': 0.85, 'Octagon': 1.00, 'Princess': 1.00, 'Asscher': 1.00, 'Marquise': 0.785, 'Heart': 0.70, 'Radiant': 0.90 };
        const ratioMap = { 'Round': 1.00, 'Oval': 1.35, 'Cushion': 1.02, 'Pear': 1.45, 'Emerald': 1.35, 'Octagon': 1.00, 'Princess': 1.00, 'Asscher': 1.00, 'Marquise': 2.10, 'Heart': 1.00, 'Radiant': 1.05 };
        
        const factor = factorMap[shape] || 1.0;
        const ratio = ratioMap[shape] || 1.0;

        // d_gem = 6.5 * (carat)^(1/3) * (3.52 / SG)^(1/3)
        const d_gem = 6.5 * Math.pow(carat, 1/3) * Math.pow(3.52 / sg, 1/3);
        
        if (shape === 'Round') {
            return { length: d_gem.toFixed(2), width: d_gem.toFixed(2) };
        }

        const area = Math.PI * Math.pow(d_gem / 2, 2);
        const W = Math.sqrt(area / (factor * ratio));
        const L = ratio * W;

        return { length: L.toFixed(2), width: W.toFixed(2) };
    }, []);

    const calculateTCW = useCallback(() => {
        return gems.reduce((total, gem) => {
            const weight = parseFloat(gem.caratWeight) || 0;
            const qty = parseInt(gem.quantity) || 0;
            return total + (weight * qty);
        }, 0).toFixed(2);
    }, [gems]);

    // --- Logic & Effects ---

    // Update TCW display
    useEffect(() => {
        setTcwValue(calculateTCW());
        setIsTcwVisible(gems.length > 0);
    }, [gems, calculateTCW]);

    // Update available ring sizes when system changes
    useEffect(() => {
        const sizes = ringSizeData[sizeSystem] || [];
        setAvailableSizes(sizes);
        
        if (sizes.length > 0) {
            const newSize = sizes.includes(sizeValue) ? sizeValue : sizes[0];
            setSizeValue(newSize);
            const newDiameter = diameters[sizeSystem]?.[newSize] || '';
            setDiameter(newDiameter);
        }
    }, [sizeSystem, sizeValue]); // Rerun if system changes

    // Update diameter when size value changes
    useEffect(() => {
        const newDiameter = diameters[sizeSystem]?.[sizeValue] || '';
        setDiameter(newDiameter);
    }, [sizeValue, sizeSystem]);

    // Memoize the calculation function
    const updateDiamondBandStoneCount = useCallback(() => {
        const coverageNum = parseFloat(diamondCoverage) || 0;
        const diameterNum = parseFloat(diameter) || 0;

        if (coverageNum > 0 && diameterNum > 0) {
            const circumference = Math.PI * diameterNum;
            let gemWidth = 3.0;
            if (gems.length > 0 && gems[0].width) {
                gemWidth = parseFloat(gems[0].width);
            }
            
            const coverageLength = circumference * (coverageNum / 100);
            const count = Math.round(coverageLength / gemWidth);
            setStoneCount(count.toString());

            // If Gem 1 exists, update its quantity
            if (gems.length > 0 && gems[0].quantity !== count.toString()) {
                setGems(prevGems => {
                    const newGems = [...prevGems];
                    newGems[0] = { ...newGems[0], quantity: count.toString() };
                    return newGems;
                });
            }
        }
    }, [diamondCoverage, diameter, gems]); // removed setGems from deps

    // Run the calculation when dependencies change
    useEffect(() => {
        if (category === 'Ring' && ringType === 'Womens Wedding Bands and Eternity Rings') {
            updateDiamondBandStoneCount();
        }
    }, [category, ringType, diamondCoverage, diameter, gems, updateDiamondBandStoneCount]);

    // --- Event Handlers ---

    // Main category selections
    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    const handleRingTypeSelect = (type) => {
        setRingType(type);
        // If not a band, re-render gems to unlock quantity field
        if (type !== 'Womens Wedding Bands and Eternity Rings' && gems.length > 0) {
            setGems(prevGems => [...prevGems]);
        }
    };

    const handleEarringTypeSelect = (type) => setEarringType(type);
    const handleNecklaceTypeSelect = (type) => setNecklaceType(type);
    const handleBraceletTypeSelect = (type) => setBraceletType(type);
    
    // Size selections
    const handleSizeSystemChange = (e) => setSizeSystem(e.target.value);
    const handleSizeValueChange = (e) => setSizeValue(e.target.value);
    const handleBraceletSizeSelect = (sizeName) => {
        setBraceletSize(sizeName);
        setBraceletLength(braceletSizes[sizeName].smartCm);
    };
    
    // Diamond band coverage
    const handleDiamondCoverageSelect = (coverage) => {
        setDiamondCoverage(coverage);
    };

    // Bangle
    const handleBangleShapeSelect = (shape) => setBangleShape(shape);

    // Gem Handlers
    const handleAddGem = () => {
        const newGem = {
            id: Date.now(),
            type: 'Diamond',
            shape: 'Round',
            width: '',
            length: '',
            caratWeight: '',
            quantity: '1',
            smartAssist: false,
            customerSupplied: false,
            colorGrade: '',
            clarityGrade: '',
            cutGrade: '',
            species: '',
            origin: '',
            treatment: ''
        };
        setGems(prevGems => [...prevGems, newGem]);
    };

    const handleRemoveGem = (id) => {
        setGems(prevGems => prevGems.filter(gem => gem.id !== id));
    };
    
    // This function will be called on BLUR from the text inputs
    const handleGemBlur = (id, field, value) => {
        setGems(prevGems => {
            const newGems = [...prevGems];
            const gem = newGems.find(g => g.id === id);
            if (!gem) return prevGems;

            const oldCarat = parseFloat(gem.caratWeight) || 0;
            gem[field] = value; // Set the value that triggered the blur

            if (gem.smartAssist) {
                if (field === 'width' || field === 'length' || field === 'shape' || field === 'type') {
                    const newCarat = estimateCaratWeight(gem.width, gem.length, gem.shape, gem.type);
                    gem.caratWeight = newCarat;
                } else if (field === 'caratWeight') {
                    const dims = estimateDimensionsFromCarat(gem.caratWeight, gem.shape, gem.type);
                    gem.width = dims.width;
                    gem.length = dims.length;
                }
            }

            // Check if a re-render is needed for grading section
            const newCarat = parseFloat(gem.caratWeight) || 0;
            if ((oldCarat < 0.25 && newCarat >= 0.25) || (oldCarat >= 0.25 && newCarat < 0.25)) {
                // We must re-render the whole list
                return [...newGems];
            }

            // If no re-render, just update the TCW
            setTcwValue(calculateTCW(newGems));
            return newGems;
        });
    };
    
    // This is for inputs that should update state but NOT trigger re-renders or calculations
    const handleGemInput = (id, field, value) => {
         setGems(prevGems => prevGems.map(g => 
            g.id === id ? { ...g, [field]: value } : g
        ));
    };


    // Alloy Handlers
    const handleAddAlloy = () => {
        const newAlloy = {
            id: Date.now(),
            part: 'Part 1',
            component: '',
            alloy: alloyOptions[0]
        };
        setAlloys(prevAlloys => [...prevAlloys, newAlloy]);
    };

    const handleRemoveAlloy = (id) => {
        setAlloys(prevAlloys => prevAlloys.filter(alloy => alloy.id !== id));
    };
    
    const handleAlloyUpdate = (id, field, value) => {
        setAlloys(prevAlloys => prevAlloys.map(a => 
            (a.id === id) ? { ...a, [field]: value } : a
        ));
    };

    // Image Upload Handlers
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImage = {
                    id: Date.now(),
                    src: event.target.result,
                    originalSrc: event.target.result,
                    comment: '',
                    markups: []
                };
                setInspirationImages(prevImages => [...prevImages, newImage]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUpdateImageComment = (id, comment) => {
        setInspirationImages(prevImages => prevImages.map(img =>
            (img.id === id) ? { ...img, comment } : img
        ));
    };

    const handleRemoveImage = (id) => {
        setInspirationImages(prevImages => prevImages.filter(img => img.id !== id));
    };

    // Logo Upload Handlers
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target.result);
                setLogoPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogo(null);
        setLogoPreview('');
        if (logoUploadRef.current) {
            logoUploadRef.current.value = '';
        }
    };
    
    // --- Modal & Action Handlers ---

    const handleSaveBrief = async () => {
        setIsLoading(true);
        setApiError('');
        
        // This is where you'll make the API call
        const token = localStorage.getItem('authToken'); // Get from your auth context
        if (!token) {
            setApiError('You are not logged in. Please log in to save a brief.');
            setIsLoading(false);
            alert('Error: You are not logged in.');
            return;
        }
        
        // 1. Consolidate all state into the final brief object
        const briefData = {
            // ----- TITLE & STATUS (Example) -----
            // You will get client_id and consultant_id from your auth context/routing
            // client_id: 123, 
            // consultant_id: 456,
            title: `${clientName || 'New Client'} - ${category || 'Bespoke Piece'}`,
            status: 'draft',
            
            // ----- WIZARD DATA -----
            category, ringType, earringType, necklaceType, braceletType,
            sizeSystem, sizeValue, diameter,
            bangleShape, bangleDiameter, bangleHeight, bangleWidth, useBangleProfiles,
            braceletSize, braceletLength, stoneDiameter, estimatedGemCount,
            diamondCoverage, stoneCount,
            gems, alloys, 
            inspirationImages, // Note: You may want to upload these separately and send URLs
            description, engraving, 
            logo, // Note: You may want to upload this separately and send a URL
            clientName, clientContact, clientEmail, clientAddress
        };

        console.log("Sending Brief Data:", JSON.stringify(briefData, null, 2));

        // --- LIVE API CALL ---
        // Assumes your frontend package.json has: "proxy": "http://localhost:5000"
        
        try {
            const response = await fetch('/api/briefs', { // Your backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(briefData)
            });

            if (!response.ok) {
                const errorData = await response.json(); // Get error message from backend
                throw new Error(errorData.message || 'Failed to save brief. Please try again.');
            }

            const savedBrief = await response.json();
            alert(`Brief ${savedBrief.brief_number || savedBrief.id} saved successfully!`);
            
            // To navigate on success, uncomment these lines and import 'useNavigate'
            // const navigate = useNavigate();
            // navigate(`/dashboard`);

        } catch (error) {
            console.error('Error saving brief:', error);
            setApiError(error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSummary = () => {
        // This logic is now purely for creating the HTML string for the modal
        const summary = createLuxurySummary();
        setSummaryContent(summary);
        setIsSummaryModalOpen(true);
    };

    const handleSavePdf = () => {
        const summaryHTML = createLuxurySummary();
        
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '800px';
        document.body.appendChild(tempContainer);
        tempContainer.innerHTML = summaryHTML;
        const contentToCapture = tempContainer.querySelector('.luxury-summary');

        // Ensure html2canvas and jspdf are loaded
        if (window.html2canvas && window.jspdf) {
            window.html2canvas(contentToCapture, {
                scale: 2,
                useCORS: true,
                logging: false
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                const imgWidthPx = canvas.width;
                const imgHeightPx = canvas.height;

                const pdf = new jsPDF({
                    orientation: imgWidthPx > imgHeightPx ? 'l' : 'p',
                    unit: 'px',
                    format: [imgWidthPx, imgHeightPx]
                });
                
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidthPx, imgHeightPx);
                pdf.save('MAYX-design-brief.pdf');
                
                document.body.removeChild(tempContainer);
            }).catch(err => {
                console.error("PDF generation failed:", err);
                if (document.body.contains(tempContainer)) {
                    document.body.removeChild(tempContainer);
                }
            });
        } else {
            console.error('html2canvas or jspdf not loaded');
            alert('Error: PDF generation library not found.');
        }
    };
    
    // --- Markup Modal Logic ---

    const openMarkupModal = (img) => {
        setSelectedImage(img);
        setMarkupHistory([JSON.parse(JSON.stringify(img.markups || []))]);
        setIsMarkupModalOpen(true);

        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = img.originalSrc;
            image.onload = () => {
                const maxWidth = 800;
                const maxHeight = 500;
                const { width, height } = calculateAspectRatioFit(image.width, image.height, maxWidth, maxHeight);
                canvas.width = width;
                canvas.height = height;
                redrawCanvas(canvas, ctx, image, img.markups);
            };
        }, 100);
    };

    const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
        const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        return { width: srcWidth * ratio, height: srcHeight * ratio };
    };

    const redrawCanvas = (canvas, ctx, image, markups) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        (markups || []).forEach(markup => {
            if (markup.type === 'path') drawPath(ctx, markup);
            else if (markup.type === 'text') drawText(ctx, markup);
            else if (markup.type === 'arrow') drawArrow(ctx, markup);
        });
    };
    
    const drawPath = (ctx, markup) => {
        ctx.strokeStyle = markup.color;
        ctx.lineWidth = markup.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(markup.points[0].x, markup.points[0].y);
        markup.points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();
    };

    const drawText = (ctx, markup) => {
        ctx.fillStyle = markup.color;
        ctx.font = `${markup.fontSize}px Arial`;
        ctx.fillText(markup.text, markup.x, markup.y);
    };

    const drawArrow = (ctx, markup) => {
        drawPath(ctx, markup);
        if (markup.points.length >= 2) {
            drawArrowHead(ctx, markup.points[markup.points.length - 2], markup.points[markup.points.length - 1], markup.color, markup.thickness);
        }
    };
    
    const drawArrowHead = (ctx, from, to, color, thickness) => {
        const headlen = 15;
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.fill();
    };
    
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        
        let newMarkup;

        if (markupMode === 'draw' || markupMode === 'arrow') {
            newMarkup = {
                type: markupMode === 'arrow' ? 'arrow' : 'path',
                color: drawColor,
                thickness: penThickness,
                points: [{ x, y }]
            };
        } else if (markupMode === 'text' && textInput) {
            newMarkup = {
                type: 'text',
                color: drawColor,
                fontSize: fontSize,
                text: textInput,
                x: x,
                y: y
            };
            setTextInput('');
        }

        if (newMarkup) {
            setSelectedImage(prev => {
                const updatedMarkups = [...(prev.markups || []), newMarkup];
                setMarkupHistory(prevHistory => [...prevHistory, JSON.parse(JSON.stringify(updatedMarkups))]);
                
                const image = new Image();
                image.src = prev.originalSrc;
                image.onload = () => redrawCanvas(canvas, ctx, image, updatedMarkups);

                return { ...prev, markups: updatedMarkups };
            });
        }
    };

    const draw = (e) => {
        if (!isDrawing || markupMode !== 'draw') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const currentMarkup = selectedImage.markups[selectedImage.markups.length - 1];
        const lastPoint = currentMarkup.points[currentMarkup.points.length - 1];
        
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = penThickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        currentMarkup.points.push({ x, y });
    };

    const stopDrawing = (e) => {
        if (!isDrawing) return;
        
        if (markupMode === 'arrow' && selectedImage.markups.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const currentMarkup = selectedImage.markups[selectedImage.markups.length - 1];
            if (currentMarkup.points.length > 1) { // Need at least two points
                const x = e.clientX - canvas.getBoundingClientRect().left;
                const y = e.clientY - canvas.getBoundingClientRect().top;
                currentMarkup.points.push({ x, y });
                drawArrowHead(ctx, currentMarkup.points[currentMarkup.points.length - 2], {x, y}, drawColor, penThickness);
            }
        }
        setIsDrawing(false);
    };
    
    const handleClearCanvas = () => {
        if (selectedImage) {
            setSelectedImage(prev => ({ ...prev, markups: [] }));
            setMarkupHistory([[]]);
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = selectedImage.originalSrc;
            image.onload = () => redrawCanvas(canvas, ctx, image, []);
        }
    };
    
    const handleUndoMarkup = () => {
        if (markupHistory.length > 1) {
            const newHistory = markupHistory.slice(0, -1);
            const lastMarkups = JSON.parse(JSON.stringify(newHistory[newHistory.length - 1]));
            
            setMarkupHistory(newHistory);
            setSelectedImage(prev => ({ ...prev, markups: lastMarkups }));

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = selectedImage.originalSrc;
            image.onload = () => redrawCanvas(canvas, ctx, image, lastMarkups);
        }
    };

    const handleSaveMarkup = () => {
        const canvas = canvasRef.current;
        const newImageSrc = canvas.toDataURL('image/png');

        setInspirationImages(prevImages => prevImages.map(img => 
            img.id === selectedImage.id ? { ...selectedImage, src: newImageSrc } : img
        ));
        
        setIsMarkupModalOpen(false);
        setSelectedImage(null);
        setMarkupHistory([]);
    };


    // --- Summary Generation ---
    const createLuxurySummary = () => {
        const gemSection = gems.map((gem, index) => {
             let gradingHTML = '';
            if (parseFloat(gem.caratWeight) >= 0.25) {
                gradingHTML += `<h4 style="font-size: 1rem; font-weight: normal; margin-top: 1rem; color: #333;">Grading Details</h4><div class="luxury-grid" style="margin-top: 0.5rem;">`;
                if (gem.type === 'Diamond') {
                    if (gem.colorGrade) gradingHTML += `<div class="luxury-item"><span class="luxury-label">Color:</span> ${gem.colorGrade}</div>`;
                    if (gem.clarityGrade) gradingHTML += `<div class="luxury-item"><span class="luxury-label">Clarity:</span> ${gem.clarityGrade}</div>`;
                    if (gem.cutGrade) gradingHTML += `<div class="luxury-item"><span class="luxury-label">Cut:</span> ${gem.cutGrade}</div>`;
                } else {
                    if (gem.species) gradingHTML += `<div class="luxury-item"><span class="luxury-label">Species:</span> ${gem.species}</div>`;
                    if (gem.origin) gradingHTML += `<div class="luxury-item"><span class="luxury-label">Origin:</span> ${gem.origin}</div>`;
                    if (gem.treatment) gradingHTML += `<div class="luxury-item"><span class="luxury-label">Treatment:</span> ${gem.treatment}</div>`;
                }
                gradingHTML += `</div>`;
            }

            return `
                <div key=${gem.id} style="margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
                    <h3 style="font-weight: normal; margin-bottom: 0.5rem; ">Gem ${index + 1}</h3>
                    <div class="luxury-grid">
                        <div class="luxury-item"><span class="luxury-label">Type:</span> ${gem.type}</div>
                        <div class="luxury-item"><span class="luxury-label">Shape:</span> ${gem.shape}</div>
                        <div class="luxury-item"><span class="luxury-label">Width:</span> ${gem.width} mm</div>
                        <div class="luxury-item"><span class="luxury-label">Length:</span> ${gem.length} mm</div>
                        <div class="luxury-item"><span class="luxury-label">Carat Weight:</span> ${gem.caratWeight}</div>
                        <div class="luxury-item"><span class="luxury-label">Quantity:</span> ${gem.quantity}</div>
                    </div>
                    ${gradingHTML}
                    ${gem.customerSupplied ? `<p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem; font-style: italic;">Customer will supply this gem.</p>` : ''}
                    ${gem.smartAssist ? `<p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem; font-style: italic;"><i class="fas fa-calculator"></i> Carat weight estimated.</p>` : ''}
                </div>
            `;
        }).join('');

        return `
            <div class="luxury-summary">
                <div class="luxury-header">
                    <h1 class="luxury-title">MAYX</h1>
                    <p class="luxury-subtitle">Design Brief</p>
                </div>
                
                ${(clientName || clientContact || clientEmail || clientAddress) ? `
                <div class="luxury-section">
                    <h2 class="luxury-section-title">CLIENT DETAILS</h2>
                    <div class="luxury-grid">
                        ${clientName ? `<div class="luxury-item"><span class="luxury-label">Name:</span> ${clientName}</div>` : ''}
                        ${clientContact ? `<div class="luxury-item"><span class="luxury-label">Contact:</span> ${clientContact}</div>` : ''}
                    </div>
                     ${clientEmail ? `<div class="luxury-item"><span class="luxury-label">Email:</span> ${clientEmail}</div>` : ''}
                     ${clientAddress ? `<div class="luxury-item" style="white-space: pre-wrap;"><span class="luxury-label">Address:</span> ${clientAddress}</div>` : ''}
                </div>` : ''}
                
                <div class="luxury-section">
                    <h2 class="luxury-section-title">DESIGN CHOICES</h2>
                    <div class="luxury-grid">
                        <div class="luxury-item">
                            <span class="luxury-label">Category:</span>
                            ${category || 'Not selected'}
                        </div>
                        ${category === 'Ring' ? `<div class="luxury-item"><span class="luxury-label">Ring Type:</span> ${ringType || 'Not selected'}</div>` : ''}
                        ${category === 'Earring' ? `<div class="luxury-item"><span class="luxury-label">Earring Type:</span> ${earringType || 'Not selected'}</div>` : ''}
                        ${category === 'Necklaces and Pendants' ? `<div class="luxury-item"><span class="luxury-label">Type:</span> ${necklaceType || 'Not selected'}</div>` : ''}
                        ${category === 'Bracelet' ? `<div class="luxury-item"><span class="luxury-label">Bracelet Type:</span> ${braceletType || 'Not selected'}</div>` : ''}
                    </div>
                </div>

                <div class="luxury-section">
                    <h2 class="luxury-section-title">SPECIFICATIONS</h2>
                    <div class="luxury-grid">
                        ${category === 'Ring' ? `
                            <div class="luxury-item"><span class="luxury-label">Ring Size:</span> ${sizeValue} (${sizeSystem})</div>
                            <div class="luxury-item"><span class="luxury-label">Diameter:</span> ${diameter} mm</div>
                            ${ringType === 'Womens Wedding Bands and Eternity Rings' ? `
                                <div class="luxury-item"><span class="luxury-label">Diamond Coverage:</span> ${diamondCoverage}</div>
                                <div class="luxury-item"><span class="luxury-label">Estimated Stones:</span> ${stoneCount}</div>
                            ` : ''}
                        ` : ''}
                        ${category === 'Bracelet' && (braceletType === 'Bangles') ? `
                            <div class="luxury-item"><span class="luxury-label">Shape:</span> ${bangleShape}</div>
                            ${bangleShape === 'Round' ? `
                                <div class="luxury-item"><span class="luxury-label">Diameter:</span> ${bangleDiameter} mm</div>
                            ` : `
                                <div class="luxury-item"><span class="luxury-label">Height:</span> ${bangleHeight} mm</div>
                                <div class="luxury-item"><span class="luxury-label">Width:</span> ${bangleWidth} mm</div>
                            `}
                            ${useBangleProfiles ? `<div classs="luxury-item"><span class="luxury-label">Profiles:</span> Custom profiles requested</div>` : ''}
                        ` : ''}
                        ${category === 'Bracelet' && (braceletType === 'Tennis Bracelets' || braceletType === 'Original Angel' || braceletType === 'B Bold' || braceletType === 'Timeless Classics') ? `
                            <div class="luxury-item"><span class="luxury-label">Size:</span> ${braceletSize}</div>
                            <div class="luxury-item"><span class="luxury-label">Length (Est.):</span> ${braceletLength} cm</div>
                            ${braceletType === 'Tennis Bracelets' ? `
                                <div class="luxury-item"><span class="luxury-label">Stone Diameter:</span> ${stoneDiameter} mm</div>
                                <div class="luxury-item"><span class="luxury-label">Estimated Gems:</span> ${estimatedGemCount}</div>
                            ` : ''}
                        ` : ''}
                    </div>
                </div>
                
                ${gems.length > 0 ? `
                <div class="luxury-section">
                    <h2 class="luxury-section-title">GEMSTONE DETAILS</h2>
                    ${gemSection}
                    <div style="background: #f9f9f9; padding: 1rem; border-top: 1px solid #eee;">
                        <span style="font-weight: bold;">Total Carat Weight: ${tcwValue} ct</span>
                    </div>
                </div>` : ''}
                
                ${alloys.length > 0 ? `
                <div class="luxury-section">
                    <h2 class="luxury-section-title">METAL TYPES</h2>
                    ${alloys.map(alloy => `
                        <div class="luxury-item" style="margin-bottom: 0.5rem;">
                            <span class="luxury-label">${alloy.part}${alloy.component ? ` (${alloy.component})` : ''}:</span>
                            ${alloy.alloy}
                        </div>
                    `).join('')}
                </div>` : ''}
                
                ${(engraving || logo) ? `
                <div class="luxury-section">
                    <h2 class="luxury-section-title">ENGRAVING DETAILS</h2>
                    ${engraving ? `<div class="luxury-item"><span class="luxury-label">Text:</span> "${engraving}"</div>` : ''}
                    ${logo ? `
                        <div class="luxury-item"><span class="luxury-label">Logo:</span></div>
                        <div style="margin-top: 1rem;">
                            <img src="${logo}" alt="Logo" style="max-width: 200px; max-height: 150px; object-fit: contain;">
                        </div>
                    ` : ''}
                </div>` : ''}
                
                ${inspirationImages.length > 0 ? `
                <div class="luxury-section">
                    <h2 class="luxury-section-title">INSPIRATION IMAGES</h2>
                    <div class="luxury-image-grid">
                    ${inspirationImages.map(img => `
                        <div class="luxury-image-item">
                            <img src="${img.src}" alt="Inspiration" class="luxury-image">
                            ${img.comment ? `<div class="luxury-image-caption">${img.comment}</div>` : ''}
                            ${img.markups && img.markups.length > 0 ? `<div class="luxury-image-caption"><i class="fas fa-draw-polygon"></i> ${img.markups.length} annotation(s)</div>` : ''}
                        </div>
                    `).join('')}
                    </div>
                </div>` : ''}

                <div class="luxury-section">
                    <p style="text-align: center; margin-top: 2rem; font-style: italic; color: #666;">
                        This design brief was generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        `;
    };

    
    // --- JSX Render ---
    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <h1 className="logo">MAYX</h1>
                    <div className="header-buttons">
                        <button id="summary-btn" className="btn btn-secondary" onClick={handleGenerateSummary}>
                            <i className="fas fa-file-alt"></i> Generate Summary
                        </button>
                        <button id="save-pdf-btn" className="btn btn-primary" onClick={handleSavePdf}>
                            <i className="fas fa-file-pdf"></i> Save as PDF
                        </button>
                        <button id="save-btn" className="btn btn-primary" onClick={handleSaveBrief} disabled={isLoading}>
                            {isLoading ? (
                                <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fas fa-save"></i>
                            )}
                            {isLoading ? ' Saving...' : ' Save Brief'}
                        </button>
                    </div>
                </div>
            </header>
            
            {apiError && (
                <div style={{ padding: '1rem', background: 'var(--danger)', color: 'white', margin: '0 1.5rem 1.5rem 1.5rem', borderRadius: '0.5rem' }}>
                    <strong>Error:</strong> {apiError}
                </div>
            )}

            <main className="main-content">
                <section className="section">
                    <h2 className="section-title">What are we making today?</h2>
                    <div className="grid grid-4" id="category-container">
                        {categories.map(cat => (
                            <div 
                                key={cat}
                                className={`visual-card-select ${category === cat ? 'active' : ''}`}
                                onClick={() => handleCategorySelect(cat)}
                            >
                                <img src={categoryImages[cat]} alt={cat} />
                                <span className="visual-card-label">{cat.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {category === 'Ring' && (
                    <section className="section" id="ring-type-section">
                        <h2 className="section-title">What type of Ring?</h2>
                        <div className="grid grid-6" id="ring-type-container">
                            {ringTypes.map(type => (
                                <div 
                                    key={type}
                                    className={`visual-card-select ${ringType === type ? 'active' : ''}`}
                                    onClick={() => handleRingTypeSelect(type)}
                                >
                                    <img src={ringTypeImages[type]} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {category === 'Earring' && (
                    <section className="section" id="earring-type-section">
                        <h2 className="section-title">What type of Earring?</h2>
                        <div className="grid grid-6" id="earring-type-container">
                            {earringTypes.map(type => (
                                <div 
                                    key={type}
                                    className={`visual-card-select ${earringType === type ? 'active' : ''}`}
                                    onClick={() => handleEarringTypeSelect(type)}
                                >
                                    <img src={earringTypeImages[type]} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {category === 'Necklaces and Pendants' && (
                    <section className="section" id="necklace-type-section">
                        <h2 className="section-title">What type of Necklaces and Pendants?</h2>
                        <div className="grid grid-6" id="necklace-type-container">
                            {necklaceTypes.map(type => (
                                <div 
                                    key={type}
                                    className={`visual-card-select ${necklaceType === type ? 'active' : ''}`}
                                    onClick={() => handleNecklaceTypeSelect(type)}
                                >
                                    <img src={necklaceTypeImages[type]} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {category === 'Bracelet' && (
                    <section className="section" id="bracelet-type-section">
                        <h2 className="section-title">What type of Bracelet?</h2>
                        <div className="grid grid-5" id="bracelet-type-container">
                            {braceletTypes.map(type => (
                                <div 
                                    key={type}
                                    className={`visual-card-select ${braceletType === type ? 'active' : ''}`}
                                    onClick={() => handleBraceletTypeSelect(type)}
                                >
                                    <img src={braceletTypeImages[type]} alt={type} />
                                    <span className="visual-card-label">{type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {category === 'Ring' && (
                    <section className="section" id="ring-size-section">
                        <h2 className="section-title">Select Ring Size</h2>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Size System</label>
                                <select className="form-select" id="size-system" value={sizeSystem} onChange={handleSizeSystemChange}>
                                    {sizeSystems.map(system => <option key={system} value={system}>{system}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Size</label>
                                <select className="form-select" id="size-value" value={sizeValue} onChange={handleSizeValueChange}>
                                    {availableSizes.map(size => <option key={size} value={size}>{size}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="info-box">
                            <p className="info-text" id="diameter-info">Your selected size is {diameter} mm inside diameter.</p>
                        </div>
                    </section>
                )}

                {category === 'Bracelet' && (braceletType === 'Bangles') && (
                    <section className="section" id="bangle-dimensions-section">
                        <h2 className="section-title">Bangle/Cuff Dimensions</h2>
                        <div className="grid grid-2 mb-4">
                            <div>
                                <label className="form-label">Shape</label>
                                <div className="grid grid-2">
                                    <button id="bangle-round" className={`card-select ${bangleShape === 'Round' ? 'active' : ''}`} onClick={() => handleBangleShapeSelect('Round')}>Round</button>
                                    <button id="bangle-oval" className={`card-select ${bangleShape === 'Oval' ? 'active' : ''}`} onClick={() => handleBangleShapeSelect('Oval')}>Oval</button>
                                </div>
                            </div>
                            <div id="bangle-diameter-container" style={{ display: bangleShape === 'Round' ? 'block' : 'none' }}>
                                <label className="form-label">Diameter (mm)</label>
                                <input type="number" className="form-input" id="bangle-diameter" value={bangleDiameter} onChange={e => setBangleDiameter(e.target.value)} step="0.1"/>
                            </div>
                            <div id="bangle-oval-dimensions" style={{ display: bangleShape === 'Oval' ? 'block' : 'none' }}>
                                <div className="grid grid-2">
                                    <div>
                                        <label className="form-label">Height (mm)</label>
                                        <input type="number" className="form-input" id="bangle-height" value={bangleHeight} onChange={e => setBangleHeight(e.target.value)} step="0.1"/>
                                    </div>
                                    <div>
                                        <label className="form-label">Width (mm)</label>
                                        <input type="number" className="form-input" id="bangle-width" value={bangleWidth} onChange={e => setBangleWidth(e.target.value)} step="0.1"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <input type="checkbox" id="use-bangle-profiles" checked={useBangleProfiles} onChange={e => setUseBangleProfiles(e.target.checked)}/> Use Bangle Profiles?
                            </label>
                        </div>
                    </section>
                )}

                {category === 'Bracelet' && (braceletType === 'Tennis Bracelets' || braceletType === 'Original Angel' || braceletType === 'B Bold' || braceletType === 'Timeless Classics') && (
                    <section className="section" id="bracelet-specs-section">
                        <h2 className="section-title">Bracelet Specifications</h2>
                        <div className="form-group">
                            <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Select your size</h3>
                            <div className="grid grid-4" id="bracelet-size-container">
                                {Object.keys(braceletSizes).map(sizeName => (
                                    <div 
                                        key={sizeName}
                                        className={`size-card ${braceletSize === sizeName ? 'active' : ''}`}
                                        onClick={() => handleBraceletSizeSelect(sizeName)}
                                    >
                                        <span className="size-card-name">{sizeName}</span>
                                        <span className="size-card-dims">{braceletSizes[sizeName].in} in. | {braceletSizes[sizeName].cm} cm</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {braceletType === 'Tennis Bracelets' && (
                            <div id="tennis-bracelet-specs" style={{ marginTop: '1.5rem' }}>
                                <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Tennis Bracelet Details</h3>
                                <div className="form-group">
                                    <label className="form-label">Stone Diameter (mm)</label>
                                    <input type="number" className="form-input" id="stone-diameter" value={stoneDiameter} onChange={e => setStoneDiameter(e.target.value)} step="0.1" style={{ maxWidth: '200px' }}/>
                                </div>
                                <div className="info-box">
                                    <p className="info-text" id="gem-estimate">Based on a {braceletSize} size, you require approximately {estimatedGemCount} gems.</p>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {category === 'Ring' && ringType === 'Womens Wedding Bands and Eternity Rings' && (
                    <section className="section" id="diamond-band-section">
                        <h2 className="section-title">Diamond Band Specifications</h2>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Diamond Coverage</label>
                                <div className="grid grid-4" id="diamond-coverage-container">
                                    {diamondCoverageOptions.map(option => (
                                        <button 
                                            key={option}
                                            type="button"
                                            className={`card-select ${diamondCoverage === option ? 'active' : ''}`}
                                            onClick={() => handleDiamondCoverageSelect(option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Estimated Stone Count</label>
                                <input type="text" className="form-input" id="stone-count" value={stoneCount} readOnly/>
                            </div>
                        </div>
                        <div className="info-box">
                            <p className="info-text" id="diamond-band-info">
                                Using Gem 1 Width at {(gems.length > 0 && gems[0].width) ? parseFloat(gems[0].width).toFixed(2) : '...'}mm you need approximately {stoneCount} gems.
                            </p>
                        </div>
                    </section>
                )}

                <section className="section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="section-title">Gemstone Details</h2>
                        <button id="add-gem-btn" className="btn btn-success" onClick={handleAddGem}>
                            <i className="fas fa-plus"></i> Add Gem
                        </button>
                    </div>
                    <div id="gems-container">
                        {gems.length === 0 ? (
                            <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem' }}>
                                No gems added yet. Click "Add Gem" to get started.
                            </p>
                        ) : (
                            gems.map((gem, index) => (
                                <div key={gem.id} className="gem-item" style={{ border: '1px solid var(--gray-200)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <h3 style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Gem {index + 1}</h3>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <input type="checkbox" checked={gem.smartAssist} onChange={e => {
                                                    const newGems = gems.map(g => g.id === gem.id ? {...g, smartAssist: e.target.checked} : g);
                                                    const updatedGem = newGems.find(g => g.id === gem.id);
                                                    if (e.target.checked) {
                                                        const newCarat = estimateCaratWeight(updatedGem.width, updatedGem.length, updatedGem.shape, updatedGem.type);
                                                        updatedGem.caratWeight = newCarat;
                                                    }
                                                    setGems(newGems);
                                                }} />
                                                <i className="fas fa-calculator"></i> Smart Assist
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <input type="checkbox" checked={gem.customerSupplied} onChange={e => handleGemInput(gem.id, 'customerSupplied', e.target.checked)} />
                                                Customer Supplied
                                            </label>
                                            <button className="btn btn-danger" onClick={() => handleRemoveGem(gem.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-5" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select className="form-select" value={gem.type} onChange={e => {
                                                handleGemInput(gem.id, 'type', e.target.value);
                                                if (gem.smartAssist) {
                                                    const newCarat = estimateCaratWeight(gem.width, gem.length, gem.shape, e.target.value);
                                                    handleGemBlur(gem.id, 'caratWeight', newCarat);
                                                } else {
                                                    handleGemBlur(gem.id, 'type', e.target.value);
                                                }
                                            }}>
                                                {gemTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Shape</label>
                                            <select className="form-select" value={gem.shape} onChange={e => {
                                                handleGemInput(gem.id, 'shape', e.target.value);
                                                if (gem.smartAssist) {
                                                    if (gem.caratWeight) {
                                                        const dims = estimateDimensionsFromCarat(gem.caratWeight, e.target.value, gem.type);
                                                        handleGemInput(gem.id, 'width', dims.width);
                                                        handleGemInput(gem.id, 'length', dims.length);
                                                        handleGemBlur(gem.id, 'shape', e.target.value);
                                                    } else {
                                                        const newCarat = estimateCaratWeight(gem.width, gem.length, e.target.value, gem.type);
                                                        handleGemBlur(gem.id, 'caratWeight', newCarat);
                                                    }
                                                } else {
                                                    handleGemBlur(gem.id, 'shape', e.target.value);
                                                }
                                            }}>
                                                {gemShapes.map(shape => <option key={shape} value={shape}>{shape}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Width (mm)</label>
                                            <input type="text" inputMode="decimal" placeholder="e.g., 5.20" className="form-input" value={gem.width} onChange={e => handleGemInput(gem.id, 'width', e.target.value)} onBlur={e => handleGemBlur(gem.id, 'width', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Length (mm)</label>
                                            <input type="text" inputMode="decimal" placeholder="e.g., 7.15" className="form-input" value={gem.length} onChange={e => handleGemInput(gem.id, 'length', e.target.value)} onBlur={e => handleGemBlur(gem.id, 'length', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Carat Weight</label>
                                            <input type="text" inputMode="decimal" placeholder="e.g., 0.87" className="form-input" value={gem.caratWeight} disabled={gem.smartAssist && (gem.width || gem.length)} style={{ backgroundColor: gem.smartAssist && (gem.width || gem.length) ? 'var(--gray-100)' : 'white' }} onChange={e => handleGemInput(gem.id, 'caratWeight', e.target.value)} onBlur={e => handleGemBlur(gem.id, 'caratWeight', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-2" style={{ gap: '1rem', marginTop: '0.75rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Quantity</label>
                                            <input type="number" className="form-input" value={gem.quantity} disabled={index === 0 && ringType === 'Womens Wedding Bands and Eternity Rings'} style={{ backgroundColor: (index === 0 && ringType === 'Womens Wedding Bands and Eternity Rings') ? 'var(--gray-100)' : 'white' }} onChange={e => handleGemInput(gem.id, 'quantity', e.target.value)} onBlur={e => handleGemBlur(gem.id, 'quantity', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">TCW</label>
                                            <input type="text" className="form-input" disabled value={((parseFloat(gem.caratWeight) || 0) * (parseInt(gem.quantity) || 1)).toFixed(2)} style={{ backgroundColor: 'var(--gray-50)' }} />
                                        </div>
                                    </div>

                                    {parseFloat(gem.caratWeight) >= 0.25 && (
                                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                                            <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Color & Clarity Grading</h4>
                                            <div className="grid grid-3">
                                                {gem.type === 'Diamond' ? (
                                                    <>
                                                        <div className="form-group">
                                                            <label className="form-label">Color</label>
                                                            <select className="form-select" value={gem.colorGrade} onChange={e => handleGemInput(gem.id, 'colorGrade', e.target.value)}>
                                                                <option value="" disabled>Select Color</option>
                                                                {diamondColorGrades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Clarity</label>
                                                            <select className="form-select" value={gem.clarityGrade} onChange={e => handleGemInput(gem.id, 'clarityGrade', e.target.value)}>
                                                                <option value="" disabled>Select Clarity</option>
                                                                {diamondClarityGrades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Cut</label>
                                                            <select className="form-select" value={gem.cutGrade} onChange={e => handleGemInput(gem.id, 'cutGrade', e.target.value)}>
                                                                <option value="" disabled>Select Cut</option>
                                                                {diamondCutGrades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                                            </select>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="form-group">
                                                            <label className="form-label">Species/Variety</label>
                                                            <input type="text" className="form-input" value={gem.species} onChange={e => handleGemInput(gem.id, 'species', e.target.value)} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Origin</label>
                                                            <input type="text" className="form-input" value={gem.origin} onChange={e => handleGemInput(gem.id, 'origin', e.target.value)} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Treatment</label>
                                                            <input type="text" className="form-input" value={gem.treatment} onChange={e => handleGemInput(gem.id, 'treatment', e.target.value)} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {gem.smartAssist && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-600)', fontStyle: 'italic' }}>
                                            Smart Assist Active: Edit dimensions to estimate carat, or edit carat to estimate dimensions.
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    {isTcwVisible && (
                        <div id="tcw-container">
                            <div className="info-box">
                                <p className="info-text">Total Carat Weight (TCW): <span id="tcw-value">{tcwValue}</span> ct</p>
                            </div>
                        </div>
                    )}
                </section>

                <section className="section">
                    <h2 className="section-title">Describe your ideal design</h2>
                    <textarea className="form-textarea" id="description" placeholder="This is a trilogy ring..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </section>

                <section className="section">
                    <h2 className="section-title">Upload Inspiration Images</h2>
                    <div className="upload-area" id="inspiration-upload-area" onClick={() => inspirationUploadRef.current && inspirationUploadRef.current.click()}>
                        <div className="upload-icon">
                            <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <p>Drag & drop or click to upload</p>
                        <input type="file" id="inspiration-upload" multiple accept="image/*" style={{ display: 'none' }} ref={inspirationUploadRef} onChange={handleImageUpload}/>
                    </div>
                    <div className="image-grid" id="inspiration-images-container">
                        {inspirationImages.map(img => (
                            <div key={img.id} className="image-item">
                                <img src={img.src} className="image-preview" alt="Inspiration" />
                                <textarea 
                                    className="form-input" 
                                    placeholder="Comments for this image..." 
                                    value={img.comment} 
                                    onChange={e => handleUpdateImageComment(img.id, e.target.value)}
                                    style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                                ></textarea>
                                <div className="image-actions">
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => openMarkupModal(img)}>
                                        <i className="fas fa-edit"></i> Markup
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleRemoveImage(img.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="section-title">Metal Type</h2>
                        <button id="add-alloy-btn" className="btn btn-success" onClick={handleAddAlloy}>
                            <i className="fas fa-plus"></i> Add Metal Type
                        </button>
                    </div>
                    <div id="alloys-container">
                        {alloys.length === 0 ? (
                             <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '1rem' }}>
                                No components added yet. Click "Add Metal Type" to get started.
                            </p>
                        ) : (
                            alloys.map(alloy => (
                                <div key={alloy.id} className="grid grid-4" style={{ gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
                                    <div className="form-group">
                                        <label className="form-label">Part</label>
                                        <select className="form-select" value={alloy.part} onChange={e => handleAlloyUpdate(alloy.id, 'part', e.target.value)}>
                                            {partOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Component (Optional)</label>
                                        <input type="text" className="form-input" placeholder="e.g., Shank" value={alloy.component} onChange={e => handleAlloyUpdate(alloy.id, 'component', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Metal Type</label>
                                        <select className="form-select" value={alloy.alloy} onChange={e => handleAlloyUpdate(alloy.id, 'alloy', e.target.value)}>
                                            {alloyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <button className="btn btn-danger" style={{ marginBottom: '1rem' }} onClick={() => handleRemoveAlloy(alloy.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Engraving</h2>
                    <div className="form-group">
                        <input type="text" className="form-input" id="engraving" placeholder="Enter engraving text..." value={engraving} onChange={e => setEngraving(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="file" id="logo-upload" accept="image/*" style={{ display: 'none' }} ref={logoUploadRef} onChange={handleLogoUpload} />
                        <button id="upload-logo-btn" className="btn btn-secondary" onClick={() => logoUploadRef.current && logoUploadRef.current.click()}>
                            Upload Logo
                        </button>
                        {logoPreview && (
                            <div id="logo-preview" style={{ display: 'flex', alignItems: 'center' }}>
                                <img id="logo-image" src={logoPreview} alt="Logo" style={{ height: '4rem', width: '4rem', objectFit: 'contain', border: '1px solid var(--gray-300)', borderRadius: '0.375rem' }} />
                                <button id="remove-logo-btn" className="btn btn-danger" style={{ marginLeft: '0.5rem' }} onClick={handleRemoveLogo}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Client Details</h2>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label htmlFor="client-name" className="form-label">Full Name</label>
                            <input type="text" id="client-name" className="form-input" placeholder="Enter client's full name" value={clientName} onChange={e => setClientName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="client-contact" className="form-label">Contact Number</label>
                            <input type="tel" id="client-contact" className="form-input" placeholder="Enter contact number" value={clientContact} onChange={e => setClientContact(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="client-email" className="form-label">Email Address</label>
                        <input type="email" id="client-email" className="form-input" placeholder="Enter email address" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="client-address" className="form-label">Delivery Address</label>
                        <textarea id="client-address" className="form-textarea" placeholder="Enter full delivery address" value={clientAddress} onChange={e => setClientAddress(e.target.value)}></textarea>
                    </div>
                </section>
            </main>

            {isMarkupModalOpen && (
                <div className="modal-overlay" id="markup-modal">
                    <div className="modal" style={{ maxWidth: '1000px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">The Markup Window</h2>
                            <button className="modal-close" id="close-markup-modal" onClick={() => setIsMarkupModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="markup-container">
                                <div className="canvas-container">
                                    <canvas 
                                        id="markup-canvas" 
                                        ref={canvasRef}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                    ></canvas>
                                </div>
                                <div className="markup-tools">
                                    <div className="tool-section">
                                        <h3 className="tool-title">Tools</h3>
                                        <div className="form-group">
                                            <label className="form-label">Tool Mode</label>
                                            <div className="tool-buttons">
                                                <button id="draw-mode" className={`btn ${markupMode === 'draw' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setMarkupMode('draw')}>Draw</button>
                                                <button id="text-mode" className={`btn ${markupMode === 'text' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setMarkupMode('text')}>Text</button>
                                                <button id="arrow-mode" className={`btn ${markupMode === 'arrow' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setMarkupMode('arrow')}>Arrow</button>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Color</label>
                                            <input type="color" className="color-picker" id="draw-color" value={drawColor} onChange={e => setDrawColor(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Pen Thickness</label>
                                            <div className="slider-container">
                                                <input type="range" id="pen-thickness" min="1" max="10" value={penThickness} className="form-input" style={{ flex: 1 }} onChange={e => setPenThickness(parseInt(e.target.value))} />
                                                <span className="slider-value" id="thickness-value">{penThickness}px</span>
                                            </div>
                                        </div>
                                        <div id="text-tools" style={{ display: markupMode === 'text' ? 'block' : 'none' }}>
                                            <div className="form-group">
                                                <label className="form-label">Text</label>
                                                <input type="text" id="text-input" className="form-input" placeholder="Enter text" value={textInput} onChange={e => setTextInput(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Font Size</label>
                                                <div className="slider-container">
                                                    <input type="range" id="font-size" min="10" max="40" value={fontSize} className="form-input" style={{ flex: 1 }} onChange={e => setFontSize(parseInt(e.target.value))} />
                                                    <span className="slider-value" id="font-size-value">{fontSize}px</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tool-buttons">
                                        <button id="clear-canvas" className="btn btn-outline" onClick={handleClearCanvas}>
                                            Clear Canvas
                                        </button>
                                        <button id="undo-action" className="btn btn-outline" onClick={handleUndoMarkup}>
                                            Undo
                                        </button>
                                        <button id="save-markup" className="btn btn-success" onClick={handleSaveMarkup}>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isSummaryModalOpen && (
                <div className="modal-overlay" id="summary-modal">
                    <div className="modal" style={{ maxWidth: '900px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Design Summary</h2>
                            <button className="modal-close" id="close-summary-modal" onClick={() => setIsSummaryModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div id="summary-content" dangerouslySetInnerHTML={{ __html: summaryContent }}>
                                {/* Summary content will be injected here */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BriefWizard;



