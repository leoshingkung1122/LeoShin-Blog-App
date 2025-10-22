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

        const response = await axios.get(
          "https://leoshin-blog-app-api-with-db.vercel.app/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setNotifications(response.data.data);
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
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && state.user?.role === 'admin') {
      fetchNotifications();
    }
  }, [isAuthenticated, state.user?.role, navigate]);

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
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-gray-50 overflow-hidden">
          <h2 className="text-2xl font-semibold mb-6">Notification</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-white animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-hidden">
        <h2 className="text-2xl font-semibold mb-6">Notification</h2>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2 2 0 002-2v-15a2 2 0 00-2-2h-15a2 2 0 00-2 2v15a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 rounded-lg ${!notification.is_read ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={notification.user?.profile_pic || "/placeholder.svg?height=40&width=40"}
                        alt={notification.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {notification.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold inline">
                        {notification.user?.name || notification.user?.username || "Anonymous"}
                      </h3>
                      <p className="text-sm font-normal inline">
                        {notification.type === "comment"
                          ? " commented on "
                          : notification.type === "like"
                          ? " liked "
                          : " posted "}
                        your article: {notification.post?.title || "Unknown Post"}
                      </p>
                      {notification.type === "comment" && notification.comment && (
                        <p className="mt-1 text-sm text-gray-500 bg-gray-100 p-2 rounded">
                          "{notification.comment.content}"
                        </p>
                      )}
                      <p className="mt-1 text-xs text-orange-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPost(notification)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={deletingId === notification.id}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {deletingId === notification.id ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this notification? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <hr className="border-t border-gray-200 my-4" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}