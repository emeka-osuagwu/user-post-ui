// src/setupTests.js
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import '@testing-library/jest-dom';

const server = setupServer(...handlers);

// Start the mock server before tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Stop the mock server after tests
afterAll(() => server.close());
