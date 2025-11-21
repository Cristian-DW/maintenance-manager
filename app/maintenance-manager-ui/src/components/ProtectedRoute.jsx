import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Optionally checks for required role
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if required
    if (requiredRole && user.role !== requiredRole) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                    <p className="text-sm text-gray-500 mt-2">Required role: {requiredRole}</p>
                    <p className="text-sm text-gray-500">Your role: {user.role}</p>
                </div>
            </div>
        );
    }

    return children;
}
