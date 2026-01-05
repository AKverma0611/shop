import React from 'react';
import showcase1 from '../assets/showcase-1.png';
import showcase2 from '../assets/showcase-2.png';
import './ShowcaseGallery.css';

const ShowcaseGallery = ({ images }) => {
    // Default items as fallback (only if no images provided)
    const defaultItems = [
        { id: 1, image: showcase1, title: "Handmade Embroidery" },
        { id: 2, image: showcase2, title: "Custom Gowns" },
        { id: 3, image: showcase1, title: "Detailing" },
        { id: 4, image: showcase2, title: "Party Wear" },
        { id: 5, image: showcase1, title: "Fabric Quality" },
        { id: 6, image: showcase2, title: "Happy Clients" },
    ];

    const displayItems = (images && images.length > 0) ? images : defaultItems;
    // Duplicate items for continuous loop
    const loopedItems = [...displayItems, ...displayItems];

    return (
        <div className="showcase-gallery">
            <div className="marquee-track">
                {loopedItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="showcase-item">
                        <img src={item.image} alt={item.title} className="showcase-img" />
                        <div className="showcase-overlay">
                            <h3 className="showcase-title">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowcaseGallery;
