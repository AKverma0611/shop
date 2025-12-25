export const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Cloudinary Error:", errorData);
            throw new Error(errorData.error?.message || 'Image upload failed');
        }

        const data = await response.json();
        console.log("Image uploaded successfully:", data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
