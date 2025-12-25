import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/ProductGrid';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="page-container container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
            <h1 className="section-title">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="text-center" style={{ marginTop: '50px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>Your wishlist is empty.</p>
                    <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <ProductGrid products={wishlist} />
            )}
        </div>
    );
};

export default Wishlist;
