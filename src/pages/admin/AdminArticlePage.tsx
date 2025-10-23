import { PenSquare, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminSidebar } from "@/components/AdminWebSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authentication";
import type { BlogPost } from "@/types/blog";
import Pagination from "@/components/ui/Pagination";

interface Category {
  id: number;
  name: string;
}

export default function AdminArticleManagementPage() {
  const navigate = useNavigate();
  const { isAuthenticated, state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Pagination states
  const [currentPage] = useState(1);
  const [totalPages] = useState(1);

  

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

  useEffect(() => {
    if (!isAuthenticated || state.user?.role !== 'admin') {
      return;
    }

    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        let postsData = [];
        
        try {
          const response = await axios.get(
            "https://leoshin-blog-app-api-with-db.vercel.app/posts/admin",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          console.log("Posts API response:", response.data);
          
          if (response.data.success && response.data.posts) {
            postsData = response.data.posts;
          }
        } catch (postsError) {
          console.error("Error fetching posts from /posts/admin:", postsError);
          
          // Fallback: try to get posts from regular /posts endpoint
          try {
            console.log("Trying fallback /posts endpoint...");
            const fallbackResponse = await axios.get(
              "https://leoshin-blog-app-api-with-db.vercel.app/posts?limit=100",
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            console.log("Fallback posts response:", fallbackResponse.data);
            
            if (fallbackResponse.data.success && fallbackResponse.data.posts) {
              // Transform the data to match expected format
              postsData = fallbackResponse.data.posts.map((post: { id: number; title?: string; description?: string; content?: string; categories?: { name?: string }; post_status?: { name?: string } }) => ({
                id: post.id,
                title: post.title || 'Untitled',
                description: post.description || '',
                content: post.content || '',
                category: post.categories?.name || 'Uncategorized',
                status: post.post_status?.name?.toLowerCase() || 'published'
              }));
            }
          } catch (fallbackError) {
            console.error("Fallback posts fetch also failed:", fallbackError);
          }
        }
        
        setPosts(postsData);
        setFilteredPosts(postsData);
        
        let categoriesData = [];
        
        try {
          const responseCategories = await axios.get(
            "https://leoshin-blog-app-api-with-db.vercel.app/categories",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          console.log("Categories API response:", responseCategories.data);
          
          if (responseCategories.data.success && responseCategories.data.data) {
            categoriesData = responseCategories.data.data;
          }
        } catch (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
        }
        
        setCategories(categoriesData);
        
        // Show success message if we got some data
        if (postsData.length > 0 || categoriesData.length > 0) {
          console.log(`Loaded ${postsData.length} posts and ${categoriesData.length} categories`);
        } else {
          // Show warning if no data was loaded
          toast.custom((t) => (
            <div className="bg-yellow-500 text-white p-4 rounded-sm flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg mb-1">No data found</h2>
                <p className="text-sm">No articles or categories were found. You may need to create some content first.</p>
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
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
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

  /*useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // สร้าง query parameters สำหรับ pagination และ filters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
          ...(searchKeyword && { keyword: searchKeyword }),
          ...(selectedStatus && { status: selectedStatus }),
          ...(selectedCategory && selectedCategory !== "All" && { category: selectedCategory })
        });

        let postsData = [];
        let paginationData = null;
        
        try {
          const response = await axios.get(
            `https://leoshin-blog-app-api-with-db.vercel.app/posts/admin?${params}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          console.log("Posts API response:", response.data);
          
          if (response.data.success && response.data.posts) {
            postsData = response.data.posts;
            paginationData = response.data.pagination;
          }
        } catch (postsError) {
          console.error("Error fetching posts from /posts/admin:", postsError);
          
          // Fallback: try to get posts from regular /posts endpoint
          try {
            console.log("Trying fallback /posts endpoint...");
            const fallbackResponse = await axios.get(
              "https://leoshin-blog-app-api-with-db.vercel.app/posts?limit=100",
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            console.log("Fallback posts response:", fallbackResponse.data);
            
            if (fallbackResponse.data.success && fallbackResponse.data.posts) {
              // Transform the data to match expected format
              postsData = fallbackResponse.data.posts.map((post: { id: number; title?: string; description?: string; content?: string; categories?: { name?: string }; post_status?: { name?: string } }) => ({
                id: post.id,
                title: post.title || 'Untitled',
                description: post.description || '',
                content: post.content || '',
                category: post.categories?.name || 'Uncategorized',
                status: post.post_status?.name?.toLowerCase() || 'published'
              }));
              
              // Create mock pagination for fallback
              paginationData = {
                currentPage: 1,
                totalPages: 1,
                totalPosts: postsData.length,
                limit: 100,
                hasNextPage: false,
                hasPrevPage: false
              };
            }
          } catch (fallbackError) {
            console.error("Fallback posts fetch also failed:", fallbackError);
          }
        }
        
        setPosts(postsData);
        setFilteredPosts(postsData);
        
        // Set pagination data
        if (paginationData) {
          setTotalPages(paginationData.totalPages);
        }
        
        let categoriesData = [];
        
        try {
          const responseCategories = await axios.get(
            "https://leoshin-blog-app-api-with-db.vercel.app/categories",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          console.log("Categories API response:", responseCategories.data);
          
          if (responseCategories.data.success && responseCategories.data.data) {
            categoriesData = responseCategories.data.data;
          }
        } catch (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
        }
        
        setCategories(categoriesData);
        
        // Show success message if we got some data
        if (postsData.length > 0 || categoriesData.length > 0) {
          console.log(`Loaded ${postsData.length} posts and ${categoriesData.length} categories`);
        } else {
          // Show warning if no data was loaded
          toast.custom((t) => (
            <div className="bg-yellow-500 text-white p-4 rounded-sm flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg mb-1">No data found</h2>
                <p className="text-sm">No articles or categories were found. You may need to create some content first.</p>
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
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchKeyword, selectedStatus, selectedCategory, navigate]);*/

  const handleDelete = async (postId: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(
        `https://leoshin-blog-app-api-with-db.vercel.app/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Deleted article successfully
            </h2>
            <p className="text-sm">The article has been removed.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Failed to delete article</h2>
            <p className="text-sm">
              Something went wrong. Please try again later.
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
      
      // If unauthorized, redirect to login
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        {/* Mobile spacing */}
        <div className="lg:hidden h-16" />
        
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                    Article Management
                  </h2>
                  <p className="text-slate-600">Manage your blog posts and content</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate("/admin/article-management/create")}
                  >
                    <PenSquare className="mr-2 h-5 w-5" /> Create Article
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value)}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="published" className="rounded-lg">Published</SelectItem>
                      <SelectItem value="draft" className="rounded-lg">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name} className="rounded-lg">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden xl:block overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
                      <TableHead className="w-[40%] font-semibold text-slate-700 py-3 px-6">Article Title</TableHead>
                      <TableHead className="w-[15%] font-semibold text-slate-700 py-3 px-6">Category</TableHead>
                      <TableHead className="w-[15%] font-semibold text-slate-700 py-3 px-6">Status</TableHead>
                      <TableHead className="w-[30%] text-right font-semibold text-slate-700 py-3 px-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="py-4 px-6">
                            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="h-6 bg-slate-200 rounded-full animate-pulse w-20"></div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="h-8 bg-slate-200 rounded animate-pulse w-16 ml-auto"></div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((article) => (
                      <TableRow key={article.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                        <TableCell className="py-4 px-6">
                          <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors break-words">
                            {typeof article.title === 'string' ? article.title : 'Untitled'}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {typeof article.category === 'string' ? article.category : 'Uncategorized'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              article.status === "draft"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {typeof article.status === 'string' ? article.status : 'unknown'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (article.id) {
                                  navigate(`/admin/article-management/edit/${article.id}`);
                                } else {
                                  console.error("Attempted to edit post with undefined ID:", article);
                                  toast.error("Cannot edit post: Invalid Post ID.");
                                }
                              }}
                              className="p-2 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
                            >
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <DeletePostDialog
                              onDelete={() => {
                                if (article.id) {
                                  handleDelete(article.id)
                                } else {
                                  console.error("Attempted to delete post with undefined ID:", article);
                                  toast.error("Cannot delete post: Invalid Post ID.");
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                          <p className="text-slate-600 mb-4">No posts match your search criteria.</p>
                          <Button
                            onClick={() => navigate("/admin/article-management/create")}
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                          >
                            Create Your First Article
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>

              {/* Mobile Card View */}
              <div className="xl:hidden">
                {isLoading ? (
                  <div className="space-y-4 p-4">
                    {Array(5).fill(null).map((_, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                          <div className="h-8 bg-slate-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="space-y-4 p-4">
                    {filteredPosts.map((article) => (
                      <div key={article.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="mb-3">
                          <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">
                            {typeof article.title === 'string' ? article.title : 'Untitled'}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {typeof article.category === 'string' ? article.category : 'Uncategorized'}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                article.status === "draft"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {typeof article.status === 'string' ? article.status : 'unknown'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (article.id) {
                                navigate(`/admin/article-management/edit/${article.id}`);
                              } else {
                                console.error("Attempted to edit post with undefined ID:", article);
                                toast.error("Cannot edit post: Invalid Post ID.");
                              }
                            }}
                            className="p-2 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                          <DeletePostDialog
                            onDelete={() => {
                              if (article.id) {
                                handleDelete(article.id)
                              } else {
                                console.error("Attempted to delete post with undefined ID:", article);
                                toast.error("Cannot delete post: Invalid Post ID.");
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                      <p className="text-slate-600 mb-4">No articles match your search criteria.</p>
                      <Button
                        onClick={() => navigate("/admin/article-management/create")}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                      >
                        Create Your First Article
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Pagination */}
            {!isLoading && filteredPosts.length > 0 && (
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
          </div>
        </main>
      </div>
    </div>
  );
}

interface DeletePostDialogProps {
  onDelete: () => void;
}

function DeletePostDialog({ onDelete }: DeletePostDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 hover:text-muted-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
        <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
          Delete Post
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
          Do you want to delete this post?
        </AlertDialogDescription>
        <div className="flex flex-row gap-4">
          <AlertDialogCancel className="bg-background px-10 py-6 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={onDelete}
            className="rounded-full text-white bg-foreground hover:bg-muted-foreground transition-colors py-6 text-lg px-10"
          >
            Delete
          </Button>
        </div>
        <AlertDialogCancel className="absolute right-4 top-2 sm:top-4 p-1 border-none">
          <X className="h-6 w-6" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}