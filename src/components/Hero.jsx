import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">Where Fashion Meets Your Vibe</h1>
                <p className="hero-subtitle">Discover the latest trends in girls' fashion. Handmade, customized, and uniquely you.</p>
                <div className="hero-buttons">
                    <Link to="/shop" className="btn btn-primary">
                        Shop Collection <ArrowRight size={18} />
                    </Link>
                    <Link to="/custom-orders" className="btn btn-outline">
                        Custom Orders
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
