const express = require('express');
const { createReview, getReviewsByBook } = require('../controllers/reviewController');
const { checkAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/:bookId')
    .post(checkAuth, createReview) 
    .get(getReviewsByBook); 

module.exports = router;