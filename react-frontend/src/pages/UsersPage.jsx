import React from 'react';
import { useQuery } from 'react-query';
import { fetchUsers } from '../api/apiClient';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
    const [page, setPage] = React.useState(1);
    const { data, isLoading, isError, refetch } = useQuery(
        ['users', page],
        () => fetchUsers(page),
        { keepPreviousData: true }
    );


    const navigate = useNavigate();

    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState onRetry={refetch} />;

    const { data: users, total } = data;
    const totalPages = Math.ceil(total / 1);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Users</h1>
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.user_id}
                                onClick={() => navigate(`/users/${user.user_id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.addresses[0]?.street}, {user.addresses[0]?.city}, {user.addresses[0]?.state}, {user.addresses[0]?.postalCode}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        className="page-btn prev-btn"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        ← Previous
                    </button>
                    <div className="page-numbers">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`page-btn ${page === index + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        className="page-btn next-btn"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
