import React from 'react';
import { useConfig } from '../context/ConfigContext';
import './PromoBanner.css';

const PromoBanner = () => {
    const { promoBanner, loading } = useConfig();

    if (loading || !promoBanner.isActive || !promoBanner.text) return null;

    return (
        <div className="promo-banner">
            <div className="promo-container">
                <span className="promo-tag">New Offer</span>
                <span className="promo-text">{promoBanner.text}</span>
            </div>
        </div>
    );
};

export default PromoBanner;
