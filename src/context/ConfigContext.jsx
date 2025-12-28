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
        text: '',
        isActive: false
    });
    const [girlsCategories, setGirlsCategories] = useState([]);
    const [babyCategories, setBabyCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to promo_banner document in 'settings' collection
        const promoRef = doc(db, "settings", "promo_banner");
        const unsubscribe = onSnapshot(promoRef, (docSnap) => {
            if (docSnap.exists()) {
                setPromoBanner(docSnap.data());
                setPromoBanner(initialData);
            }
        });

        const categoriesRef = doc(db, "settings", "categories");
        const unsubCat = onSnapshot(categoriesRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setGirlsCategories(data.girls || ['Dresses', 'Gowns', 'Tops', 'Frocks', 'Sets', 'Lehenga']);
                setBabyCategories(data.baby || ['Onesies', 'Rompers', 'Sets', 'Frocks', 'Accessories']);
            } else {
                setGirlsCategories(['Dresses', 'Gowns', 'Tops', 'Frocks', 'Sets', 'Lehenga']);
                setBabyCategories(['Onesies', 'Rompers', 'Sets', 'Frocks', 'Accessories']);
            }
        });

        const typesRef = doc(db, "settings", "types");
        const unsubType = onSnapshot(typesRef, (docSnap) => {
            if (docSnap.exists()) {
                setProductTypes(docSnap.data().list || ['Casual', 'Party Wear', 'Formal', 'Traditional']);
            } else {
                setProductTypes(['Casual', 'Party Wear', 'Formal', 'Traditional']);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            unsubCat();
            unsubType();
        };
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

    const updateCategories = async (type, newCategories) => {
        try {
            await setDoc(doc(db, "settings", "categories"), {
                girls: type === 'girls' ? newCategories : girlsCategories,
                baby: type === 'baby' ? newCategories : babyCategories
            }, { merge: true });
        } catch (error) {
            console.error("Error updating categories:", error);
            throw error;
        }
    };

    const updateProductTypes = async (newTypes) => {
        try {
            await setDoc(doc(db, "settings", "types"), {
                list: newTypes
            });
        } catch (error) {
            console.error("Error updating types:", error);
            throw error;
        }
    };

    const addCategory = async (section, category) => {
        const current = section === 'girls' ? girlsCategories : babyCategories;
        if (!current.includes(category)) {
            await updateCategories(section, [...current, category]);
        }
    };

    const removeCategory = async (section, category) => {
        const current = section === 'girls' ? girlsCategories : babyCategories;
        await updateCategories(section, current.filter(c => c !== category));
    };

    const addType = async (type) => {
        if (!productTypes.includes(type)) {
            await updateProductTypes([...productTypes, type]);
        }
    };

    const removeType = async (type) => {
        await updateProductTypes(productTypes.filter(t => t !== type));
    };

    const value = {
        promoBanner,
        loading,
        updatePromoBanner,
        girlsCategories,
        babyCategories,
        productTypes,
        addCategory,
        removeCategory,
        addType,
        removeType
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};
