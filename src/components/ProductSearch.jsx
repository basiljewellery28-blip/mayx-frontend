import React, { useState, useEffect, useRef } from 'react';
import { productsAPI } from '../services/api';

const ProductSearch = ({ onSelect, category, subCategory, label = "Select Design" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const wrapperRef = useRef(null);

    // Fetch products based on category/subCategory and search term
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (category) params.category = category;
                if (subCategory) params.sub_category = subCategory;
                if (searchTerm) params.search = searchTerm;

                const response = await productsAPI.getAll(params);
                setProducts(response.data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, category, subCategory]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (product) => {
        setSelectedProduct(product);
        setSearchTerm(product.name); // Set input to selected name
        setShowDropdown(false);
        if (onSelect) {
            onSelect(product);
        }
    };

    return (
        <div className="form-group" ref={wrapperRef}>
            <label className="form-label">{label}</label>
            <div className="search-wrapper" style={{ position: 'relative' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                        setSelectedProduct(null); // Clear selection on edit
                    }}
                    onFocus={() => setShowDropdown(true)}
                />
                {loading && <div className="spinner-small" style={{ position: 'absolute', right: '10px', top: '10px' }}></div>}

                {showDropdown && products.length > 0 && (
                    <ul className="dropdown-list" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        {products.map(product => (
                            <li
                                key={product.id}
                                onClick={() => handleSelect(product)}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            >
                                {product.image_url && (
                                    <img src={product.image_url} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                )}
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{product.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>SKU: {product.sku}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedProduct && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {selectedProduct.image_url && (
                        <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    <div>
                        <strong>Selected: {selectedProduct.name}</strong>
                        <br />
                        <span style={{ fontSize: '12px', color: '#666' }}>SKU: {selectedProduct.sku}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
