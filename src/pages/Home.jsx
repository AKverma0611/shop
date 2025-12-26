import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import PromoBanner from '../components/PromoBanner';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import { useProducts } from '../context/ProductContext';
import './Home.css';

const Home = () => {
    const { products, loading } = useProducts();

    const newArrivals = products.filter(p => p.isNew).slice(0, 4);
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="home-page">
            <Hero />
            <PromoBanner />

            <section className="category-nav-section container">
                <h2 className="section-title">Shop by Collection</h2>
                <div className="category-buttons-container">
                    <Link to="/shop" className="category-card-btn">
                        <h3>Girls Collection</h3>
                        <span>Dresses, Sets & More</span>
                    </Link>
                    <Link to="/baby-collection" className="category-card-btn">
                        <h3>Baby Collection</h3>
                        <span>Cute Outfits for Little Ones</span>
                    </Link>
                </div>
            </section>

            <section className="section container" style={{ padding: '60px 20px' }}>
                <h2 className="section-title">New Arrivals</h2>
                <p className="section-subtitle">Fresh looks just for you</p>
                <ProductGrid products={newArrivals} />
            </section>

            <section className="section container" style={{ padding: '60px 20px', backgroundColor: 'var(--color-bg-soft)' }}>
                <h2 className="section-title">Trending Now</h2>
                <p className="section-subtitle">Most loved by our customers</p>
                <ProductGrid products={bestSellers} />
            </section>

            <section className="section container" style={{ padding: '60px 20px' }}>
                <h2 className="section-title">Happy Customers</h2>
                <p className="section-subtitle">What they say about us</p>
                <Testimonials />
            </section>
        </div>
    );
};

export default Home;
