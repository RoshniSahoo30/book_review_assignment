const Review = require('../models/Review');
const Book = require('../models/Book');

const createReview = async (req, res) => {
    const {review_text, rating} = req.body;
    const { bookId } = req.params;
    const reviewerId = req.user._id;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const newReview = new Review({
            book: bookId,
            reviewer: reviewerId,
            review_text,
            rating
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    }
    catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getReviewsByBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await Review.find({ book: bookId })
            .populate('reviewer', 'username');

        if(!reviews){
            return res.status(404).json({ message: 'No reviews found for this book' });
        }

        res.status(200).json(reviews);
    }
    catch(error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
};

module.exports = {
    createReview,
    getReviewsByBook
};