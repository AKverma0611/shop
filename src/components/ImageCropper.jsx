import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

const ImageCropper = ({ image, onCropDone, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            onCropDone(croppedBlob);
        } catch (e) {
            console.error(e);
            alert('Something went wrong with the crop');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '600px',
                height: '60vh',
                backgroundColor: '#333',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={3 / 4} // Standard aspect ratio for fashion products usually
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <ZoomOut size={20} color="white" />
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    style={{ flex: 1, accentColor: '#ff4081' }}
                />
                <ZoomIn size={20} color="white" />
            </div>

            <div style={{
                display: 'flex',
                gap: '20px',
                marginTop: '20px'
            }}>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '25px',
                        border: 'none',
                        backgroundColor: '#fff',
                        color: '#333',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <X size={18} /> Cancel
                </button>
                <button
                    onClick={handleCrop}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '25px',
                        border: 'none',
                        backgroundColor: '#ff4081',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 10px rgba(255, 64, 129, 0.3)'
                    }}
                >
                    <Check size={18} /> Crop & Save
                </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '10px', fontSize: '0.9rem' }}>
                Drag to position • Pinch or slide to zoom
            </p>
        </div>
    );
};

export default ImageCropper;
