

#  Book Review App

This is a full-stack **Book Review Application** built as part of an internship assignment. It enables users to register, log in, browse books, filter and sort them, and view average ratings. The frontend is built with **React (Vite)** and the backend with **Express.js** and **MongoDB**.

---

##  Features

-  User authentication using JWT
-  Add and fetch books with pagination
-  Filter by genre and author
-  Sort books by creation date or average rating
-  View average ratings based on user reviews
-  Protected routes using middleware

---

## Project Structure

```
book\_review\_assignment/
├── client/             # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/             # Backend (Node.js + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── app.js
└── README.md
```



## ⚙️ Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/RoshniSahoo30/book_review_assignment.git
cd book_review_assignment
````

### 2. Setup the Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET
npm start
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

> Visit the frontend at `http://localhost:5173`
> Backend runs on `http://localhost:8000`

---

##  .env Configuration

Inside `server/.env`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

---

##  API Routes

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| POST   | `/api/auth/signup` | Register a new user          |
| POST   | `/api/auth/login`  | Log in and get auth token    |
| GET    | `/api/books`       | Get paginated list of books  |
| POST   | `/api/books`       | Add a book (auth required)   |
| GET    | `/api/books/:id`   | Get book details and reviews |

---

##  Vercel Deployment

### Frontend

* **Root Directory:** `client`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`

### Backend

* **Root Directory:** `server`
* **Build Command:** `npm install`
* **Start Command:** `npm start`
* **Environment Variables:** Add `MONGO_URI`, `JWT_SECRET`, `PORT`

---

##  Future Enhancements

*  Add book review submission and editing
*  Visual star-based rating UI
*  Admin dashboard for managing books/users
*  User profile with review history
*  Form validations & error boundaries

---


