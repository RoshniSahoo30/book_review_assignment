import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Star from '../components/Star.jsx';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({
        review_text: '',
        rating: 0,
    });

    const { review_text, rating } = reviewForm;
    const token = localStorage.getItem('token');

    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/books/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBook(response.data.book);
        setReviews(response.data.reviews);
        setAverageRating(response.data.averageRating || 0);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const onChange = (e) => {
        setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
    };

    const onRatingChange = (newRating) => {
        setReviewForm({ ...reviewForm, rating: newRating });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('You must be logged in to submit a review.');
            return;
        }
        if (rating === 0) {
            alert('Please select a rating before submitting your review.');
            return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/reviews/${id}`, {
              review_text,
              rating
          }, config);
            alert('Review submitted successfully!');
            setReviewForm({ review_text: '', rating: 0 });
            setTimeout(() => {
              navigate('/');
          }, 1500);
          //fetchBookDetails(); // refresh to show new review
        } catch (error) {
            console.error('Error adding review:', error);
            alert(error.response?.data?.message || 'Error adding review.');
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading book details...</div>;
    }

    if (!book) {
        return <div className="text-center p-4 text-red-600">Book not found.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {/* Book Information Card */}
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                <h1 className="text-4xl font-extrabold mb-4 text-gray-800">{book.title}</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-xl text-gray-700 mb-2">
                            <span className="font-semibold">Author:</span> {book.author}
                        </p>
                        <p className="text-xl text-gray-700 mb-4">
                            <span className="font-semibold">Genre:</span> {book.genre}
                        </p>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="text-center">
                            <p className="text-lg font-semibold mb-2 text-gray-700">Average Rating</p>
                            {averageRating > 0 ? (
                                <div className="flex flex-col items-center">
                                    <Star rating={averageRating} />
                                    <span className="text-sm text-gray-600 mt-1">
                                        {averageRating}/5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                                    </span>
                                </div>
                            ) : (
                                <p className="text-gray-500">No ratings yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Review Form */}
            {token ? (
                <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Write a Review</h2>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="rating">
                                Your Rating
                            </label>
                            <Star 
                                rating={rating} 
                                interactive={true}
                                onRatingChange={onRatingChange}
                                size="2xl"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="review_text">
                                Your Review
                            </label>
                            <textarea
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="review_text"
                                name="review_text"
                                value={review_text}
                                onChange={onChange}
                                rows="5"
                                placeholder="Share your thoughts about this book..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                                type="submit"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-8 text-center">
                    <p className="text-gray-600 text-lg">Please log in to write a review.</p>
                </div>
            )}

            {/* Display Reviews */}
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this book!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">
                                                    {review.reviewer?.username?.charAt(0)?.toUpperCase() || 'A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {review.reviewer?.username || 'Anonymous'}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <Star rating={review.rating} />
                                                <span className="text-sm text-gray-600">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="ml-13">
                                    <p className="text-gray-700 leading-relaxed italic">
                                        "{review.review_text}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetail;