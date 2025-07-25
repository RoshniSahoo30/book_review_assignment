const Book =  require('../models/Book');
const Review = require('../models/Review');

const addBook = async (req, res) => {
    const { title, author, genre } = req.body;

    if(!title || !author || !genre) {
        return res.status(400).json({ message: 'All fields required.' });
    }

    try {
        const newBook = new Book({
            title,
            author,
            genre,
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
};

const getBooks = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        genre,
        author,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};
    if (genre) {
        filter.genre = { $regex: genre, $options: 'i' }; 
    }
    if (author) {
        filter.author = { $regex: author, $options: 'i' }; 
    }

    try {
        let sortOptions = {};
        if (sortBy === 'createdAt') {
            sortOptions = { createdAt: sortOrder === 'desc' ? -1 : 1 };
        } else if (sortBy === 'averageRating') {
            // We'll sort manually later
        } else {
            sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
        }

        const books = await Book.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort(sortOptions);

        const booksWithAvgRating = await Promise.all(
            books.map(async (book) => {
                const reviews = await Review.find({ book: book._id });
                const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
                const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

                return {
                    ...book.toObject(),
                    averageRating: parseFloat(averageRating)
                };
            })
        );

        // Manually sort if needed
        if (sortBy === 'averageRating') {
            booksWithAvgRating.sort((a, b) => {
                return sortOrder === 'desc'
                    ? b.averageRating - a.averageRating
                    : a.averageRating - b.averageRating;
            });
        }

        const totBooks = await Book.countDocuments(filter);

        res.status(200).json({
            books: booksWithAvgRating,
            currentPage: Number(page),
            totalPages: Math.ceil(totBooks / limit),
            totalBooks: totBooks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
};

//additional feature to get a book by it's id
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const reviews = await Review.find({ book: req.params.id }).populate('reviewer', 'username');

        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0;

        res.status(200).json({ 
            book: book.toObject(),
            reviews,
            averageRating
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
};

module.exports = {
    addBook,
    getBooks,
    getBookById, // Uncomment if you want to use the getBookById feature
};