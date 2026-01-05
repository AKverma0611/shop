import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useReviews } from '../context/ReviewsContext';
import { Upload, CheckCircle, Trash2, Edit2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCustomOrders } from '../context/CustomOrdersContext';
import { useConfig } from '../context/ConfigContext';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import './Admin.css';

const Admin = () => {
    // Auth State
    const { getUserRole } = useAuth();
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(true);
    const [loginError, setLoginError] = useState('');

    const { products, addProduct, deleteProduct, updateProduct } = useProducts();
    const { reviews, deleteReview } = useReviews();
    const { galleryImages, addGalleryImage, deleteGalleryImage } = useCustomOrders();
    const { promoBanner, updatePromoBanner, girlsCategories, babyCategories, productTypes, removeCategory, removeType, addCategory, addType } = useConfig();
    const [activeTab, setActiveTab] = useState('girls');
    const [loading, setLoading] = useState(false);
    const [customOrderTitle, setCustomOrderTitle] = useState('');

    // Promo Banner State
    const [bannerText, setBannerText] = useState('');
    const [isBannerActive, setIsBannerActive] = useState(false);

    useEffect(() => {
        if (promoBanner) {
            setBannerText(promoBanner.text || '');
            setIsBannerActive(promoBanner.isActive || false);
        }
    }, [promoBanner]);
    const [success, setSuccess] = useState('');

    // Edit Mode State
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        details: '',
        type: 'Casual',
        isNew: true,
        isBestSeller: false
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [newImages, setNewImages] = useState([]); // Array of objects { file, preview }
    const [existingImages, setExistingImages] = useState([]); // Array of URLs string

    // const girlsCategories = ['Dresses', 'Gowns', 'Tops', 'Frocks', 'Sets', 'Lehenga'];
    // const babyCategories = ['Onesies', 'Rompers', 'Sets', 'Frocks', 'Accessories'];
    // const productTypes = ['Casual', 'Party Wear', 'Formal', 'Traditional'];

    const [isManualCategory, setIsManualCategory] = useState(false);
    const [isManualType, setIsManualType] = useState(false);

    // Filter products for the active tab (using 'section' field which we save)
    // Note: We need to filter based on how we saved them. In AddProduct we used 'section'
    const filteredProducts = products.filter(p => !p.section || p.section === activeTab);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Verify Admin Role
                const role = await getUserRole(currentUser.uid);
                if (role !== 'admin') {
                    // Not an admin, silently log out
                    console.log("Not an admin, logging out");
                    await signOut(auth);
                    setUser(null);
                    setAuthLoading(false);
                    return;
                }
            }
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const role = await getUserRole(userCredential.user.uid);

            if (role !== 'admin') {
                await signOut(auth);
                setLoginError("Access Denied: You do not have administrator privileges.");
            }
        } catch (error) {
            console.error("Login failed", error);
            setLoginError("Invalid Email or Password");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewImages(prev => [...prev, { file, preview: reader.result }]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            category: '',
            details: '',
            type: 'Casual',
            isNew: true,
            isBestSeller: false
        });
        setNewImages([]);
        setExistingImages([]);
        setEditingProduct(null);
        setIsManualCategory(false);
        setIsManualType(false);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            details: product.details || '',
            type: product.type || 'Casual',
            isNew: product.isNew || false,
            isBestSeller: product.isBestSeller || false
        });

        const currentCategories = activeTab === 'girls' ? girlsCategories : babyCategories;
        setIsManualCategory(!currentCategories.includes(product.category));
        setIsManualType(!productTypes.includes(product.type || 'Casual'));
        // Initialize existing images
        let validImages = [];
        if (product.images && product.images.length > 0) {
            validImages = product.images;
        } else if (product.image) {
            validImages = [product.image];
        }
        setExistingImages(validImages);
        setNewImages([]);

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId);
                setSuccess("Product deleted successfully!");
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                alert("Failed to delete product: " + error.message);
            }
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await updatePromoBanner(bannerText, isBannerActive);
            setSuccess("Settings saved successfully!");
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            alert("Failed to save settings: " + error.message);
        }
    };

    const handleGalleryDelete = async (imageId) => {
        if (window.confirm("Are you sure you want to delete this image from the gallery?")) {
            try {
                await deleteGalleryImage(imageId);
                setSuccess("Gallery image deleted successfully!");
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                alert("Failed to delete gallery image: " + error.message);
            }
        }
    };

    const handleReviewDelete = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteReview(reviewId);
                setSuccess("Review deleted successfully!");
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                alert("Failed to delete review: " + error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productData = {
                ...formData,
                section: activeTab
            };

            const imageFilesToUpload = newImages.map(img => img.file);

            if (activeTab === 'custom') {
                if (imageFilesToUpload.length === 0) {
                    alert("Please select an image");
                    setLoading(false);
                    return;
                }
                // Custom gallery only takes one image for now, take the first one
                await addGalleryImage(imageFilesToUpload[0], customOrderTitle);
                setSuccess("Gallery image added successfully!");
                setCustomOrderTitle('');
            } else {
                // Check if we should add manual values to the list
                if (isManualCategory && formData.category) {
                    // Optionally add to list? For now just let them be custom strings.
                    // But if the user wants to "Delete" them later, they need to be in the list.
                    // Let's AUTO-ADD to the list if it's manual entry, so they can reuse it!
                    // Actually, maybe ask? No, just add it. It's better for UX.
                    await addCategory(activeTab, formData.category);
                }
                if (isManualType && formData.type) {
                    await addType(formData.type);
                }

                if (editingProduct) {
                    await updateProduct(editingProduct.id, { ...productData, images: existingImages }, imageFilesToUpload);
                    setSuccess("Product updated successfully!");
                } else {
                    await addProduct(productData, imageFilesToUpload);
                    setSuccess("Product added successfully!");
                }
            }

            resetForm();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            // Error handling is done in Context
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="text-center" style={{ padding: '50px' }}>Loading...</div>;

    if (!user) {
        return (
            <div className="login-container container">
                <div className="login-card">
                    <h2 className="section-title">Admin Login</h2>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@khushicloset.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="******"
                            />
                        </div>
                        {loginError && <p className="error-text">{loginError}</p>}
                        <button type="submit" className="submit-btn">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container container" style={{ padding: '40px 20px' }}>
            <div className="admin-header">
                <h1 className="section-title">Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'girls' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('girls'); resetForm(); }}
                >
                    Girls Collection
                </button>
                <button
                    className={`tab-btn ${activeTab === 'baby' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('baby'); resetForm(); }}
                >
                    Baby Collection
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('reviews'); resetForm(); }}
                >
                    Manage Reviews
                </button>
                <button
                    className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('custom'); resetForm(); }}
                >
                    Custom Orders
                </button>
                <button
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('settings'); }}
                >
                    Settings
                </button>
            </div>

            <div className="admin-content">
                <div className="form-header" style={{ display: (activeTab === 'reviews' || activeTab === 'settings') ? 'none' : 'flex' }}>
                    <h2 className="form-title">
                        {activeTab === 'custom' ? 'Add New Gallery Image' : (editingProduct ? 'Edit Product' : `Add New ${activeTab === 'girls' ? 'Girl' : 'Baby'} Product`)}
                    </h2>
                    {editingProduct && (
                        <button onClick={resetForm} className="cancel-edit-btn">
                            <X size={16} /> Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="product-form" style={{ display: (activeTab === 'reviews' || activeTab === 'settings') ? 'none' : 'block' }}>
                    <div className="form-group">
                        <label>Product Image</label>
                        <div className="image-upload-container">
                            <div className="image-upload-container" style={{ display: 'block' }}>
                                <div className="images-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                                    {/* Existing Images */}
                                    {existingImages.map((url, index) => (
                                        <div key={`existing-${index}`} className="image-preview" style={{ position: 'relative', height: '100px' }}>
                                            <img src={url} alt={`Existing ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                            <button type="button" onClick={() => removeExistingImage(index)} className="remove-image" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>×</button>
                                        </div>
                                    ))}
                                    {/* New Images */}
                                    {newImages.map((img, index) => (
                                        <div key={`new-${index}`} className="image-preview" style={{ position: 'relative', height: '100px' }}>
                                            <img src={img.preview} alt={`New ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px dashed #ff4081' }} />
                                            <button type="button" onClick={() => removeNewImage(index)} className="remove-image" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>×</button>
                                        </div>
                                    ))}

                                    <label className="upload-box" style={{ height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', borderRadius: '8px', cursor: 'pointer' }}>
                                        <Upload size={24} color="#888" />
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>Add Photo</span>
                                        <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row" style={{ display: activeTab === 'custom' ? 'none' : 'flex' }}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Floral Dress"
                                required={activeTab !== 'custom'}
                            />
                        </div>
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="e.g. 1299"
                                required={activeTab !== 'custom'}
                            />
                        </div>
                    </div>

                    {activeTab === 'custom' && (
                        <div className="form-group">
                            <label>Title (Optional)</label>
                            <input
                                type="text"
                                value={customOrderTitle}
                                onChange={(e) => setCustomOrderTitle(e.target.value)}
                                placeholder="e.g. Happy Client"
                            />
                        </div>
                    )}

                    <div className="form-row" style={{ display: activeTab === 'custom' ? 'none' : 'flex' }}>
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <label style={{ marginBottom: 0 }}>Category</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsManualCategory(!isManualCategory);
                                        setFormData(prev => ({ ...prev, category: '' }));
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#ff4081', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {isManualCategory ? 'Select from List' : 'Enter Manually'}
                                </button>
                            </div>
                            {isManualCategory ? (
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="Enter Category"
                                    required={activeTab !== 'custom'}
                                />
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required={activeTab !== 'custom'}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="">Select Category</option>
                                        {(activeTab === 'girls' ? girlsCategories : babyCategories).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {formData.category && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                if (window.confirm(`Delete category "${formData.category}"?`)) {
                                                    await removeCategory(activeTab, formData.category);
                                                    setFormData(prev => ({ ...prev, category: '' }));
                                                }
                                            }}
                                            className="action-btn delete-btn"
                                            style={{ padding: '8px', marginBottom: '0' }}
                                            title="Delete Category"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="form-group" style={{ display: activeTab === 'custom' ? 'none' : 'block' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <label style={{ marginBottom: 0 }}>Type</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsManualType(!isManualType);
                                        setFormData(prev => ({ ...prev, type: !isManualType ? '' : 'Casual' }));
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#ff4081', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {isManualType ? 'Select from List' : 'Enter Manually'}
                                </button>
                            </div>
                            {isManualType ? (
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    placeholder="Enter Type"
                                />
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        style={{ flex: 1 }}
                                    >
                                        {productTypes.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    {formData.type && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                if (window.confirm(`Delete type "${formData.type}"?`)) {
                                                    await removeType(formData.type);
                                                    setFormData(prev => ({ ...prev, type: 'Casual' }));
                                                }
                                            }}
                                            className="action-btn delete-btn"
                                            style={{ padding: '8px', marginBottom: '0' }}
                                            title="Delete Type"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group" style={{ display: activeTab === 'custom' ? 'none' : 'block' }}>
                        <label>Details / Description</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleInputChange}
                            placeholder="Product details..."
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-row checkbox-row" style={{ display: activeTab === 'custom' ? 'none' : 'flex' }}>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isNew"
                                checked={formData.isNew}
                                onChange={handleInputChange}
                            />
                            New Arrival
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isBestSeller"
                                checked={formData.isBestSeller}
                                onChange={handleInputChange}
                            />
                            Best Seller
                        </label>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (editingProduct ? 'Updating...' : 'Uploading...') : (activeTab === 'custom' ? 'Add Image' : (editingProduct ? 'Update Product' : 'Add Product'))}
                    </button>

                    {success && <div className="success-message"><CheckCircle size={20} /> {success}</div>}
                </form>
            </div>

            {/* Content Switcher */}
            {activeTab === 'reviews' ? (
                <div className="product-list-section">
                    <h2 className="section-title" style={{ fontSize: '1.8rem', marginTop: '40px' }}>Customer Reviews</h2>
                    <div className="admin-product-grid">
                        {reviews.length === 0 ? (
                            <p className="no-products">No reviews found.</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="admin-product-card" style={{ textAlign: 'left' }}>
                                    {review.image && (
                                        <div className="admin-product-img" style={{ height: '150px' }}>
                                            <img src={review.image} alt="Review" style={{ objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div className="admin-product-info">
                                        <h4>{review.name} <span style={{ fontSize: '0.8rem', color: '#888' }}>({review.rating} Stars)</span></h4>
                                        <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>"{review.text}"</p>
                                        <div className="admin-actions">
                                            <button onClick={() => handleReviewDelete(review.id)} className="action-btn delete-btn">
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : activeTab === 'custom' ? (
                <div className="product-list-section">
                    <h2 className="section-title" style={{ fontSize: '1.8rem', marginTop: '40px' }}>Gallery Images</h2>
                    <div className="admin-product-grid">
                        {galleryImages.length === 0 ? (
                            <p className="no-products">No images found.</p>
                        ) : (
                            galleryImages.map(img => (
                                <div key={img.id} className="admin-product-card">
                                    <div className="admin-product-img">
                                        <img src={img.image} alt={img.title} />
                                    </div>
                                    <div className="admin-product-info">
                                        <h4>{img.title}</h4>
                                        <div className="admin-actions">
                                            <button onClick={() => handleGalleryDelete(img.id)} className="action-btn delete-btn">
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : activeTab === 'settings' ? (
                <div className="product-list-section">
                    <h2 className="section-title" style={{ fontSize: '1.8rem', marginTop: '40px' }}>Site Configuration</h2>
                    <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--color-primary)' }}>Promo Banner</h3>
                        <form onSubmit={handleSaveSettings}>
                            <div className="form-group">
                                <label>Banner Text</label>
                                <input
                                    type="text"
                                    value={bannerText}
                                    onChange={(e) => setBannerText(e.target.value)}
                                    placeholder="e.g. Flash Sale! 50% Off"
                                    required
                                />
                            </div>
                            <div className="form-row checkbox-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isBannerActive}
                                        onChange={(e) => setIsBannerActive(e.target.checked)}
                                    />
                                    Show Banner on Home Page
                                </label>
                            </div>
                            <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>Save Settings</button>
                            {success && <div className="success-message" style={{ marginTop: '15px' }}><CheckCircle size={20} /> {success}</div>}
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    {/* Product List Section */}
                    <div className="product-list-section">
                        <h2 className="section-title" style={{ fontSize: '1.8rem', marginTop: '40px' }}>Manage Products</h2>
                        <div className="admin-product-grid">
                            {filteredProducts.length === 0 ? (
                                <p className="no-products">No products found in {activeTab === 'girls' ? 'Girls' : 'Baby'} collection.</p>
                            ) : (
                                filteredProducts.map(product => (
                                    <div key={product.id} className="admin-product-card">
                                        <div className="admin-product-img">
                                            <img src={product.image} alt={product.name} />
                                        </div>
                                        <div className="admin-product-info">
                                            <h4>{product.name}</h4>
                                            <p>₹{product.price}</p>
                                            <div className="admin-actions">
                                                <button onClick={() => handleEditClick(product)} className="action-btn edit-btn">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteClick(product.id)} className="action-btn delete-btn">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )} {/* End of Product Tab Logic */}
        </div>
    );
};

export default Admin;
