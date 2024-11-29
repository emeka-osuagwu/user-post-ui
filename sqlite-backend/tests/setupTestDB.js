const sqlite3 = require('sqlite3').verbose();

function createMockDB() {
    const db = new sqlite3.Database(':memory:'); // In-memory database for testing

    db.serialize(() => {
        db.run(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL
            );
        `);
        db.run(`
            CREATE TABLE posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT,
                body TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
        `);
        db.run(`
            CREATE TABLE addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                street TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
        `);

        // Insert mock data
        db.run(`INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')`);
        db.run(`INSERT INTO posts (user_id, title, body) VALUES (1, 'Sample Title', 'Sample Body')`);
        db.run(`INSERT INTO addresses (user_id, street) VALUES (1, '123 Main St')`);
    });

    return db;
}

module.exports = { createMockDB };
