import React from 'react';

const ErrorState = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center text-red-600">
        <p>{message || 'Something went wrong.'}</p>
        {onRetry && (
            <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                onClick={onRetry}
            >
                Retry
            </button>
        )}
    </div>
);

export default ErrorState;
