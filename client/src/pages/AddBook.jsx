import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: ''
    });

    const navigate = useNavigate();
    const { title, author, genre } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!title || !author || !genre) {
          alert('Please fill in all book details (Title, Author, Genre).');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to add a book.');
            navigate('/login');
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/books`, formData, config);
            console.log(res.data);
            alert('Book added successfully!');
            navigate('/',{ state: { bookAdded: true } }); // go to book list page after adding
        }
        catch (err) {
            console.error(err);
            alert('Failed to add book. Please try again.');
        }
    };

    return (
<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
            Author
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
            Genre
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="genre"
            name="genre"
            value={genre}
            onChange={onChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;