import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ViewPostPage from "./pages/ViewPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/authentication";
import jwtInterceptor from "./utils/jwtinterceptor";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";

function App() {
  const { isAuthenticated, state } = useAuth();

  // Initialize JWT interceptor
  useEffect(() => {
    jwtInterceptor();
  }, []);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<ViewPostPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route
          path="/SignUp"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <SignUpPage />
            </AuthenticationRoute>
          }
        />

        <Route
          path="/Login"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <LoginPage />
            </AuthenticationRoute>
          }
        />

      </Routes>
      <Toaster
        toastOptions={{
          unstyled: true,
        }}
      />
    </>
  );
}

export default App;
