import React, { createContext, useContext, useState, useEffect } from 'react';
import ImageModal from '../components/ImageModal';

const ImageModalContext = createContext();

export const useImageModal = () => useContext(ImageModalContext);

export const ImageModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [imageAlt, setImageAlt] = useState('');

    const openModal = (src, alt) => {
        setImageSrc(src);
        setImageAlt(alt || 'Full screen image');
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setImageSrc('');
        setImageAlt('');
    };

    useEffect(() => {
        const handleGlobalClick = (e) => {
            // Check if the clicked element is an image
            if (e.target.tagName === 'IMG') {
                // Optional: Check for exclusions (e.g., small icons, logos if needed)
                // Robust check: Exclude if class contains 'logo', 'no-zoom', or if alt/src contains 'logo'
                const isLogo = e.target.classList.contains('logo-img') ||
                    e.target.classList.contains('no-zoom') ||
                    (e.target.alt && e.target.alt.toLowerCase().includes('logo')) ||
                    (e.target.src && e.target.src.toLowerCase().includes('logo'));

                if (isLogo) return;

                // If the image is inside a button or link that should perform another action, 
                // we might want to be careful. But the user said "full website me jo img h".
                // We will prevent default to stop link navigation for image clicks.

                // Use a closer look to see if it's a meaningful image
                // Ensure it has a src
                if (!e.target.src) return;

                e.preventDefault();
                e.stopPropagation();
                openModal(e.target.src, e.target.alt);
            }
        };

        document.addEventListener('click', handleGlobalClick, true); // Capture phase to intervene early

        return () => {
            document.removeEventListener('click', handleGlobalClick, true);
        };
    }, []);

    return (
        <ImageModalContext.Provider value={{ isOpen, imageSrc, imageAlt, closeModal }}>
            {children}
            <ImageModal />
        </ImageModalContext.Provider>
    );
};
