const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { getUsers, getUserById, createUser, deletePost } = require('../handlers/userHandlers');
const { createMockDB } = require('./setupTestDB');

let app;
let db;

beforeAll(() => {
    db = createMockDB();
    app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/users', (req, res, next) => getUsers(req, res, next, db));
    app.get('/user/:id', (req, res, next) => getUserById(req, res, next, db));
    app.post('/user', (req, res, next) => createUser(req, res, next, db));
    app.delete('/post/:id', (req, res, next) => deletePost(req, res, next, db));
});

afterAll(() => {
    db.close(); // Close the database after tests
});

describe('User API Endpoints', () => {
    test('GET /users should return a list of users', async () => {
        const res = await request(app).get('/users');
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('GET /user/:id should return a specific user with posts and addresses', async () => {
        const res = await request(app).get('/user/1');
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('user_id', 1);
        expect(res.body.data.posts.length).toBeGreaterThan(0);
        expect(res.body.data.addresses.length).toBeGreaterThan(0);
    });

    test('POST /user should create a new user with address and post', async () => {
        const res = await request(app)
            .post('/user')
            .send({
                name: 'Jane Doe',
                email: 'jane@example.com',
                address: '456 Secondary St',
                postContent: 'New post body',
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'User created successfully');
    });

    test('DELETE /post/:id should delete a post', async () => {
        const res = await request(app).delete('/post/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Post deleted successfully');
    });

    test('GET /user/:id should return 404 if user does not exist', async () => {
        const res = await request(app).get('/user/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });
});
