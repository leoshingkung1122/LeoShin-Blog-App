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
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Create Category</h2>
            <p className="text-sm text-gray-600 mt-1">
              Categories created: {categoryCount}/6
            </p>
          </div>
          <Button
            className="px-8 py-2 rounded-full"
            onClick={handleSave}
            disabled={isSaving || categoryCount >= 6}
          >
            Save
          </Button>
        </div>
        <div className="space-y-7 max-w-md">
          <div className="relative space-y-1">
            <label
              htmlFor="category-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
            </label>
            <Input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className={`mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground ${
                errorMessage ? "border-red-500" : ""
              }`}
            />
            {errorMessage && (
              <p className="text-red-500 text-xs absolute">{errorMessage}</p>
            )}
          </div>
          
          {categoryCount >= 6 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="text-sm">
                Maximum number of categories reached. Delete a category to create a new one.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}