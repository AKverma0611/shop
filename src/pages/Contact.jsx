import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format the message for WhatsApp
        const whatsappMessage = `*New Contact Inquiry*
        
*Name:* ${formData.name}
*Email:* ${formData.email}

*Message:*
${formData.message}`;

        // WhatsApp API URL (using the number provided: 6264246210)
        const phoneNumber = "916264246210";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Open WhatsApp
        window.open(url, '_blank');
    };

    return (
        <div className="page-container container" style={{ padding: '40px 20px' }}>
            <h1 className="section-title">Contact Us</h1>
            <p className="section-subtitle">We'd love to hear from you</p>

            <div className="contact-grid">
                <div className="contact-info">
                    <div className="info-item">
                        <Phone className="info-icon" />
                        <div>
                            <h3>Phone / WhatsApp</h3>
                            <p>+91 62642 46210</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <Mail className="info-icon" />
                        <div>
                            <h3>Email</h3>
                            <p>hello@khushicloset.com</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <MapPin className="info-icon" />
                        <div>
                            <h3>Location</h3>
                            <p>Mumbai, India</p>
                        </div>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help you?"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                        Send Message <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
