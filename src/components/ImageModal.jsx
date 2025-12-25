import React from 'react';
import { X } from 'lucide-react';
import { useImageModal } from '../context/ImageModalContext';
import './ImageModal.css';

const ImageModal = () => {
    const { isOpen, imageSrc, imageAlt, closeModal } = useImageModal();

    if (!isOpen) return null;

    return (
        <div className="image-modal-overlay" onClick={closeModal}>
            <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                <button className="image-modal-close" onClick={closeModal}>
                    <X size={32} color="#fff" />
                </button>
                <img src={imageSrc} alt={imageAlt} className="image-modal-img" />
            </div>
        </div>
    );
};

export default ImageModal;
