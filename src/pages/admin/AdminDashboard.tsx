import { useAuth } from "@/contexts/authentication";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminWebSection";
import axios from "axios";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalUsers: number;
  totalComments: number;
}

export default function AdminDashboard() {
  const { isAuthenticated, state } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalComments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (state.user?.role !== 'admin') {
      navigate("/");
      return;
    }
  }, [isAuthenticated, state.user?.role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://leoshin-blog-app-api-with-db.vercel.app/posts/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // If unauthorized, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && state.user?.role === 'admin') {
      fetchStats();
    }
  }, [isAuthenticated, state.user?.role, navigate]);

  // Show loading while checking authentication
  if (!isAuthenticated || state.user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        {/* Mobile spacing */}
        <div className="lg:hidden h-16" />
        
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Welcome back, <span className="font-semibold text-blue-600">{state.user?.name || state.user?.username}</span>! 👋
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="text-sm text-slate-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Posts</p>
                    <div className="text-3xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        stats.totalPosts
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {stats.publishedPosts} published, {stats.draftPosts} drafts
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Comments</p>
                    <div className="text-3xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        stats.totalComments
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">User engagement</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Users</p>
                    <div className="text-3xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        stats.totalUsers
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Registered users</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Categories</p>
                    <div className="text-3xl font-bold text-slate-900">
                      {isLoading ? (
                        <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        stats.totalCategories
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Content organization</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Quick Actions
                </h2>
                <div className="hidden sm:block w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <button
                  onClick={() => navigate("/admin/article-management")}
                  className="group p-6 bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-slate-900 ml-3 group-hover:text-blue-600 transition-colors">
                      Manage Articles
                    </span>
                  </div>
                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors">
                    Create, edit, and manage blog posts with advanced features
                  </p>
                </button>

                <button
                  onClick={() => navigate("/admin/category-management")}
                  className="group p-6 bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-slate-900 ml-3 group-hover:text-green-600 transition-colors">
                      Manage Categories
                    </span>
                  </div>
                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors">
                    Organize content with categories and tags
                  </p>
                </button>

                <button
                  onClick={() => navigate("/admin/notification")}
                  className="group p-6 bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2 2 0 002-2v-15a2 2 0 00-2-2h-15a2 2 0 00-2 2v15a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-slate-900 ml-3 group-hover:text-amber-600 transition-colors">
                      Notifications
                    </span>
                  </div>
                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors">
                    Manage system notifications and alerts
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
