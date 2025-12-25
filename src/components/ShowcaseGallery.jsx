import React from 'react';
import showcase1 from '../assets/showcase-1.png';
import showcase2 from '../assets/showcase-2.png';
import './ShowcaseGallery.css';

const ShowcaseGallery = () => {
    const items = [
        { id: 1, image: showcase1, title: "Handmade Embroidery" },
        { id: 2, image: showcase2, title: "Custom Gowns" },
        { id: 3, image: showcase1, title: "Detailing" }, // Reusing for demo
        { id: 4, image: showcase2, title: "Party Wear" }, // Reusing for demo
        { id: 5, image: showcase1, title: "Fabric Quality" }, // Reusing for demo
        { id: 6, image: showcase2, title: "Happy Clients" }, // Reusing for demo
    ];

    return (
        <div className="showcase-gallery">
            {items.map((item) => (
                <div key={item.id} className="showcase-item">
                    <img src={item.image} alt={item.title} className="showcase-img" />
                    <div className="showcase-overlay">
                        <h3 className="showcase-title">{item.title}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowcaseGallery;
