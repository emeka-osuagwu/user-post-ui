import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import UserDetailsPage from './pages/UserDetailsPage';

const queryClient = new QueryClient(); // Create the QueryClient instance

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
