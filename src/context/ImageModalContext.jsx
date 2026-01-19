import React, { createContext, useContext, useState, useEffect } from 'react';
import ImageModal from '../components/ImageModal';

const ImageModalContext = createContext();

export const useImageModal = () => useContext(ImageModalContext);

export const ImageModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    // Gallery support
    const [galleryImages, setGalleryImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (src, alt) => {
        setImageSrc(src);
        setImageAlt(alt || 'Full screen image');
        setGalleryImages([]); // Clear gallery if single image
        setIsOpen(true);
    };

    const openGallery = (images, startIndex = 0) => {
        if (!images || images.length === 0) return;
        setGalleryImages(images);
        setCurrentIndex(startIndex);
        // Set current source for backward compatibility / display
        setImageSrc(images[startIndex]);
        setImageAlt('Gallery Image');
        setIsOpen(true);
    };

    const nextImage = () => {
        if (galleryImages.length > 0) {
            const nextIdx = (currentIndex + 1) % galleryImages.length;
            setCurrentIndex(nextIdx);
            setImageSrc(galleryImages[nextIdx]);
        }
    };

    const prevImage = () => {
        if (galleryImages.length > 0) {
            const prevIdx = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            setCurrentIndex(prevIdx);
            setImageSrc(galleryImages[prevIdx]);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setImageSrc('');
        setImageAlt('');
        setGalleryImages([]);
        setCurrentIndex(0);
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

                // FIX: Ignore images inside ProductCard because they have their own gallery handler
                if (e.target.closest('.product-image-container')) return;

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
        <ImageModalContext.Provider value={{ isOpen, imageSrc, imageAlt, closeModal, openGallery, nextImage, prevImage, galleryImages, currentIndex }}>
            {children}
            <ImageModal
                isOpen={isOpen}
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                closeModal={closeModal}
                galleryImages={galleryImages}
                nextImage={nextImage}
                prevImage={prevImage}
                currentIndex={currentIndex}
            />
        </ImageModalContext.Provider>
    );
};
