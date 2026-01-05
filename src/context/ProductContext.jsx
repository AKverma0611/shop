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

    const addProduct = async (productData, imageFiles = []) => {
        try {
            console.log("Starting product add...");
            let imageUrls = [];

            // Handle multiple files
            if (imageFiles && imageFiles.length > 0) {
                console.log(`Uploading ${imageFiles.length} images...`);
                // Process all uploads concurrently
                const uploadPromises = Array.from(imageFiles).map(file => uploadImageToCloudinary(file));
                imageUrls = await Promise.all(uploadPromises);
            }

            console.log("Adding to Firestore...");
            await addDoc(collection(db, "products"), {
                ...productData,
                image: imageUrls.length > 0 ? imageUrls[0] : '', // Primary image for backward compatibility
                images: imageUrls, // Array of all images
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

    const updateProduct = async (productId, productData, newImageFiles = []) => {
        try {
            const productRef = doc(db, "products", productId);
            let updatedData = { ...productData };

            // If we have existing images in productData.images, ensure it's preserved
            // (The caller should pass the 'images' array with currently kept URLs)
            let finalImages = updatedData.images || [];

            // If backward compatibility 'image' is needed and no 'images' array exists yet
            if (finalImages.length === 0 && updatedData.image) {
                finalImages = [updatedData.image];
            }

            if (newImageFiles && newImageFiles.length > 0) {
                const uploadPromises = Array.from(newImageFiles).map(file => uploadImageToCloudinary(file));
                const newImageUrls = await Promise.all(uploadPromises);
                finalImages = [...finalImages, ...newImageUrls];
            }

            updatedData.images = finalImages;
            // Update primary image to be the first one
            updatedData.image = finalImages.length > 0 ? finalImages[0] : '';

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
