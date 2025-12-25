import React from 'react';
import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    // Replace with actual phone number
    const phoneNumber = "919131126855";
    const message = "Hi! I'm interested in ordering from Khushi Closet.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={30} />
            <span className="whatsapp-text">Order Now</span>
        </a>
    );
};

export default WhatsAppButton;
