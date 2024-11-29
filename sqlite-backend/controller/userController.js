const getUsers = (req, res, next, db) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

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
        if (err) return next(err);

        try {
            const users = groupUserData(rows);
            res.json({ data: users, page, limit });
        } catch (error) {
            next(error);
        }
    });
};

const getUserById = (req, res, next, db) => {
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
        if (err) return next(err);

        try {
            if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

            const user = groupUserData(rows)[0];
            res.json({ data: user });
        } catch (error) {
            next(error);
        }
    });
};

const createUser = (req, res, next, db) => {
    const { name, email, address, postContent } = req.body;

    if (!name || !email || !address || !postContent) {
        return next(new Error('All fields (name, email, address, postContent) are required.'));
    }

    const userQuery = `INSERT INTO users (name, email) VALUES (?, ?)`;
    const addressQuery = `INSERT INTO addresses (user_id, street) VALUES (?, ?)`;
    const postQuery = `INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)`;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(userQuery, [name, email], function (err) {
            if (err) return rollbackTransaction(res, db, err, next);

            const userId = this.lastID;

            db.run(addressQuery, [userId, address], (err) => {
                if (err) return rollbackTransaction(res, db, err, next);
            });

            db.run(postQuery, [userId, 'Sample Title', postContent], (err) => {
                if (err) return rollbackTransaction(res, db, err, next);

                db.run('COMMIT');
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
};

const deletePost = (req, res, next, db) => {
    const postId = req.params.id;

    const deleteQuery = `DELETE FROM posts WHERE id = ?`;

    db.run(deleteQuery, [postId], function (err) {
        if (err) return next(err);

        try {
            if (this.changes === 0) return res.status(404).json({ error: 'Post not found' });

            res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            next(error);
        }
    });
};

// Utility function to group user data
const groupUserData = (rows) => {
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
            user.posts.push({ post_id: row.post_id, title: row.post_title, body: row.post_body });
        }

        if (row.address_id) {
            user.addresses.push({ address_id: row.address_id, street: row.address_street });
        }
    });
    return users;
};

// Utility function to handle transaction rollback
const rollbackTransaction = (res, db, err, next) => {
    db.run('ROLLBACK', (rollbackErr) => {
        if (rollbackErr) return next(rollbackErr);
        next(err);
    });
};

module.exports = { getUsers, getUserById, createUser, deletePost };
