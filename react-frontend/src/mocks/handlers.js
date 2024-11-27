// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
    // Mock users API
    rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                { id: 1, name: 'John Doe', email: 'john.doe@example.com', address: { street: '123 Main St', city: 'Anytown' } },
                { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', address: { street: '456 Oak St', city: 'Othertown' } },
            ])
        );
    }),

    // Mock user posts API
    rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                { id: 1, title: 'Post 1', body: 'This is the first post.' },
                { id: 2, title: 'Post 2', body: 'This is the second post.' },
            ])
        );
    }),
];
