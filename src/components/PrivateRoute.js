import { Navigate } from 'react-router-dom';

// Higher-order component for protected routes
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('user'); // Example check

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
