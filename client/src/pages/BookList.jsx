import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Star from '../components/Star.jsx';

const BookList = () => {

    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [inputGenre, setInputGenre] = useState('');
    const [inputAuthor, setInputAuthor] = useState('');

    const [filterGenre, setFilterGenre] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');

    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc'); 

    const fetchBooks = async (page = 1) => {
        setLoading(true);
        try {
        const token = localStorage.getItem("token"); // Make sure this was saved at login

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            limit: 10,
            genre: filterGenre,
            author: filterAuthor,
            sortBy: sortBy,
            sortOrder: sortOrder
          },
        });
          
            

            setBooks(response.data.books);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if(location.state && location.state.genre) {
          setInputAuthor('');
          setInputGenre('');
          setFilterGenre('');
          setFilterAuthor('');
          setSortBy('createdAt');
          setSortOrder('desc'); 
          setCurrentPage(1);

          window.history.replaceState({}, document.title);
        }
        fetchBooks();
    }, [currentPage, filterGenre, filterAuthor, sortBy, sortOrder, location.state]);

    const onFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setFilterGenre(inputGenre);
        setFilterAuthor(inputAuthor);
        //fetchBooks(1);
    }

    const clearFilter = () => {
        setInputGenre('');
        setInputAuthor('');
        setFilterGenre('');
        setFilterAuthor('');
        setSortBy('createdAt');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    const handleSortByChange = (e) => {
      setSortBy(e.target.value);
      setCurrentPage(1); // Reset page when sorting changes
    };

    const handleSortOrderChange = (e) => {
      setSortOrder(e.target.value);
      setCurrentPage(1); // Reset page when sorting changes
    };

    if(loading) {
        return <div className="text-center p-4">Loading books...</div>;
    }

    return (
        <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book List</h1>

      {/* Filter and Search Form */}
      <form onSubmit={onFilterSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8 flex flex-wrap gap-4 items-center">
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
          type="text"
          placeholder="Filter by Genre"
          value={inputGenre}
          onChange={(e) => setInputGenre(e.target.value)}
        />
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
          type="text"
          placeholder="Filter by Author"
          value={inputAuthor}
          onChange={(e) => setInputAuthor(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Search
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={clearFilter}
        >
          Clear Filters
        </button>
      </form>

      {/* Sorting Controls */}
      <div className="flex justify-end items-center mb-6 gap-4">
        <label htmlFor="sortBy" className="text-gray-700">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={handleSortByChange}
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="createdAt">Date Added</option> 
          <option value="averageRating">Average Rating</option> 
        </select>

        <label htmlFor="sortOrder" className="text-gray-700">Order:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* List of Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!books || books.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No books found.</p>
        ) : (
          books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">
                <Link to={`/books/${book._id}`} className="text-blue-600 hover:underline">
                  {book.title}
                </Link>
              </h3>
              <p className="text-gray-700">
                Author: {book.author}
              </p>
              <p className="text-gray-700">
                Genre: {book.genre}
              </p>
              <p className="text-gray-700 mt-2">
                Average Rating:{' '}
                {book.averageRating > 0 ? (
                  <Star rating={book.averageRating} />
                ) : (
                  'No ratings yet'
                )}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg font-medium">Page {currentPage} of {totalPages}</span>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
    );
};

export default BookList;