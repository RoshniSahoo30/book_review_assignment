import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import BookListPage from './pages/BookList.jsx';
import AddBookPage from './pages/AddBook.jsx';
import BookDetailPage from './pages/BookDetail.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <>
      <Navbar />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<BookListPage />} /> {/* Default page */}
      <Route path="/add-book" element={<AddBookPage />} />
      <Route path="/books/:id" element={<BookDetailPage />} />
    </Routes>
    </>
  );
}

export default App;