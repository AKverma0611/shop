import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import './Testimonials.css';

const Testimonials = () => {
    const { reviews, addReview } = useReviews();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        text: '',
        rating: 5
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addReview(formData, imageFile);
            setIsFormOpen(false);
            setFormData({ name: '', text: '', rating: 5 });
            setImageFile(null);
            alert("Review submitted successfully!");
        } catch (error) {
            alert("Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="testimonials-container">
            <div className="testimonials-header">
                <button
                    className="write-review-btn"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                >
                    {isFormOpen ? 'Cancel Review' : 'Write a Review'}
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="review-form">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="rating-select">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={24}
                                fill={star <= formData.rating ? "#FFD700" : "none"}
                                color="#FFD700"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                style={{ cursor: 'cursor' }}
                            />
                        ))}
                    </div>
                    <textarea
                        placeholder="Share your experience..."
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        style={{ margin: '10px 0' }}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            <div className="testimonials-grid">
                {reviews.map((review) => (
                    <div key={review.id} className="testimonial-card">
                        <div className="stars">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                            ))}
                        </div>
                        <p className="review-text">"{review.text}"</p>
                        {review.image && (
                            <div className="review-image">
                                <img src={review.image} alt="User Review" />
                            </div>
                        )}
                        <h4 className="review-author">- {review.name}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
