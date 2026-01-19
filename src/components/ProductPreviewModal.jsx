import React from 'react';
import ProductCard from './ProductCard';
import { X } from 'lucide-react';

const ProductPreviewModal = ({ product, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3000,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '350px', // Restrict width to simulate card environment
                backgroundColor: 'transparent', // Let the card define its own bg if needed, usually cards are white
                display: 'flex',
                justifyContent: 'center'
            }} onClick={e => e.stopPropagation()}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '0px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                {/* The Preview Card */}
                <div style={{ width: '100%' }}>
                    <ProductCard product={product} />
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                color: 'white',
                textAlign: 'center',
                width: '100%'
            }}>
                <p>Preview Mode</p>
            </div>
        </div>
    );
};

export default ProductPreviewModal;
