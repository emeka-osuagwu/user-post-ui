require('dotenv').config(); // Load environment variables
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { getUsers, getUserById, createUser, deletePost } = require('./controller/userController');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || './database.db';

// Database setup
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect to the database:", err.message);
        process.exit(1); // Exit the application if the database connection fails
    }
    console.log("Connected to the SQLite database at", dbPath);
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/users', (req, res, next) => getUsers(req, res, next, db));
app.get('/user/:id', (req, res, next) => getUserById(req, res, next, db));
app.post('/user', (req, res, next) => createUser(req, res, next, db));
app.delete('/post/:id', (req, res, next) => deletePost(req, res, next, db));

// Centralized error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
