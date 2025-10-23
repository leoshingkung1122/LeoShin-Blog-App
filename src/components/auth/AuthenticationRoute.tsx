import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import LoadingToast from "../ui/LoadingToast";

interface AuthenticationRouteProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  children: ReactNode;
}

function AuthenticationRoute({ isLoading, isAuthenticated, children }: AuthenticationRouteProps) {
  if (isLoading) {
    // Loading state
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm z-50">
        <LoadingToast size="extra-large" text="Loading" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, show the page (like login/register)
  return <>{children}</>;
}

export default AuthenticationRoute;