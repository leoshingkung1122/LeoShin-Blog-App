import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSidebar } from "@/components/AdminWebSection";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/contexts/authentication";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { BlogPost } from "@/types/blog";

interface Category {
  id: number;
  name: string;
}

interface ImageFileData {
  file?: File;
}

export default function AdminCreateArticlePage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Partial<BlogPost>>({
    image: "",
    category_id: undefined,
    title: "",
    description: "",
    content: "",
    status_id: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<ImageFileData>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const responseCategories = await axios.get(
          "https://leoshin-blog-app-api-with-db.vercel.app/categories"
        );
        setCategories(responseCategories.data.data);
      } catch (error) {
        console.error("Error fetching categories data:", error);
        navigate("*");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]); // Re-fetch if postId changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.name === value);
    setPost((prevData) => ({
      ...prevData,
      category: value, // The category name
      category_id: selectedCategory?.id || undefined, // Update the category_id
    }));
  };

  const handleSave = async (postStatusId: number) => {
    setIsSaving(true);
    
    // Validate required fields
    if (!post.title?.trim()) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Validation Error</h2>
            <p className="text-sm">Title is required.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setIsSaving(false);
      return;
    }

    if (!post.description?.trim()) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Validation Error</h2>
            <p className="text-sm">Description is required.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setIsSaving(false);
      return;
    }

    if (!post.content?.trim()) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Validation Error</h2>
            <p className="text-sm">Content is required.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setIsSaving(false);
      return;
    }

    if (!post.category_id) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Validation Error</h2>
            <p className="text-sm">Please select a category.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setIsSaving(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Authentication Error</h2>
            <p className="text-sm">Please login again.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setIsSaving(false);
      return;
    }

    try {
      let imageUrl = "https://via.placeholder.com/800x400?text=No+Image";

      if (imageFile.file) {
        const formData = new FormData();
        formData.append('image', imageFile.file);

        const uploadResponse = await axios.post(
          "https://leoshin-blog-app-api-with-db.vercel.app/posts/upload-image",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (!uploadResponse.data.success) {
          throw new Error(uploadResponse.data.error || "Failed to upload image");
        }

        imageUrl = uploadResponse.data.imageUrl;
      }

      const postData = {
        title: post.title,
        description: post.description,
        content: post.content,
        category_id: post.category_id,
        status_id: postStatusId,
        image: imageUrl,
      };

      await axios.post(
        "https://leoshin-blog-app-api-with-db.vercel.app/posts",
        postData,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      // Success toast
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Created article successfully
            </h2>
            <p className="text-sm">
              {postStatusId === 1
                ? "Your article has been successfully published."
                : postStatusId === 2
                ? "Your article has been successfully saved as draft."
                : ""}
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
      navigate("/admin/article-management"); // Redirect after saving
    } catch (error) {
      console.error("Error creating post:", error);
      
      let errorMessage = "Something went wrong while trying to create article. Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes('413')) {
          errorMessage = "Image file is too large. Please choose a smaller image (max 10MB).";
        } else if (error.message.includes('500')) {
          errorMessage = "Server error occurred. Please check your data and try again.";
        } else if (error.message.includes('Network Error')) {
          errorMessage = "Network error. Please check your internet connection.";
        }
      }
      
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Failed to create article</h2>
            <p className="text-sm">{errorMessage}</p>
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file

    // Check if the file is an image
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!file) {
      // No file selected
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Failed to upload file</h2>
            <p className="text-sm">
              Please upload a valid image file (JPEG, PNG, GIF, WebP).
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
      return; // Stop further processing if it's not a valid image
    }

    // Check file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Failed to upload file</h2>
            <p className="text-sm">
              The file is too large. Please upload an image smaller than 10MB.
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
      return;
    }

    // เก็บข้อมูลไฟล์
    setImageFile({ file });
    
    // Create preview URL for immediate display
    const previewUrl = URL.createObjectURL(file);
    setPost((prevData) => ({
      ...prevData,
      image: previewUrl,
    }));
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
                      Create Article
                    </h2>
                    <p className="text-slate-600">Write and publish your new blog post</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      className="px-6 py-3 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-semibold"
                      variant="outline"
                      disabled={isSaving}
                      onClick={() => handleSave(2)}
                    >
                      {isSaving ? "Saving..." : "Save as Draft"}
                    </Button>
                    <Button
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      disabled={isSaving}
                      onClick={() => handleSave(1)}
                    >
                      {isSaving ? "Publishing..." : "Publish Article"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
                <form className="space-y-8">
                  {/* Image Upload Section */}
                  <div>
                    <label
                      htmlFor="thumbnail"
                      className="block text-lg font-semibold text-slate-900 mb-4"
                    >
                      Thumbnail Image
                    </label>
                    <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                      {imageFile.file ? (
                        <div className="relative group">
                          <img
                            src={URL.createObjectURL(imageFile.file)}
                            alt="Uploaded"
                            className="rounded-2xl object-cover w-full max-w-lg h-80 shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl"></div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center w-full max-w-lg h-80 px-6 py-20 border-2 border-slate-300 border-dashed rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                              <ImageIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <p className="text-slate-600 font-medium">No image selected</p>
                              <p className="text-sm text-slate-500">Upload a thumbnail for your article</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <label
                        htmlFor="file-upload"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer text-center"
                      >
                        <span>Upload Thumbnail</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label htmlFor="category" className="block text-lg font-semibold text-slate-900 mb-3">
                      Category
                    </label>
                    <Select
                      value={categories.find(c => c.id === post.category_id)?.name || ""}
                      onValueChange={(value) => {
                        handleCategoryChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full lg:max-w-lg py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Select category" />
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

                  {/* Author Name */}
                  <div>
                    <label htmlFor="author" className="block text-lg font-semibold text-slate-900 mb-3">
                      Author Name
                    </label>
                    <Input
                      id="author"
                      name="author"
                      value={state.user?.name || ""}
                      className="w-full lg:max-w-lg py-3 px-4 rounded-xl border-slate-200 bg-slate-50 text-slate-600"
                      disabled
                    />
                  </div>

                  {/* Article Title */}
                  <div>
                    <label htmlFor="title" className="block text-lg font-semibold text-slate-900 mb-3">
                      Article Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter your article title..."
                      value={post.title}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  {/* Introduction */}
                  <div>
                    <label htmlFor="introduction" className="block text-lg font-semibold text-slate-900 mb-3">
                      Introduction <span className="text-sm text-slate-500 font-normal">(max 120 characters)</span>
                    </label>
                    <Textarea
                      id="introduction"
                      name="description"
                      placeholder="Write a brief introduction to your article..."
                      rows={3}
                      value={post.description}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      maxLength={120}
                    />
                    <div className="text-right text-sm text-slate-500 mt-1">
                      {post.description?.length || 0}/120 characters
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-lg font-semibold text-slate-900 mb-3">
                      Article Content
                    </label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Write your article content here..."
                      rows={20}
                      value={post.content}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                    />
                  </div>
                </form>
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
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-32"></div>
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-36"></div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
          <div className="space-y-8">
            {/* Image Upload Section */}
            <div>
              <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-32 mb-4"></div>
              <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                <div className="h-80 bg-slate-200 rounded-2xl animate-pulse w-full max-w-lg"></div>
                <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-40"></div>
              </div>
            </div>

            {/* Category */}
            <div>
              <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-20 mb-3"></div>
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-full lg:max-w-lg"></div>
            </div>

            {/* Author */}
            <div>
              <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-24 mb-3"></div>
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-full lg:max-w-lg"></div>
            </div>

            {/* Title */}
            <div>
              <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-28 mb-3"></div>
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-full"></div>
            </div>

            {/* Introduction */}
            <div>
              <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-32 mb-3"></div>
              <div className="h-24 bg-slate-200 rounded-xl animate-pulse w-full"></div>
            </div>

            {/* Content */}
            <div>
              <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-36 mb-3"></div>
              <div className="h-80 bg-slate-200 rounded-xl animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}