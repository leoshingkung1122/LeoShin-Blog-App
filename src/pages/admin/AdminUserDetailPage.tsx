import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/Avatar';
import Badge from '../../components/ui/badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { AdminSidebar } from '../../components/AdminWebSection';
import { useAuth } from '../../contexts/authentication';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

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

  const fetchUserDetail = async (commentsPageNum: number = commentsPage, likesPageNum: number = likesPage) => {
    if (!id) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://leoshin-blog-app-api-with-db.vercel.app/users/${id}?commentsPage=${commentsPageNum}&likesPage=${likesPageNum}&commentsLimit=5&likesLimit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user detail');
      }

      const data: UserDetailResponse = await response.json();
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
      setLoading(false);
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

  const handleCommentsPageChange = (page: number) => {
    setCommentsPage(page);
    fetchUserDetail(page, likesPage);
  };

  const handleLikesPageChange = (page: number) => {
    setLikesPage(page);
    fetchUserDetail(commentsPage, page);
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <LoadingSkeleton className="h-8 w-64" />
            </div>
            <div className="space-y-4">
              <LoadingSkeleton className="h-32" />
              <LoadingSkeleton className="h-64" />
              <LoadingSkeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
              <Button onClick={() => navigate('/admin/users')}>
                Back to User List
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { user, comments, likes } = userDetail;

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/users')}
              className="mb-4"
            >
              ← Back to User List
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Details</h1>
          </div>

      {/* ข้อมูลผู้ใช้ */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-6">
              <AvatarImage src={user.profile_pic} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user.name || user.username}
              </h2>
              <p className="text-gray-600 mb-1">@{user.username}</p>
              <div className="flex items-center space-x-4">
                <Badge
                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                >
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </Badge>
                <Badge
                  variant={user.status === 'active' ? 'default' : 'destructive'}
                >
                  {user.status === 'active' ? 'Active' : 'Banned'}
                </Badge>
                <span className="text-sm text-gray-500">
                  Last Updated: {new Date(user.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {user.role !== 'admin' && (
              <Button
                variant={user.status === 'active' ? 'destructive' : 'default'}
                onClick={() => handleStatusChange(user.status === 'active' ? 'ban' : 'active')}
                disabled={actionLoading}
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
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Comments ({comments.length})</h3>
        </div>
        <div className="p-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">User has no comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      In post: {comment.blog_posts.title}
                    </h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Pagination */}
        {pagination && pagination.comments.totalPages > 1 && (
          <div className="p-6 border-t">
            <Pagination
              currentPage={pagination.comments.currentPage}
              totalPages={pagination.comments.totalPages}
              onPageChange={handleCommentsPageChange}
            />
          </div>
        )}
      </div>

      {/* รายการการกดไลค์ */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Likes ({likes.length})</h3>
        </div>
        <div className="p-6">
          {likes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">User has no likes yet</p>
          ) : (
            <div className="space-y-3">
              {likes.map((like) => (
                <div key={like.id} className="flex justify-between items-center border rounded-lg p-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {like.blog_posts.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(like.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Badge variant="secondary">Like</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Likes Pagination */}
        {pagination && pagination.likes.totalPages > 1 && (
          <div className="p-6 border-t">
            <Pagination
              currentPage={pagination.likes.currentPage}
              totalPages={pagination.likes.totalPages}
              onPageChange={handleLikesPageChange}
            />
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
