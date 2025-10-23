import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { AdminSidebar } from "@/components/AdminWebSection";
import { useAuth } from "@/contexts/authentication";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Pagination from "@/components/ui/Pagination";

interface NotificationUser {
  id: string;
  name: string;
  username: string;
  profile_pic?: string;
}

interface NotificationPost {
  id: number;
  title: string;
  slug: string;
}

interface NotificationComment {
  id: number;
  content: string;
  post_id: number;
}

interface Notification {
  id: number;
  type: 'comment' | 'like' | 'post';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user: NotificationUser | null;
  post: NotificationPost | null;
  comment: NotificationComment | null;
  time: string;
}

export default function AdminNotificationPage() {
  const { isAuthenticated, state } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Check authentication and admin role
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (state.user?.role !== 'admin') {
      navigate("/");
      return;
    }
  }, [isAuthenticated, state.user?.role, navigate]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // สร้าง query parameters สำหรับ pagination
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '8'
        });

        const response = await axios.get(
          `https://leoshin-blog-app-api-with-db.vercel.app/notifications?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success && response.data.data) {
          setNotifications(response.data.data);
          
          // Set pagination data if available
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages);
          } else {
            // Fallback pagination for old API
            setTotalPages(1);
          }
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        } else {
          toast.custom((t) => (
            <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg mb-1">
                  Failed to fetch notifications
                </h2>
                <p className="text-sm">
                  Unable to load notifications. Please refresh the page.
                </p>
              </div>
              <button
                onClick={() => toast.dismiss(t)}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          ));
        }
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && state.user?.role === 'admin') {
      fetchNotifications();
    }
  }, [currentPage, isAuthenticated, state.user?.role, navigate]);

  // เพิ่มฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId: number) => {
    try {
      setDeletingId(notificationId);
      const token = localStorage.getItem("token");
      
      await axios.delete(
        `https://leoshin-blog-app-api-with-db.vercel.app/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Notification deleted successfully
            </h2>
            <p className="text-sm">
              The notification has been removed from your list.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Failed to delete notification
            </h2>
            <p className="text-sm">
              There was an error removing the notification. Please try again.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
    } finally {
      setDeletingId(null);
    }
  };

  // Handle view post
  const handleViewPost = (notification: Notification) => {
    if (notification.post) {
      navigate(`/post/${notification.post.id}`);
    } else if (notification.comment) {
      // Navigate to the post that has the comment
      navigate(`/post/${notification.comment.post_id}`);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0">
          <div className="lg:hidden h-16" />
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="h-8 bg-slate-200 rounded-xl animate-pulse w-64 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded-xl animate-pulse w-48"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-slate-200 rounded-xl w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded-xl w-1/2 mb-3"></div>
                        <div className="h-3 bg-slate-200 rounded-xl w-1/4"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-slate-200 rounded-xl w-16"></div>
                        <div className="h-8 bg-slate-200 rounded-xl w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile spacing */}
        <div className="lg:hidden h-16" />
        
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Notifications
              </h2>
              <p className="text-slate-600">Manage system notifications and alerts</p>
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2 2 0 002-2v-15a2 2 0 00-2-2h-15a2 2 0 00-2 2v15a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">No notifications</h3>
                  <p className="text-slate-600 text-lg">You don't have any notifications yet.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                        !notification.is_read 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100/50' 
                          : 'bg-white/80 backdrop-blur-sm border-white/20'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
                              <AvatarImage
                                src={notification.user?.profile_pic || "/placeholder.svg?height=48&width=48"}
                                alt={notification.user?.name || "User"}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                                {notification.user?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            {!notification.is_read && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-slate-900 truncate">
                                {notification.user?.name || notification.user?.username || "Anonymous"}
                              </h3>
                              <span className="text-sm text-slate-500">
                                {notification.type === "comment"
                                  ? "commented on"
                                  : notification.type === "like"
                                  ? "liked"
                                  : "posted"}
                              </span>
                            </div>
                            <p className="text-slate-700 mb-3 break-words">
                              your article: <span className="font-semibold text-blue-600">{notification.post?.title || "Unknown Post"}</span>
                            </p>
                            {notification.type === "comment" && notification.comment && (
                              <div className="bg-slate-100 rounded-xl p-4 mb-3 border-l-4 border-blue-500">
                                <p className="text-slate-700 italic break-words">
                                  "{notification.comment.content}"
                                </p>
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                {notification.time}
                              </span>
                              {!notification.is_read && (
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 lg:ml-6 w-full lg:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPost(notification)}
                            className="flex-1 lg:flex-none px-4 py-2 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none px-4 py-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                                disabled={deletingId === notification.id}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">{deletingId === notification.id ? "Deleting..." : "Delete"}</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl border-slate-200 shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold text-slate-900">Delete Notification</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600">
                                  Are you sure you want to delete this notification? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="space-x-3">
                                <AlertDialogCancel className="px-6 py-2 rounded-xl border-slate-200 hover:bg-slate-50 transition-colors">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {!isLoading && notifications.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}