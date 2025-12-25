import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    if (!isAuthModalOpen) return null;

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.email, formData.password, formData.name);
            }
            closeAuthModal();
        } catch (err) {
            console.error(err);
            let msg = err.message;
            if (msg.includes('auth/wrong-password')) msg = 'Incorrect password.';
            if (msg.includes('auth/user-not-found')) msg = 'No account found with this email.';
            if (msg.includes('auth/email-already-in-use')) msg = 'Email already in use.';
            if (msg.includes('auth/weak-password')) msg = 'Password should be at least 6 characters.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={closeAuthModal}>
            <div className="auth-modal-container" onClick={e => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={closeAuthModal}>
                    <X size={24} />
                </button>

                <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Login to access your orders & wishlist' : 'Sign up to start your journey with us'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <div className="input-icon"><User size={20} /></div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <div className="input-icon"><Mail size={20} /></div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <div className="input-icon"><Lock size={20} /></div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button className="text-btn" onClick={toggleMode}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
