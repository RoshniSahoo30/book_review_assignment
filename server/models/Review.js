const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    review_text: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{ timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;