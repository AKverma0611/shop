import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
    return (
        <div className="page-container container">
            <div className="terms-container">
                <div className="terms-header">
                    <h1 className="terms-title">Terms & Conditions</h1>
                    <p className="terms-subtitle">Please read our terms carefully before placing an order</p>
                </div>

                <div className="terms-section">
                    <h2>1. Products & Orders</h2>
                    <div className="terms-content">
                        <p>
                            All our creations are handcrafted with love, ensuring each piece is unique. We gladly accept custom orders tailored to your specific size, fabric, and design preferences.
                        </p>
                        <ul>
                            <li>Please provide accurate measurements. Any errors caused by wrong information provided by the customer are the customer’s responsibility.</li>
                            <li>All images on our website and social media are for illustration purposes only. Slight variations in color, fabric, or design may occur as a testament to the handcrafted nature of our work.</li>
                        </ul>
                    </div>
                </div>

                <div className="terms-section">
                    <h2>2. Order Confirmation & Payment</h2>
                    <div className="terms-content">
                        <ul>
                            <li>Orders are confirmed only after full payment or as per the agreed payment terms.</li>
                            <li>We accept UPI, GPay, PhonePe, and COD (if available).</li>
                            <li>Prices are subject to change without prior notice.</li>
                        </ul>
                    </div>
                </div>

                <div className="terms-section">
                    <h2>3. Production & Delivery</h2>
                    <div className="terms-content">
                        <ul>
                            <li><strong>Production time:</strong> 7–10 days for made-to-order items (can vary based on order volume).</li>
                            <li><strong>Shipping:</strong> We ship PAN India. Delivery time may vary depending on location and courier service.</li>
                            <li>Customers will receive a tracking number (if applicable) once the order is dispatched.</li>
                        </ul>
                    </div>
                </div>

                <div className="terms-section">
                    <h2>4. Returns & Exchanges</h2>
                    <div className="terms-content">
                        <p>Due to the customized nature of our products, returns or exchanges are not accepted unless there is a manufacturing defect.</p>
                        <ul>
                            <li>Any manufacturing defects must be reported within 2 days of receiving the product, with photos.</li>
                            <li>We reserve the right to inspect and verify defects before offering a replacement or refund.</li>
                        </ul>
                    </div>
                </div>

                <div className="terms-section">
                    <h2>5. Cancellations</h2>
                    <div className="terms-content">
                        <ul>
                            <li>Orders can be cancelled within 24 hours of confirmation.</li>
                            <li>Custom / personalized orders cannot be cancelled once stitching/production has started.</li>
                        </ul>
                    </div>
                </div>

                <div className="terms-section">
                    <h2>6. Liability</h2>
                    <div className="terms-content">
                        <ul>
                            <li><strong>Khushi Closet</strong> is not responsible for delays caused by courier services, natural calamities, or unforeseen circumstances.</li>
                            <li>All disputes will be handled in accordance with Indian law.</li>
                        </ul>
                    </div>
                </div>

                <div className="terms-section">
                    <h2>7. Privacy Policy</h2>
                    <div className="terms-content">
                        <ul>
                            <li>Customer information, including contact details and address, will only be used for order processing and delivery.</li>
                            <li>We do not share personal information with third parties for marketing purposes.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
