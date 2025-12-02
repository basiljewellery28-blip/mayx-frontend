import React, { useRef } from 'react';
import './ProductSlider.css';

const ProductSlider = ({ products, onSelect, selectedSku, itemWidth = '25%' }) => {
    const sliderRef = useRef(null);

    const handleScroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth * 0.5; // Scroll half a screen width
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleWheel = (e) => {
        if (sliderRef.current) {
            // If vertical scroll (deltaY), map it to horizontal scroll
            if (e.deltaY !== 0) {
                // Prevent default only if we are actually scrolling horizontally to avoid blocking page scroll entirely
                // However, for a better UX in a horizontal slider, usually we want to capture the scroll
                // when the mouse is OVER the slider.
                e.preventDefault();
                sliderRef.current.scrollLeft += e.deltaY;
            }
        }
    };

    return (
        <div className="product-slider-wrapper">
            <button
                className="slider-arrow left"
                onClick={() => handleScroll('left')}
                aria-label="Previous items"
            >
                <i className="fas fa-chevron-left"></i>
            </button>

            <div
                className="product-slider-container"
                ref={sliderRef}
                onWheel={handleWheel}
            >
                {products.map((product) => (
                    <div
                        key={product.sku}
                        className={`product-slider-item ${selectedSku === product.sku ? 'active' : ''}`}
                        onClick={() => onSelect(product)}
                        style={{ minWidth: itemWidth }}
                    >
                        <img
                            src={product.image_url}
                            alt={product.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/400x400?text=No+Image';
                            }}
                        />
                        <span className="product-name">{product.name}</span>
                        <span className="product-sku">{product.sku}</span>
                    </div>
                ))}
            </div>

            <button
                className="slider-arrow right"
                onClick={() => handleScroll('right')}
                aria-label="Next items"
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    );
};

export default ProductSlider;
