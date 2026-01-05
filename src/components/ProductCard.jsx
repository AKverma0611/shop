import React, { useState } from 'react';
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useImageModal } from '../context/ImageModalContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { openGallery } = useImageModal();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Remove individual hover state dependency for rendering, handle via CSS for cleaner mobile support

    // Swipe state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Get all valid images
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const currentImage = images[currentImageIndex] || product.image;

    const isWishlisted = isInWishlist(product.id);
    const whatsappUrl = `https://wa.me/916264246210?text=${encodeURIComponent(
        `Hello! I want to order this item: \n\n*Product Name:* ${product.name} \n*Price:* ₹${product.price} \n*Image:* ${currentImage}\n\nIs it available?`
    )}`;

    // Navigation Logic
    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleImageClick = () => {
        openGallery(images, currentImageIndex);
    };

    // Touch Handlers
    const onTouchStart = (e) => {
        setTouchEnd(null); // Reset
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = (e) => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextImage();
        }

        if (isRightSwipe) {
            prevImage();
        }
    };

    return (
        <div className="product-card">
            <div
                className="product-image-container"
                onClick={handleImageClick}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <img src={currentImage} alt={product.name} className="product-image" />

                {images.length > 1 && (
                    <>
                        <button className="slider-nav prev" onClick={prevImage}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="slider-nav next" onClick={nextImage}>
                            <ChevronRight size={20} />
                        </button>
                        <div className="slider-dots">
                            {images.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`slider-dot ${idx === currentImageIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </>
                )}
                {product.isNew && <span className="tag tag-new">New</span>}
                {product.isBestSeller && <span className="tag tag-hot">Hot</span>}
                <button
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product)}
                    aria-label="Add to Wishlist"
                >
                    <Heart size={20} fill={isWishlisted ? "#ff6b6b" : "none"} color={isWishlisted ? "#ff6b6b" : "currentColor"} />
                </button>
            </div>
            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">₹{product.price}</div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm btn-block">
                    <MessageCircle size={16} /> Order on WhatsApp
                </a>
            </div>
        </div>
    );
};

export default ProductCard;
