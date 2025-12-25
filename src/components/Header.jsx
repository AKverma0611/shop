import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Smile } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const { wishlist } = useWishlist();
    const { currentUser, logout, openAuthModal } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Girls Collection', path: '/shop' },
        { name: 'Baby Collection', path: '/baby-collection' },
        { name: 'Custom Orders', path: '/custom-orders' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo-container">
                    <img src={logo} alt="Khushi Closet" className="logo-img" />
                    <span className="logo-text">Khushi Closet</span>
                </Link>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        {navLinks.map((link) => (
                            <li key={link.name} className="nav-item">
                                <Link
                                    to={link.path}
                                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-actions">
                    <Link to="/wishlist" className="action-btn" aria-label="Wishlist">
                        <Heart size={24} color="#333" />
                        {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </Link>

                    <div className="profile-container" style={{ position: 'relative' }}>
                        <button
                            className="action-btn"
                            onClick={() => currentUser ? setIsProfileOpen(!isProfileOpen) : openAuthModal()}
                            aria-label="Profile"
                        >
                            <User size={24} color="#333" />
                        </button>

                        {currentUser && isProfileOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-header">
                                    <Smile size={20} className="welcome-icon" />
                                    <span>Hi, {currentUser.displayName || 'User'}</span>
                                </div>
                                <button onClick={() => { logout(); setIsProfileOpen(false); }} className="profile-item">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
