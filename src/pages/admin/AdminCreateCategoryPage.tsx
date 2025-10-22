import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminSidebar } from "@/components/AdminWebSection";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

export default function AdminCreateCategoryPage() {
  const navigate = useNavigate();
  const { categoryCount } = useCategories();
  const [categoryName, setCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    if (!categoryName) {
      setErrorMessage("Category name is required.");
      return;
    }

    if (categoryCount >= 6) {
      setErrorMessage("Maximum 6 categories allowed.");
      return;
    }

    setIsSaving(true);

    try {
      await axios.post(
        "https://leoshin-blog-app-api-with-db.vercel.app/categories",
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
              Created category successfully
            </h2>
            <p className="text-sm">
              Your category has been successfully created.
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

      setCategoryName("");
      navigate("/admin/category-management");
    } catch {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Failed to create category
            </h2>
            <p className="text-sm">
              Something went wrong while creating the category. Please try again
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden h-16" />
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                    Create Category
                  </h2>
                  <p className="text-slate-600">
                    Categories created: <span className="font-semibold text-blue-600">{categoryCount}/6</span>
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleSave}
                    disabled={isSaving || categoryCount >= 6}
                  >
                    {isSaving ? "Creating..." : "Create Category"}
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
                  {categoryCount >= 6 && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-amber-800 font-semibold mb-1">Maximum Categories Reached</h3>
                          <p className="text-amber-700 text-sm">
                            You have reached the maximum number of categories (6). Please delete an existing category to create a new one.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Help Text */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-blue-800 font-semibold mb-1">Category Guidelines</h3>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Choose a clear, descriptive name for your category</li>
                          <li>• Categories help organize your blog content</li>
                          <li>• You can create up to 6 categories total</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}