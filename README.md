# Simple React-Node Application

This project is a two-page React application powered by a Node.js Express server. It demonstrates the interaction between a frontend and backend to fetch user data and their related posts. The application uses **SQLite** as the database for storing user and post data, making it lightweight and easy to set up.

---

## Features

- **React Frontend**: Displays a paginated list of users and their related posts.
- **Node.js Backend**: Provides API endpoints to fetch user data and related posts.
- **SQLite Database**: Lightweight database for managing users and posts.
- **Testing**: Includes unit and integration tests for both frontend and backend.

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **React Query**: For efficient data fetching and state management.
- **TailwindCSS**: For responsive and modern styling.
- **React Testing Library**: For writing and running frontend tests.

### Backend
- **Node.js**: Server runtime.
- **Express**: Framework for building RESTful APIs.
- **SQLite**: Lightweight relational database.
- **Jest**: For backend testing.

---

## Project Structure

### Backend (`sqlite-backend`)
- **Express** server setup for handling API requests.
- **SQLite** database for storing user and post data.
- `.env` file for managing environment variables.

### Frontend (`react-frontend`)
- **React** application for fetching and displaying user data and posts.
- Pagination and error handling included.
- `.env` file for configuring the backend API URL.

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites
- **Node.js** (version 14 or above)
- **npm** or **yarn**
- A terminal or command-line interface

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd sqlite-backend
