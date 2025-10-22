import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: PaginationInfo;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const navigate = useNavigate();
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

  const fetchUsers = async (page: number = currentPage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://leoshin-blog-app-api-with-db.vercel.app/users?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: UsersResponse = await response.json();
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'ban') => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://leoshin-blog-app-api-with-db.vercel.app/users/${userId}/status`, {
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
      
      // Update status in state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
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
      setActionLoading(null);
    }
  };

  const handleViewUserDetail = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">View and manage all users in the system</p>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">View and manage all users in the system</p>
          </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={user.profile_pic} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {user.status === 'active' ? 'Active' : 'Banned'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUserDetail(user.id)}
                    >
                      View Details
                    </Button>
                    {user.role !== 'admin' && (
                      <Button
                        variant={user.status === 'active' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'ban' : 'active')}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? 'Processing...' : 
                         user.status === 'active' ? 'Ban' : 'Unban'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No user data found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
