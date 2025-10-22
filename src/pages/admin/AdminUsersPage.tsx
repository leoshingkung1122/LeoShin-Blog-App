import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/Avatar';
import Badge from '../../components/ui/badge';
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
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0">
          <div className="lg:hidden h-16" />
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                  User Management
                </h1>
                <p className="text-slate-600">View and manage all users in the system</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden h-16" />
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                User Management
              </h1>
              <p className="text-slate-600">View and manage all users in the system</p>
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
                    <tr>
                      <th className="w-[30%] px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="w-[12%] px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="w-[12%] px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="w-[18%] px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="w-[28%] px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4 ring-2 ring-white shadow-lg">
                              <AvatarImage src={user.profile_pic} alt={user.username} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-slate-900 truncate">
                                {user.name || user.username}
                              </div>
                              <div className="text-sm text-slate-500 truncate">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              user.role === 'admin' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status === 'active' ? 'Active' : 'Banned'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(user.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewUserDetail(user.id)}
                              className="px-3 py-1 text-xs rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                            >
                              View Details
                            </Button>
                            {user.role !== 'admin' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'ban' : 'active')}
                                disabled={actionLoading === user.id}
                                className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                                  user.status === 'active'
                                    ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                                    : 'border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300'
                                }`}
                              >
                                {actionLoading === user.id ? 'Processing...' : 
                                 user.status === 'active' ? 'Ban' : 'Unban'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {users.length > 0 ? (
                  <div className="space-y-4 p-4">
                    {users.map((user) => (
                      <div key={user.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-12 w-12 mr-4 ring-2 ring-white shadow-lg">
                            <AvatarImage src={user.profile_pic} alt={user.username} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 truncate">
                              {user.name || user.username}
                            </div>
                            <div className="text-sm text-slate-500 truncate">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              user.role === 'admin' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </Badge>
                          <Badge
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status === 'active' ? 'Active' : 'Banned'}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 mb-4">
                          Last Updated: {new Date(user.updated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUserDetail(user.id)}
                            className="px-3 py-2 text-xs rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                          >
                            View Details
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'ban' : 'active')}
                              disabled={actionLoading === user.id}
                              className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                                user.status === 'active'
                                  ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                                  : 'border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300'
                              }`}
                            >
                              {actionLoading === user.id ? 'Processing...' : 
                               user.status === 'active' ? 'Ban User' : 'Unban User'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
                      <p className="text-slate-600">No user data available at the moment.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersPage;
