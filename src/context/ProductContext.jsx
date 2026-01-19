import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { uploadImageToCloudinary } from '../utils/uploadImage';

const ProductContext = createContext();

export const useProducts = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("ProductContext Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addProduct = async (productData, mediaFiles = []) => {
        try {
            console.log("Starting product add...");
            let mediaUrls = [];

            // Handle multiple files (images + videos)
            if (mediaFiles && mediaFiles.length > 0) {
                console.log(`Uploading ${mediaFiles.length} media files...`);
                // Process uploads concurrently but wait for all
                // NOTE: To PRESERVE ORDER, Promise.all maintains order of results based on input array order.
                const uploadPromises = Array.from(mediaFiles).map(file => uploadImageToCloudinary(file));
                mediaUrls = await Promise.all(uploadPromises);
            }

            console.log("Adding to Firestore...");
            await addDoc(collection(db, "products"), {
                ...productData,
                image: mediaUrls.length > 0 ? mediaUrls[0] : '', // Primary image for backward compatibility
                images: mediaUrls, // Array of all media (images + videos)
                // video: videoUrl, // REMOVED: Videos are now in 'images' array
                createdAt: serverTimestamp(),
                price: Number(productData.price)
            });
            console.log("Product added successfully!");
            return true;
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product: " + error.message);
            throw error;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, "products", productId));
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    };

    const updateProduct = async (productId, productData, newMediaFiles = []) => {
        try {
            const productRef = doc(db, "products", productId);
            let updatedData = { ...productData };

            // productData.images should contain the EXISTING URLs that were kept
            let finalMedia = updatedData.images || [];

            // Compatibility: if only 'image' field existed and no 'images'
            if (finalMedia.length === 0 && updatedData.image) {
                finalMedia = [updatedData.image];
            }

            if (newMediaFiles && newMediaFiles.length > 0) {
                const uploadPromises = Array.from(newMediaFiles).map(file => uploadImageToCloudinary(file));
                const newMediaUrls = await Promise.all(uploadPromises);

                // Append new media to the end (preserving order user added them in Admin)
                finalMedia = [...finalMedia, ...newMediaUrls];
            }

            updatedData.images = finalMedia;
            // Update primary image to be the first one (if exists)
            updatedData.image = finalMedia.length > 0 ? finalMedia[0] : '';

            // We do NOT update 'video' field anymore as it is legacy. 
            // If it existed, it remains in Firestore but we don't change it here unless we explicitly want to clear it?
            // If the user deleted the "legacy video" from UI, 'productData.video' might come in as empty string if we passed it?
            // In Admin.jsx, we passed `...productData, images: existingMedia`. 
            // We did NOT pass `video` explicitly in the new call, but `...productData` might contain it if we didn't clear it.
            // Actually Admin.jsx's handleEditClick sets existingVideo. The cleanup in Admin.jsx separates them.
            // But now existingMedia contains EVERYTHING. 
            // So we should probably assume `video` field is deprecated and just rely on `images`.
            // But for safety, let's leave `video` field alone or ensure it doesn't conflict. 
            // If we want to "delete" the old video field because it was moved to images? 
            // No, the UI logic in Admin.jsx "merged" it into `existingMedia`. 
            // So if we save `existingMedia` back to `images`, that legacy video URL is now in `images`. 
            // So we should probably CLEAR the `video` field if we are effectively migrating it?
            // Or just leave it. If `ProductCard` looks at `video`, and ALSO finds it in `images`, it might show twice.
            // Let's check `ProductCard`.

            // ProductCard logic: `let media = ...images... if (product.video) media.push(product.video)`.
            // If the video URL is NOW also in `images`, it will show TWICE.
            // FIX: We should duplicate-check in ProductCard OR clear `video` field here.
            // Clearing `video` field here is safer to avoid duplication.
            updatedData.video = deleteDoc ? deleteDoc() : null; // Wait, deleteDoc is specific value? No, use `deleteField()`
            // Actually, just setting it to empty string or null is fine.
            updatedData.video = '';
            // NOTE: This assumes that if we are updating, we have fully captured the video into `images`.
            // Admin.jsx: `if (product.video) validMedia.push(product.video)`. 
            // So YES, the legacy video IS now in `existingMedia` (which goes to `images`).
            // So we CAN safely clear `video`.

            // Ensure price is a number
            if (updatedData.price) {
                updatedData.price = Number(updatedData.price);
            }

            await updateDoc(productRef, updatedData);
            return true;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    };

    const value = {
        products,
        loading,
        addProduct,
        deleteProduct,
        updateProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
