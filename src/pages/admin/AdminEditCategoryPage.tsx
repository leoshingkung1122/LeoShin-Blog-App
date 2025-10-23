
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminSidebar } from "@/components/AdminWebSection";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEditCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the category data when the component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://leoshin-blog-app-api-with-db.vercel.app/categories/${categoryId}`
        );
        setCategoryName(response.data.data.name);
      } catch {
        toast.custom((t) => (
          <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg mb-1">
                Failed to fetch category data.
              </h2>
              <p className="text-sm">Please try again later.</p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-white hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        ));
        navigate("/admin/category-management");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, navigate]);

  const handleSave = async () => {
    if (!categoryName) {
      setErrorMessage("Category name is required.");
      return;
    }

    setIsSaving(true);

    try {
      await axios.put(
        `https://leoshin-blog-app-api-with-db.vercel.app/categories/${categoryId}`,
        {
          name: categoryName,
        },
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
              Category updated successfully
            </h2>
            <p className="text-sm">
              Your category has been successfully updated.
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

      navigate("/admin/category-management");
    } catch {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Failed to update category
            </h2>
            <p className="text-sm">
              Something went wrong while updating the category. Please try again
              later.
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
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      navigate("/admin/category-management");
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
              Deleted category successfully
            </h2>
            <p className="text-sm">The category has been removed</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
    } catch {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Failed to delete category
            </h2>
            <p className="text-sm">
              Something went wrong while deleting the category. Please try again
              later.
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
        <div className="lg:hidden h-16" />
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                      Edit Category
                    </h2>
                    <p className="text-slate-600">Update your category information</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      className="px-6 py-3 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold"
                      variant="outline"
                      onClick={handleDelete}
                      disabled={isSaving}
                    >
                      Delete Category
                    </Button>
                    <Button
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? "Updating..." : "Update Category"}
                    </Button>
                  </div>
                </div>
              </div>
              {/* Form Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
                <div className="max-w-md">
                  <div className="space-y-6">
                    {/* Category Name Input */}
                    <div className="relative">
                      <label
                        htmlFor="category-name"
                        className="block text-lg font-semibold text-slate-900 mb-3"
                      >
                        Category Name
                      </label>
                      <Input
                        id="category-name"
                        type="text"
                        value={categoryName}
                        onChange={(e) => {
                          setCategoryName(e.target.value);
                          setErrorMessage(""); // Clear error when user types
                        }}
                        placeholder="Enter category name..."
                        className={`w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                          errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                        }`}
                      />
                      {errorMessage && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                          <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
                        </div>
                      )}
                    </div>

                    {/* Warning Message */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-amber-800 font-semibold mb-1">Important Notice</h3>
                          <p className="text-amber-700 text-sm">
                            Deleting this category will remove it from all associated articles. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Help Text */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-blue-800 font-semibold mb-1">Editing Guidelines</h3>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Choose a clear, descriptive name for your category</li>
                            <li>• Changes will affect all articles using this category</li>
                            <li>• Make sure the new name is meaningful to your readers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <main className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-8 bg-slate-200 rounded-xl animate-pulse w-64 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded-xl animate-pulse w-48"></div>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-36"></div>
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-40"></div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
          <div className="max-w-md">
            <div className="space-y-6">
              {/* Category Name Input */}
              <div>
                <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-32 mb-3"></div>
                <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-full"></div>
              </div>

              {/* Warning Message */}
              <div className="h-20 bg-slate-200 rounded-2xl animate-pulse"></div>

              {/* Help Text */}
              <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
