import { PenSquare, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Category } from "@/types/blog";

export default function AdminCategoryManagementPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const responseCategories = await axios.get(
          "https://leoshin-blog-app-api-with-db.vercel.app/categories"
        );
        
        if (responseCategories.data.success && responseCategories.data.data) {
          setCategories(responseCategories.data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories data:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchKeyword]);

  const handleDelete = async (categoryId: number) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `https://leoshin-blog-app-api-with-db.vercel.app/categories/${categoryId}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Deleted Category successfully
            </h2>
            <p className="text-sm">The category has been removed.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Failed to delete category
            </h2>
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
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                    Category Management
                  </h2>
                  <p className="text-slate-600">Organize your content with categories</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate("/admin/category-management/create")}
                  >
                    <PenSquare className="mr-2 h-5 w-5" /> Create Category
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
                      <TableHead className="min-w-[200px] font-semibold text-slate-700 py-4 px-4 lg:px-6">Category</TableHead>
                      <TableHead className="min-w-[120px] text-right font-semibold text-slate-700 py-4 px-4 lg:px-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="py-4 px-4 lg:px-6">
                            <div className="h-6 bg-slate-200 rounded animate-pulse w-1/3"></div>
                          </TableCell>
                          <TableCell className="py-4 px-4 lg:px-6">
                            <div className="h-8 bg-slate-200 rounded animate-pulse w-16 ml-auto"></div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <TableRow key={index} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                        <TableCell className="py-4 px-4 lg:px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            <span className="font-medium text-slate-900 text-lg break-words">
                              {category.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4 lg:px-6">
                          <div className="flex items-center justify-end space-x-1 lg:space-x-2">
                            {category.name !== "All" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  navigate(
                                    `/admin/category-management/edit/${category.id}`
                                  );
                                }}
                                className="p-1 lg:p-2 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
                              >
                                <PenSquare className="h-4 w-4" />
                              </Button>
                            )}
                            {category.name !== "All" && (
                              <DeleteCategoryDialog
                                onDelete={() => handleDelete(category.id)}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">No categories found</h3>
                          <p className="text-slate-600 mb-4">No categories match your search criteria.</p>
                          <Button
                            onClick={() => navigate("/admin/category-management/create")}
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                          >
                            Create Your First Category
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface DeleteCategoryDialogProps {
  onDelete: () => void;
}

function DeleteCategoryDialog({ onDelete }: DeleteCategoryDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 hover:text-muted-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
        <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
          Delete Category
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
          Do you want to delete this Category?
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