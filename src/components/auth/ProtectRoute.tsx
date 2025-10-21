import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import LoadingScreen from "../ui/LoadingScreen";

interface ProtectedRouteProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole?: string;
  requiredRole?: string | string[];
  children: ReactNode;
}

function ProtectedRoute({
  isLoading,
  isAuthenticated,
  userRole,
  requiredRole,
  children,
}: ProtectedRouteProps) {
  if (isLoading) {
    // Loading state
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and doesn't match, redirect to home
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated (and has correct role if required)
  return <>{children}</>;
}

export default ProtectedRoute;