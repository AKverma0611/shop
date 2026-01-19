import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './ImageModal.css';

const ImageModal = ({ isOpen, imageSrc, imageAlt, closeModal, galleryImages, nextImage, prevImage, currentIndex }) => {

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, nextImage, prevImage, closeModal]);

    if (!isOpen) return null;

    return (
        <div className="image-modal-overlay" onClick={closeModal}>
            <button className="image-modal-close" onClick={closeModal} aria-label="Close">
                <X size={32} color="#fff" />
            </button>

            {galleryImages.length > 1 && (
                <>
                    <button className="image-modal-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous">
                        &#10094;
                    </button>
                    <button className="image-modal-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next">
                        &#10095;
                    </button>
                </>
            )}

            <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                {(imageSrc && (imageSrc.endsWith('.mp4') || imageSrc.endsWith('.webm') || imageSrc.includes('/video/upload/'))) ? (
                    <video
                        src={imageSrc}
                        className="image-modal-img"
                        controls
                        autoPlay
                        style={{ maxHeight: '90vh', maxWidth: '100%' }}
                    />
                ) : (
                    <img src={imageSrc} alt={imageAlt} className="image-modal-img" />
                )}

                {galleryImages.length > 1 && (
                    <div className="image-modal-counter">
                        {currentIndex + 1} / {galleryImages.length}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageModal;
