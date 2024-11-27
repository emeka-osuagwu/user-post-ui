const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require('cors');
const port = 4001;

// Initialize SQLite database
const db = new sqlite3.Database('./database.db');

app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Get all users with their associated posts and addresses (with pagination)
app.get('/users', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page
    const offset = (page - 1) * limit; // Calculate the offset for pagination

    const query = `
    SELECT 
        users.id AS user_id, 
        users.name, 
        users.email,
        posts.id AS post_id, 
        posts.body AS post_body,
        posts.title AS post_title,
        addresses.id AS address_id, 
        addresses.street AS address_street
    FROM users
    LEFT JOIN posts ON posts.user_id = users.id
    LEFT JOIN addresses ON addresses.user_id = users.id
    LIMIT ? OFFSET ?
    `;

    db.all(query, [limit, offset], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Group posts and addresses by user
        const users = [];
        rows.forEach(row => {
            let user = users.find(u => u.user_id === row.user_id);
            if (!user) {
                user = {
                    user_id: row.user_id,
                    name: row.name,
                    email: row.email,
                    posts: [],
                    addresses: [],
                };
                users.push(user);
            }

            if (row.post_id) {
                user.posts.push({
                    post_id: row.post_id,
                    title: row.post_title,
                    body: row.post_body
                });
            }

            if (row.address_id) {
                user.addresses.push({
                    address_id: row.address_id,
                    street: row.address_street
                });
            }
        });

        res.json({ data: users, page, limit });
    });
});

// Get a specific user by ID with all their posts and addresses
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const query = `
    SELECT 
        users.id AS user_id, 
        users.name, 
        users.email,
        posts.id AS post_id, 
        posts.body AS post_body,
        posts.title AS post_title,
        addresses.id AS address_id, 
        addresses.street AS address_street
    FROM users
    LEFT JOIN posts ON posts.user_id = users.id
    LEFT JOIN addresses ON addresses.user_id = users.id
    WHERE users.id = ?
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Group posts and addresses by user
        const user = {
            user_id: rows[0].user_id,
            name: rows[0].name,
            email: rows[0].email,
            posts: [],
            addresses: [],
        };

        rows.forEach(row => {
            if (row.post_id) {
                user.posts.push({
                    post_id: row.post_id,
                    title: row.post_title,
                    body: row.post_body
                });
            }
            if (row.address_id) {
                user.addresses.push({
                    address_id: row.address_id,
                    street: row.address_street
                });
            }
        });

        res.json({ data: user });
    });
});

// Add a new user with address and post
app.post('/user', (req, res) => {
    const { name, email, address, postContent } = req.body;
    const userQuery = `INSERT INTO users (name, email) VALUES (?, ?)`;
    const addressQuery = `INSERT INTO addresses (user_id, street) VALUES (?, ?)`;
    const postQuery = `INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)`;

    // Start a transaction to ensure data integrity
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert new user
        db.run(userQuery, [name, email], function (err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }

            const userId = this.lastID; // Get the last inserted user ID

            // Insert associated address
            db.run(addressQuery, [userId, address], function (err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
            });

            // Insert associated post
            db.run(postQuery, [userId, 'Sample Title', postContent], function (err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
                db.run('COMMIT');
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
});

app.delete('/post/:id', (req, res) => {
    const postId = req.params.id;

    const deleteQuery = `DELETE FROM posts WHERE id = ?`;

    db.run(deleteQuery, [postId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
