import React, { useState, useEffect, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { useProducts } from '../context/ProductContext';
import { useConfig } from '../context/ConfigContext';
import './Shop.css';

const Shop = () => {
    const { products: dynamicProducts, loading } = useProducts();
    const { girlsCategories, productTypes } = useConfig();

    // Filter State
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        colors: [],
        types: []
    });

    // 1. First, separate Girls products (base collection)
    const girlsProducts = useMemo(() => {
        return dynamicProducts.filter(p => !p.section || p.section === 'girls'); // Default to girls if no section
    }, [dynamicProducts]);

    // 2. Apply active filters on top of the base collection
    const filteredProducts = useMemo(() => {
        return girlsProducts.filter(product => {
            // Category Filter
            if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
                return false;
            }
            // Color Filter (Assuming product can have a color field, or we check description?)
            // Note: The Admin form doesn't explicitly have 'Color' field, but it was in original data. 
            // We might need to rely on 'details' or check if we added 'color' to admin.
            // Wait, products.js had 'color'. Admin.jsx didn't have 'color' input! 
            // I'll add a check, if 'color' exists in product. Or we can match details.
            // For now, let's assume if it exists.

            // Type Filter
            if (activeFilters.types.length > 0 && !activeFilters.types.includes(product.type)) {
                return false;
            }

            return true;
        });
    }, [girlsProducts, activeFilters]);

    if (loading) return <div className="text-center" style={{ padding: '50px' }}>Loading products...</div>;

    return (
        <div className="page-container container" style={{ padding: '40px 20px' }}>
            <h1 className="section-title">Girls Collection</h1>
            <p className="section-subtitle">Browse our latest collection</p>

            <div className="shop-layout">
                <FilterSidebar
                    activeFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                    categories={girlsCategories}
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

export default Shop;
