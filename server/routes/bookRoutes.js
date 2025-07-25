const express = require('express');
const { checkAuth } = require('../middleware/auth');
const {
    addBook,
    getBooks,
    getBookById
} = require('../controllers/bookController');

const router = express.Router();

router.route('/')
.post(checkAuth, addBook)
.get(checkAuth, getBooks);

router.route('/:id')
.get(checkAuth, getBookById);

module.exports = router;