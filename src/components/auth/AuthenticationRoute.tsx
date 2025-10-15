import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import LoadingScreen from "../ui/LoadingScreen";

interface AuthenticationRouteProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  children: ReactNode;
}

function AuthenticationRoute({ isLoading, isAuthenticated, children }: AuthenticationRouteProps) {
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

  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, show the page (like login/register)
  return <>{children}</>;
}

export default AuthenticationRoute;