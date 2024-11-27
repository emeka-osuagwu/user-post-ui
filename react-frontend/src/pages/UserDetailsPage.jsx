import React from 'react';
import LoadingState from '../components/LoadingState';
import { useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import { fetchUserDetails, deletePost } from '../api/apiClient';
import { useQuery, useMutation, useQueryClient } from 'react-query';


const UserDetailsPage = () => {
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useQuery(
        ['userDetails', id],
        () => fetchUserDetails(id)
    );
    const queryClient = useQueryClient();

    const mutation = useMutation(deletePost, {
        onSuccess: () => {
            queryClient.invalidateQueries(['userDetails', id]);
        },
    });

    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState onRetry={refetch} />;

    const { data: user } = data;

    const handleDelete = (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            mutation.mutate(postId);
        }
    };

    return (
        <div className="container">
            <a href="/" className="back-link">← Back to Users</a>
            <div className="user-header">
                <h1 className="user-name">{user.name}</h1>
                <p className="user-details">{user.email} • {user.posts.length} Posts</p>
            </div>
            <div className="posts-grid">

                {user.posts.map((post) => (
                    <div key={post.post_id} className="post-card">
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(post.post_id)}
                            aria-label={`Delete post: ${post.title}`}
                        >
                            &times;
                        </button>
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-content">{post.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDetailsPage;
