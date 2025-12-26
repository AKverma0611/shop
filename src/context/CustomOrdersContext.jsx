import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { uploadImageToCloudinary } from '../utils/uploadImage';

const CustomOrdersContext = createContext();

export const useCustomOrders = () => {
    return useContext(CustomOrdersContext);
};

export const CustomOrdersProvider = ({ children }) => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "custom_orders_gallery"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const imagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGalleryImages(imagesData);
            setLoading(false);
        }, (error) => {
            console.error("CustomOrdersContext Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addGalleryImage = async (imageFile, title) => {
        try {
            console.log("Uploading gallery image...");
            const imageUrl = await uploadImageToCloudinary(imageFile);

            console.log("Adding to Firestore...");
            await addDoc(collection(db, "custom_orders_gallery"), {
                image: imageUrl,
                title: title || "Custom Order", // Default title if none provided
                createdAt: serverTimestamp()
            });
            console.log("Gallery image added successfully!");
            return true;
        } catch (error) {
            console.error("Error adding gallery image:", error);
            throw error;
        }
    };

    const deleteGalleryImage = async (imageId) => {
        try {
            await deleteDoc(doc(db, "custom_orders_gallery", imageId));
            return true;
        } catch (error) {
            console.error("Error deleting gallery image:", error);
            throw error;
        }
    };

    const value = {
        galleryImages,
        loading,
        addGalleryImage,
        deleteGalleryImage
    };

    return (
        <CustomOrdersContext.Provider value={value}>
            {children}
        </CustomOrdersContext.Provider>
    );
};
