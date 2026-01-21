import React, { useState } from 'react';
import { Heart, MessageCircle, ChevronLeft, ChevronRight, Volume2, VolumeX, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Remove individual hover state dependency for rendering, handle via CSS for cleaner mobile support

    // Swipe state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Video State
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = React.useRef(null);

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const togglePlay = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Get all valid media (images + video)
    // Legacy support: 'images' might contain mixed media now.
    // 'video' field is legacy. check if it's already in 'images' before adding.

    let media = product.images && product.images.length > 0 ? [...product.images] : (product.image ? [product.image] : []);

    if (product.video && !media.includes(product.video)) {
        media.push(product.video);
    }

    // Filter out empty strings/nulls
    media = media.filter(item => item && item.trim() !== '');

    // Safety check for empty media
    if (media.length === 0) {
        media = ['https://placehold.co/400x500?text=No+Image'];
    }

    const currentMedia = media[currentImageIndex];


    const isVideo = currentMedia?.endsWith('.mp4') || currentMedia?.endsWith('.webm') || currentMedia?.includes('/video/upload/') || currentMedia?.includes('/video/'); // added /video/ just in case

    // Auto-play effect
    React.useEffect(() => {
        if (isVideo && videoRef.current) {
            // Try to play immediately
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        }
    }, [currentImageIndex, isVideo]); // Re-run when slide changes



    const isWishlisted = isInWishlist(product.id);
    const whatsappUrl = `https://wa.me/916264246210?text=${encodeURIComponent(
        `Hello! I want to order this item: \n\n*Product Name:* ${product.name} \n*Price:* ${product.isSpecialOffer ? `₹${product.discountPrice} (MRP: ₹${product.price})` : `₹${product.price}`} \n*Image:* ${media[0]}\n\nIs it available?`
    )}`;

    // Navigation Logic
    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % media.length);
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const handleImageClick = () => {
        navigate(`/product/${product.id}`);
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

    const getPosterUrl = (url) => {
        if (!url) return '';
        const cleanUrl = url.split('#')[0];
        // Cloudinary specific: if it is a video, changing extension to .jpg generates a thumbnail
        if (cleanUrl.includes('cloudinary') || cleanUrl.includes('/video/')) {
            if (cleanUrl.match(/\.(mp4|webm|mov|mkv)$/i)) {
                // Insert so_0 for start offset (first frame) to avoid blank/black thumbnails if middle is empty
                let thumbUrl = cleanUrl.replace('/upload/', '/upload/so_0/');
                return thumbUrl.replace(/\.(mp4|webm|mov|mkv)$/i, '.jpg');
            }
            return cleanUrl + '.jpg';
        }
        return '';
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
                {isVideo ? (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <video
                            ref={videoRef}
                            src={currentMedia ? currentMedia.split('#')[0] : ''}
                            className="product-image"
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                            style={{ objectFit: 'cover' }}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            poster={getPosterUrl(currentMedia)}
                        />

                        {/* Mute Button */}
                        <button
                            onClick={toggleMute}
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.6)',
                                border: 'none',
                                borderRadius: '50%',
                                padding: '8px',
                                cursor: 'pointer',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        {/* Play Overlay (only if paused) */}
                        {!isPlaying && (
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.2)',
                                    cursor: 'pointer',
                                    zIndex: 5
                                }}
                                onClick={togglePlay}
                            >
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '50%',
                                    padding: '15px',
                                    display: 'flex'
                                }}>
                                    <Play size={32} fill="black" color="black" style={{ marginLeft: '4px' }} />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <img src={currentMedia} alt={product.name} className="product-image" />
                )}

                {media.length > 1 && (
                    <>
                        <button className="slider-nav prev" onClick={prevImage}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="slider-nav next" onClick={nextImage}>
                            <ChevronRight size={20} />
                        </button>
                        <div className="slider-dots">
                            {media.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`slider-dot ${idx === currentImageIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Badges */}
                <div className="badges-container" style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                    {product.isSpecialOffer && <span className="tag" style={{ backgroundColor: '#FF0000', color: '#FFFFFF', fontWeight: 'bold' }}>Special Offer</span>}
                    {product.isNew && <span className="tag tag-new">New</span>}
                    {product.isBestSeller && <span className="tag tag-hot">Hot</span>}
                </div>

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
                <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>

                {product.isSpecialOffer ? (
                    <div className="product-price">
                        <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px', fontSize: '0.9rem' }}>₹{product.price}</span>
                        <span style={{ color: '#ff4081', fontWeight: 'bold' }}>₹{product.discountPrice}</span>
                    </div>
                ) : (
                    <div className="product-price">₹{product.price}</div>
                )}

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm btn-block">
                    <MessageCircle size={16} /> Order Now
                </a>
            </div>
        </div>
    );
};

export default ProductCard;
