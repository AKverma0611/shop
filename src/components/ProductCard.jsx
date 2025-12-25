import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const whatsappUrl = `https://wa.me/919131126855?text=${encodeURIComponent(
        `Hello! I want to order this item: \n\n*Product Name:* ${product.name} \n*Price:* ₹${product.price} \n*Image:* ${product.image}\n\nIs it available?`
    )}`;

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
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
