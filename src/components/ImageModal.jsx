import React from 'react';
import { X } from 'lucide-react';
import { useImageModal } from '../context/ImageModalContext';
import './ImageModal.css';

const ImageModal = () => {
    const { isOpen, imageSrc, imageAlt, closeModal, galleryImages, nextImage, prevImage, currentIndex } = useImageModal();

    if (!isOpen) return null;

    return (
        <div className="image-modal-overlay" onClick={closeModal}>
            <div className="image-modal-content" onClick={e => e.stopPropagation()}>
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
                        <div className="image-modal-counter">
                            {currentIndex + 1} / {galleryImages.length}
                        </div>
                    </>
                )}

                <img src={imageSrc} alt={imageAlt} className="image-modal-img" />
            </div>
        </div>
    );
};

export default ImageModal;
