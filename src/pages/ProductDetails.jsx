import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ArrowLeft, MessageCircle, Truck, ShieldCheck, Share2, Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = React.useRef(null);
    // Swipe state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        if (!loading && products.length > 0) {
            const foundProduct = products.find(p => p.id === id);
            setProduct(foundProduct || null);
        }
    }, [id, products, loading]);

    useEffect(() => {
        // Reset media index when product loads
        setSelectedMediaIndex(0);
    }, [product]);

    // Video auto-play on selection
    useEffect(() => {
        const currentMedia = product?.images?.[selectedMediaIndex];
        const isVideo = currentMedia?.endsWith('.mp4') || currentMedia?.endsWith('.webm') || currentMedia?.includes('/video/');

        if (isVideo && videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        }
    }, [selectedMediaIndex, product]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading Details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container not-found">
                <div className="not-found-content">
                    <h2>Product Not Found</h2>
                    <p>Sorry, we couldn't find the product you're looking for.</p>
                    <button onClick={() => navigate('/shop')} className="btn-primary">
                        Browse Shop
                    </button>
                </div>
            </div>
        );
    }

    // Media Logic (copy from ProductCard mostly)
    let media = product.images && product.images.length > 0 ? [...product.images] : (product.image ? [product.image] : []);
    if (product.video && !media.includes(product.video)) media.push(product.video);
    media = media.filter(item => item && item.trim() !== '');
    if (media.length === 0) media = ['https://placehold.co/400x500?text=No+Image'];

    const currentMedia = media[selectedMediaIndex];
    const isVideo = currentMedia?.endsWith('.mp4') || currentMedia?.endsWith('.webm') || currentMedia?.includes('/video/');

    const whatsappUrl = `https://wa.me/916264246210?text=${encodeURIComponent(
        `Hello! I want to order this item: \n\n*Product Name:* ${product.name} \n*Price:* ${product.isSpecialOffer ? `₹${product.discountPrice} (MRP: ₹${product.price})` : `₹${product.price}`} \n*Link:* ${window.location.href}\n\nIs it available?`
    )}`;

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const togglePlay = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setSelectedMediaIndex((prev) => (prev + 1) % media.length);
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setSelectedMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    // Swipe state


    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        if (isLeftSwipe) nextImage();
        if (isRightSwipe) prevImage();
    };



    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} on Khushi Closet!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert('Link copied to clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="product-details-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="product-details-layout">
                    {/* Left Column: Media Gallery */}
                    <div className="media-section">
                        <div className="main-media-container">
                            {isVideo ? (
                                <div className="video-wrapper">
                                    <video
                                        ref={videoRef}
                                        src={currentMedia}
                                        className="main-media"
                                        autoPlay
                                        muted={isMuted}
                                        loop
                                        playsInline
                                        onClick={togglePlay}
                                    />
                                    <button onClick={toggleMute} className="mute-btn">
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    {!isPlaying && (
                                        <div className="play-overlay" onClick={togglePlay}>
                                            <Play size={40} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <img src={currentMedia} alt={product.name} className="main-media" />
                            )}

                            {media.length > 1 && (
                                <>
                                    <button className="nav-btn prev" onClick={prevImage}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button className="nav-btn next" onClick={nextImage}>
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            {/* Badges removed from here */}
                        </div>

                        {media.length > 1 && (
                            <div className="thumbnails-scroll">
                                {media.map((item, idx) => {
                                    const isItemVideo = item.endsWith('.mp4') || item.includes('/video/');
                                    return (
                                        <div
                                            key={idx}
                                            className={`thumbnail-item ${selectedMediaIndex === idx ? 'active' : ''}`}
                                            onClick={() => setSelectedMediaIndex(idx)}
                                        >
                                            {isItemVideo ? (
                                                <video src={item} className="thumbnail-media" />
                                            ) : (
                                                <img src={item} alt={`View ${idx + 1}`} className="thumbnail-media" />
                                            )}
                                            {isItemVideo && <div className="video-indicator"><Play size={12} fill="white" /></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="info-section">
                        <div className="info-header">
                            <span className="product-cat">{product.category}</span>
                            <div className="action-icons">
                                <button onClick={handleShare} className="icon-btn" title="Share">
                                    <Share2 size={20} />
                                </button>
                                <button
                                    className={`icon-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                    onClick={() => toggleWishlist(product)}
                                    title="Add to Wishlist"
                                >
                                    <Heart size={20} fill={isInWishlist(product.id) ? "#ff6b6b" : "none"} color={isInWishlist(product.id) ? "#ff6b6b" : "currentColor"} />
                                </button>
                            </div>
                        </div>

                        <h1 className="product-title-large">{product.name}</h1>
                        <div className="price-block">
                            {product.isSpecialOffer ? (
                                <>
                                    <span className="original-price" style={{ textDecoration: 'line-through', color: '#888', marginRight: '10px', fontSize: '1.2rem' }}>₹{product.price}</span>
                                    <span className="current-price" style={{ color: '#ff4081', fontSize: '1.5rem', fontWeight: 'bold' }}>₹{product.discountPrice}</span>
                                </>
                            ) : (
                                <span className="current-price">₹{product.price}</span>
                            )}
                        </div>

                        {/* Badges Section */}
                        <div className="info-badges" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            {product.isSpecialOffer && <span className="badge" style={{ backgroundColor: '#FF0000', color: '#FFFFFF', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>Special Offer</span>}
                            {product.isNew && <span className="badge new-badge" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>New Arrival</span>}
                            {product.isBestSeller && <span className="badge hot-badge" style={{ backgroundColor: '#FF5722', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Best Seller</span>}
                        </div>

                        <div className="action-buttons">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex-grow">
                                <MessageCircle size={20} /> Order Now
                            </a>
                            <button
                                className={`wishlist-action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                onClick={() => toggleWishlist(product)}
                            >
                                <Heart size={24} fill={isInWishlist(product.id) ? "#ff6b6b" : "none"} color={isInWishlist(product.id) ? "#ff6b6b" : "currentColor"} />
                            </button>
                        </div>

                        <div className="product-description">
                            <h3>Product Details</h3>
                            <div className="description-text">
                                {product.details ? (
                                    product.details.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))
                                ) : (
                                    <p className="no-details">No specific details available for this product.</p>
                                )}
                            </div>
                        </div>

                        <div className="trust-badges">
                            <div className="trust-item">
                                <Truck size={20} />
                                <span>Fast Delivery</span>
                            </div>
                            <div className="trust-item">
                                <ShieldCheck size={20} />
                                <span>Quality Assured</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
