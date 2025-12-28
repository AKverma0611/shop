import React, { useState, useEffect, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { useProducts } from '../context/ProductContext';
import { useConfig } from '../context/ConfigContext';
import './Shop.css';

const BabyCollection = () => {
    const { products: dynamicProducts, loading } = useProducts();
    const { babyCategories, productTypes } = useConfig();

    // Filter State
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        colors: [],
        types: []
    });

    // 1. Separate Baby products
    const babyProducts = useMemo(() => {
        return dynamicProducts.filter(p => p.section === 'baby');
    }, [dynamicProducts]);

    // 2. Apply active filters
    const filteredProducts = useMemo(() => {
        return babyProducts.filter(product => {
            // Category Filter
            if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
                return false;
            }

            // Type Filter
            if (activeFilters.types.length > 0 && !activeFilters.types.includes(product.type)) {
                return false;
            }

            return true;
        });
    }, [babyProducts, activeFilters]);

    if (loading) return <div className="text-center" style={{ padding: '50px' }}>Loading Baby Collection...</div>;

    return (
        <div className="page-container container" style={{ padding: '40px 20px' }}>
            <h1 className="section-title">Baby Collection</h1>
            <p className="section-subtitle">Comfortable & Cute Outfits for your Little Ones</p>

            <div className="shop-layout">
                <FilterSidebar
                    activeFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                    categories={babyCategories}
                    types={productTypes}
                />
                <div className="shop-content">
                    {filteredProducts.length === 0 ? (
                        <div className="no-products">
                            <p>No products found matching your filters.</p>
                        </div>
                    ) : (
                        <ProductGrid products={filteredProducts} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BabyCollection;
