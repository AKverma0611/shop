import React from 'react';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>Khushi Closet</h3>
                    <p>Where Fashion Meets Your Vibe. Premium handmade and customized outfits for girls.</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/shop">Shop Collection</a></li>
                        <li><a href="/custom-orders">Custom Orders</a></li>
                        <li><a href="/about">About Us</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <ul>
                        <li><Phone size={16} /> +91 62642 46210</li>
                        <li><Mail size={16} /> hello@khushicloset.com</li>
                        <li><Instagram size={16} /> @khushi__closet</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Khushi Closet. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
