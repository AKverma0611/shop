import React from 'react';
import showcase2 from '../assets/showcase-2.png';

const About = () => {
    return (
        <div className="page-container container" style={{ padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="section-title">About Khushi Closet</h1>
                <p className="section-subtitle">Where Fashion Meets Your Vibe</p>

                <div style={{ margin: '40px 0', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={showcase2} alt="About Us" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                </div>

                <div style={{ lineHeight: '1.8', color: 'var(--color-text-light)' }}>
                    <p style={{ marginBottom: '20px' }}>
                        Welcome to <strong>Khushi Closet</strong>, a brand dedicated to making every girl feel confident, stylish, and beautiful.
                        We believe that fashion is not just about clothes; it's about expressing who you are.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        Our journey started with a simple idea: to create handmade, customized outfits that fit perfectly and look premium,
                        without the premium price tag. From trendy party wear to comfortable casuals, we put our heart into every stitch.
                    </p>
                    <p>
                        Whether you're looking for a custom-made gown for a special occasion or a cute top for a day out,
                        Khushi Closet is here to make your fashion dreams come true.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
