import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import Badge from '@/components/ui/badge';
import { AdminSidebar } from '@/components/AdminWebSection';
import { useAuth } from '@/contexts/authentication';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  name: string;
  profile_pic?: string;
  role: string;
  status: 'active' | 'ban';
  updated_at: string;
  introduction?: string;
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  post_id: string;
  blog_posts: {
    title: string;
  };
}

interface Like {
  id: string;
  created_at: string;
  post_id: string;
  blog_posts: {
    title: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UserDetailResponse {
  success: boolean;
  data: {
    user: User;
    comments: Comment[];
    likes: Like[];
    pagination: {
      comments: PaginationInfo;
      likes: PaginationInfo;
    };
  };
}

interface UserDetail {
  user: User;
  comments: Comment[];
  likes: Like[];
}

const AdminUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [likesPage, setLikesPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    comments: PaginationInfo;
    likes: PaginationInfo;
  } | null>(null);
  const { isAuthenticated, state } = useAuth();

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

  const fetchUserDetail = async (commentsPageNum: number = commentsPage, likesPageNum: number = likesPage, showLoading: boolean = true) => {
    if (!id) return;
    
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://leoshin-blog-app-api-with-db.vercel.app/users/${id}?commentsPage=${commentsPageNum}&likesPage=${likesPageNum}&commentsLimit=5&likesLimit=5`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: UserDetailResponse = response.data;
      setUserDetail({
        user: data.data.user,
        comments: data.data.comments,
        likes: data.data.likes
      });
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error fetching user detail:', error);
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Error</h2>
            <p className="text-sm">Unable to load user data</p>
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
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'ban') => {
    if (!id) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://leoshin-blog-app-api-with-db.vercel.app/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const data = await response.json();
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Success</h2>
            <p className="text-sm">{data.message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      
      // อัปเดตสถานะใน state
      if (userDetail) {
        setUserDetail({
          ...userDetail,
          user: { ...userDetail.user, status: newStatus }
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Error</h2>
            <p className="text-sm">Unable to update user status</p>
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
      setActionLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://leoshin-blog-app-api-with-db.vercel.app/users/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      const data = await response.json();
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Success</h2>
            <p className="text-sm">{data.message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      
      // ลบ comment ออกจาก state
      if (userDetail) {
        setUserDetail({
          ...userDetail,
          comments: userDetail.comments.filter(comment => comment.id !== commentId)
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Error</h2>
            <p className="text-sm">Unable to delete comment</p>
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
  };

  const handleCommentsPageChange = async (page: number) => {
    if (page === commentsPage || commentsLoading) return;
    
    setCommentsLoading(true);
    setCommentsPage(page);
    
    try {
      await fetchUserDetail(page, likesPage, false);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLikesPageChange = async (page: number) => {
    if (page === likesPage || likesLoading) return;
    
    setLikesLoading(true);
    setLikesPage(page);
    
    try {
      await fetchUserDetail(commentsPage, page, false);
    } finally {
      setLikesLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  if (loading) {
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
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0">
          <div className="lg:hidden h-16" />
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">User not found</h1>
                <p className="text-slate-600 mb-6">The user you're looking for doesn't exist or has been removed.</p>
                <Button 
                  onClick={() => navigate('/admin/users')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Back to User List
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { user, comments, likes } = userDetail;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden h-16" />
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/users')}
                className="mb-6 px-6 py-3 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                ← Back to User List
              </Button>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                User Details
              </h1>
              <p className="text-slate-600">View detailed information about this user</p>
            </div>

            {/* User Info Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8 mb-8">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                    <AvatarImage src={user.profile_pic} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                      {user.name || user.username}
                    </h2>
                    <p className="text-slate-600 mb-3">@{user.username}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={`px-3 py-1 rounded-full font-medium ${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                      <Badge
                        variant={user.status === 'active' ? 'default' : 'destructive'}
                        className={`px-3 py-1 rounded-full font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status === 'active' ? 'Active' : 'Banned'}
                      </Badge>
                      <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Last Updated: {new Date(user.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {user.role !== 'admin' && (
                    <Button
                      variant={user.status === 'active' ? 'destructive' : 'default'}
                      onClick={() => handleStatusChange(user.status === 'active' ? 'ban' : 'active')}
                      disabled={actionLoading}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        user.status === 'active' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {actionLoading ? 'Processing...' : 
                       user.status === 'active' ? 'Ban User' : 'Unban User'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

      {/* สถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Comments</h3>
          <p className="text-3xl font-bold text-blue-600">{comments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Likes</h3>
          <p className="text-3xl font-bold text-green-600">{likes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
          <Badge
            variant={user.status === 'active' ? 'default' : 'destructive'}
            className="text-lg px-3 py-1"
          >
            {user.status === 'active' ? 'Active' : 'Banned'}
          </Badge>
        </div>
      </div>

      {/* รายการความคิดเห็น */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Comments ({comments.length})</h3>
        </div>
        <div className="p-4 sm:p-6">
          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={`comment-skeleton-${index}`} className="animate-pulse">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">User has no comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                        In post: <span className="text-blue-600">{comment.blog_posts.title}</span>
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-normal break-all">
                      {comment.comment}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Pagination */}
        {pagination && pagination.comments.totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-gray-100">
            <Pagination
              currentPage={pagination.comments.currentPage}
              totalPages={pagination.comments.totalPages}
              onPageChange={handleCommentsPageChange}
              isLoading={commentsLoading}
            />
          </div>
        )}
      </div>

      {/* รายการการกดไลค์ */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Likes ({likes.length})</h3>
        </div>
        <div className="p-4 sm:p-6">
          {likesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={`like-skeleton-${index}`} className="animate-pulse">
                  <div className="flex justify-between items-center border rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : likes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">User has no likes yet</p>
          ) : (
            <div className="space-y-4">
              {likes.map((like) => (
                <div key={like.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words mb-2">
                        {like.blog_posts.title}
                      </h4>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs sm:text-sm text-gray-500">
                        {new Date(like.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                        ❤️ Like
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Likes Pagination */}
        {pagination && pagination.likes.totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-gray-100">
            <Pagination
              currentPage={pagination.likes.currentPage}
              totalPages={pagination.likes.totalPages}
              onPageChange={handleLikesPageChange}
              isLoading={likesLoading}
            />
          </div>
        )}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
