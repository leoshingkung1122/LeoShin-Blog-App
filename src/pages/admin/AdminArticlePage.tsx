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
import { Skeleton } from "@/components/ui/skeleton";
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

  useEffect(() => {
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
              postsData = fallbackResponse.data.posts.map((post: any) => ({
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
  }, [navigate]);

  useEffect(() => {
    let filtered = posts;

    if (searchKeyword) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          post.description
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          post.content.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((post) =>
        post.status?.toLowerCase().includes(selectedStatus.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [searchKeyword, selectedCategory, selectedStatus, posts]);

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
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Article management</h2>
          <Button
            className="px-8 py-2 rounded-full"
            onClick={() => navigate("/admin/article-management/create")}
          >
            <PenSquare className="mr-2 h-4 w-4" /> Create article
          </Button>
        </div>
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[180px] py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[180px] py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Article title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(9)
                .fill(null)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[250px] bg-[#EFEEEB]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px] bg-[#EFEEEB]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px] bg-[#EFEEEB]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[50px] bg-[#EFEEEB]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    {typeof article.title === 'string' ? article.title : 'Untitled'}
                  </TableCell>
                  <TableCell>
                    {typeof article.category === 'string' ? article.category : 'Uncategorized'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex capitalize items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        article.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {typeof article.status === 'string' ? article.status : 'unknown'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
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
                    >
                      <PenSquare className="h-4 w-4 hover:text-muted-foreground" />
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center font-medium pt-8">
                  No posts found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
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