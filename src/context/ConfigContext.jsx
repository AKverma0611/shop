import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const ConfigContext = createContext();

export const useConfig = () => {
    return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
    const [promoBanner, setPromoBanner] = useState({
        text: '',
        isActive: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to promo_banner document in 'settings' collection
        const promoRef = doc(db, "settings", "promo_banner");
        const unsubscribe = onSnapshot(promoRef, (docSnap) => {
            if (docSnap.exists()) {
                setPromoBanner(docSnap.data());
            } else {
                // Initialize if not exists (Local state only, don't write to DB)
                const initialData = { text: "", isActive: false };
                setPromoBanner(initialData);
            }
            setLoading(false);
        }, (error) => {
            console.error("ConfigContext Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updatePromoBanner = async (text, isActive) => {
        try {
            await setDoc(doc(db, "settings", "promo_banner"), {
                text,
                isActive
            });
            return true;
        } catch (error) {
            console.error("Error updating promo banner:", error);
            throw error;
        }
    };

    const value = {
        promoBanner,
        loading,
        updatePromoBanner
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};
