import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ViewPostPage from "./pages/ViewPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/authentication";
import jwtInterceptor from "./utils/jwtinterceptor";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";
import ProtectedRoute from "./components/auth/ProtectRoute";

import AdminArticlePage from "./pages/admin/AdminArticlePage";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage";
import AdminCreateArticlePage from "./pages/admin/AdminCreateArticle";
import AdminCreateCategoryPage from "./pages/admin/AdminCreateCategoryPage";
import AdminEditArticlePage from "./pages/admin/AdminEditArticlePage";
import AdminEditCategoryPage from "./pages/admin/AdminEditCategoryPage";
import AdminNotificationPage from "./pages/admin/AdminNotificationPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminResetPasswordPage from "./pages/admin/AdminResetPasswordPage";

function App() {
  const { isAuthenticated, state } = useAuth();

  // Initialize JWT interceptor

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

        <Route path="/Profile" element={<ProfilePage />} />

        <Route
          path="/admin/article-management"
          element={<AdminArticlePage />}
        />
        <Route
          path="/admin/category-management"
          element={<AdminCategoryPage />}
        />
        <Route
          path="/admin/create-article"
          element={<AdminCreateArticlePage />}
        />
        <Route
          path="/admin/article-management/create"
          element={<AdminCreateCategoryPage />}
        />
        <Route path="/admin/article-management/edit/:id" element={<AdminEditArticlePage />} />
        <Route
          path="/admin/edit-category"
          element={<AdminEditCategoryPage />}
        />
        <Route path="/admin/notification" element={<AdminNotificationPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route
          path="/admin/reset-password"
          element={<AdminResetPasswordPage />}
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
