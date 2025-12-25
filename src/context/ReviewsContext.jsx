import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { uploadImageToCloudinary } from '../utils/uploadImage';

const ReviewsContext = createContext();

export const useReviews = () => {
    return useContext(ReviewsContext);
};

export const ReviewsProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addReview = async (reviewData, imageFile) => {
        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImageToCloudinary(imageFile);
            }

            await addDoc(collection(db, "reviews"), {
                ...reviewData,
                image: imageUrl,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error adding review:", error);
            throw error;
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            await deleteDoc(doc(db, "reviews", reviewId));
            return true;
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    };

    const value = {
        reviews,
        loading,
        addReview,
        deleteReview
    };

    return (
        <ReviewsContext.Provider value={value}>
            {children}
        </ReviewsContext.Provider>
    );
};
