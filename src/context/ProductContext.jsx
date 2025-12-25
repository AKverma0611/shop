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
        });

        return () => unsubscribe();
    }, []);

    const addProduct = async (productData, imageFile) => {
        try {
            console.log("Starting product add...");
            let imageUrl = '';
            if (imageFile) {
                console.log("Uploading image...");
                imageUrl = await uploadImageToCloudinary(imageFile);
            }

            console.log("Adding to Firestore...");
            await addDoc(collection(db, "products"), {
                ...productData,
                image: imageUrl,
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

    const updateProduct = async (productId, productData, imageFile) => {
        try {
            const productRef = doc(db, "products", productId);
            let updatedData = { ...productData };

            if (imageFile) {
                const imageUrl = await uploadImageToCloudinary(imageFile);
                updatedData.image = imageUrl;
            }

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
