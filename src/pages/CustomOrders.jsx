import React from 'react';
import ShowcaseGallery from '../components/ShowcaseGallery';
import { MessageCircle } from 'lucide-react';
import { useCustomOrders } from '../context/CustomOrdersContext';

const CustomOrders = () => {
    const { galleryImages, loading } = useCustomOrders();

    return (
        <div className="page-container container" style={{ padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="section-title">Custom Orders</h1>
                <p className="section-subtitle">Designed by You, Created by Us</p>
                <p style={{ maxWidth: '600px', margin: '0 auto 20px', color: 'var(--color-text-light)' }}>
                    Have a specific design in mind? We specialize in creating customized outfits that fit your style and personality perfectly.
                    From fabric selection to final fittings, we handle it all.
                </p>
                <a
                    href="https://wa.me/916264246210?text=Hi,%20I%20want%20to%20place%20a%20custom%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                >
                    <MessageCircle size={20} /> Start Custom Order
                </a>
            </div>

            <h2 className="section-title" style={{ fontSize: '2rem', marginTop: '60px' }}>Our Masterpieces</h2>
            {loading ? <p>Loading gallery...</p> : <ShowcaseGallery images={galleryImages} />}
        </div>
    );
};

export default CustomOrders;
