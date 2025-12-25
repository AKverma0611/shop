import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useReviews } from '../context/ReviewsContext';
import { Upload, CheckCircle, Trash2, Edit2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
    const [activeTab, setActiveTab] = useState('girls');
    const [loading, setLoading] = useState(false);
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
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const girlsCategories = ['Dresses', 'Gowns', 'Tops', 'Frocks', 'Sets', 'Lehenga'];
    const babyCategories = ['Onesies', 'Rompers', 'Sets', 'Frocks', 'Accessories'];

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
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
        setImageFile(null);
        setImagePreview(null);
        setEditingProduct(null);
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
        setImagePreview(product.image);
        // We don't set imageFile here unless they upload a new one

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

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData, imageFile);
                setSuccess("Product updated successfully!");
            } else {
                await addProduct(productData, imageFile);
                setSuccess("Product added successfully!");
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
            </div>

            <div className="admin-content">
                <div className="form-header">
                    <h2 className="form-title">
                        {editingProduct ? 'Edit Product' : `Add New ${activeTab === 'girls' ? 'Girl' : 'Baby'} Product`}
                    </h2>
                    {editingProduct && (
                        <button onClick={resetForm} className="cancel-edit-btn">
                            <X size={16} /> Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="product-form" style={{ display: activeTab === 'reviews' ? 'none' : 'block' }}>
                    <div className="form-group">
                        <label>Product Image</label>
                        <div className="image-upload-container">
                            {imagePreview ? (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" />
                                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} className="remove-image">×</button>
                                </div>
                            ) : (
                                <label className="upload-box">
                                    <Upload size={24} />
                                    <span>Click to upload image</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} required={!editingProduct} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Floral Dress"
                                required
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
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {(activeTab === 'girls' ? girlsCategories : babyCategories).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="Casual">Casual</option>
                                <option value="Party Wear">Party Wear</option>
                                <option value="Formal">Formal</option>
                                <option value="Traditional">Traditional</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Details / Description</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleInputChange}
                            placeholder="Product details..."
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-row checkbox-row">
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
                        {loading ? (editingProduct ? 'Updating...' : 'Uploading...') : (editingProduct ? 'Update Product' : 'Add Product')}
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
