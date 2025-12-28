import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ activeFilters, onFilterChange, categories, types }) => {
    // Default options if not provided
    const availableCategories = categories || [];
    const availableTypes = types || ["Casual", "Party Wear", "Formal", "Traditional"];


    const handleCategoryChange = (category) => {
        const newCategories = activeFilters.categories.includes(category)
            ? activeFilters.categories.filter(c => c !== category)
            : [...activeFilters.categories, category];

        onFilterChange({ ...activeFilters, categories: newCategories });
    };



    const handleTypeChange = (type) => {
        const newTypes = activeFilters.types.includes(type)
            ? activeFilters.types.filter(t => t !== type)
            : [...activeFilters.types, type];

        onFilterChange({ ...activeFilters, types: newTypes });
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-group">
                <h3 className="filter-title">Categories</h3>
                <ul className="filter-list">
                    {availableCategories.map(cat => (
                        <li key={cat}>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.categories.includes(cat)}
                                    onChange={() => handleCategoryChange(cat)}
                                /> {cat}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>



            <div className="filter-group">
                <h3 className="filter-title">Occasion</h3>
                <ul className="filter-list">
                    {availableTypes.map(type => (
                        <li key={type}>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.types.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                /> {type}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {(activeFilters.categories.length > 0 || activeFilters.types.length > 0) && (
                <button
                    className="clear-filters-btn"
                    onClick={() => onFilterChange({ categories: [], colors: [], types: [] })}
                >
                    Clear All Filters
                </button>
            )}
        </aside>
    );
};

export default FilterSidebar;
