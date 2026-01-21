import React, { useState, useEffect, useRef } from 'react';
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

    // Ensure the base list is long enough to cover the screen (min 15 items for 4k safety)
    let baseList = [...displayItems];
    while (baseList.length < 15) {
        baseList = [...baseList, ...displayItems];
    }

    // Duplicate the full base list for loop illusion (though not perfectly infinite in this simple implementation, it's very long)
    const loopedItems = [...baseList, ...baseList, ...baseList, ...baseList];

    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId;

        const scroll = () => {
            if (!isPaused) {
                if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2)) {
                    // Reset to start for infinite loop illusion
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 1; // Adjust speed here
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, loopedItems]);


    return (
        <div className="showcase-gallery">
            <div
                className="marquee-track"
                ref={scrollRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
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
