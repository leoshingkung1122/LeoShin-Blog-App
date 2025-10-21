import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ViewPostPage from "./pages/ViewPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUp";
import SignUpSuccessPage from "./pages/SignUpSuccessPage";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/authentication";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";
import ProtectedRoute from "./components/auth/ProtectRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
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

        <Route path="/sign-up/success" element={<SignUpSuccessPage />} />

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

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole={["user", "admin"]}
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole={["user", "admin"]}
            >
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/article-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminArticlePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-article"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCreateArticlePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/article-management/create"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCreateArticlePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/article-management/edit/:id"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminEditArticlePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management/create"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCreateCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management/edit/:id"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminEditCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-category"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminEditCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notification"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminNotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminResetPasswordPage />
            </ProtectedRoute>
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
