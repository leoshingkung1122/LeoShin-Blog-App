import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { AdminSidebar } from "@/components/AdminWebSection";
import { useAuth } from "@/contexts/authentication";
import { toast } from "sonner";
import axios from "axios";

export default function AdminProfilePage() {
  const { state, fetchUser } = useAuth();
  const [profile, setProfile] = useState({
    image: "",
    name: "",
    username: "",
    email: "",
    introduction: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Set initial profile data from auth state
        setProfile({
          image: state.user?.profile_pic || "",
          name: state.user?.name || "",
          username: state.user?.username || "",
          email: state.user?.email || "",
          introduction: state.user?.introduction || "",
        });
      } catch {
        toast.custom((t) => (
          <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg mb-1">
                Failed to fetch profile
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
      }
    };

    fetchProfile();
  }, [state.user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Invalid file type</h2>
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
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">File too large</h2>
            <p className="text-sm">Please upload an image smaller than 5MB.</p>
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

    setImageFile(file);
    setProfile((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication Error", { description: "Please login again." });
        setIsSaving(false);
        return;
      }

      let imageUrl = profile.image; // Default to current image

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await axios.post(
          "https://leoshin-blog-app-api-with-db.vercel.app/profiles/upload-image",
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

      const profileData = {
        name: profile.name,
        introduction: profile.introduction,
        profile_pic: imageUrl,
      };

      await axios.put(
        "https://leoshin-blog-app-api-with-db.vercel.app/profiles",
        profileData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Profile updated successfully
            </h2>
            <p className="text-sm">Your profile changes have been saved.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));

      // Update local state after successful save
      setProfile((prev) => ({
        ...prev,
        image: imageUrl,
      }));
      setImageFile(null);
      fetchUser(); // Refresh user data from context

    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (error as Error).message || "Failed to update profile";
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Failed to update profile</h2>
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
                    Profile Settings
                  </h2>
                  <p className="text-slate-600">Manage your personal information and preferences</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
              {/* Avatar Section */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
                    <AvatarImage
                      src={profile.image}
                      alt="Profile picture"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-4xl">
                      {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {profile.name || "Your Name"}
                  </h3>
                  <p className="text-slate-600 mb-4">@{profile.username}</p>
                  <label
                    htmlFor="profile-upload"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Change Profile Picture
                    <input
                      id="profile-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* Form Section */}
              <form
                className="space-y-6"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-lg font-semibold text-slate-900 mb-3">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-lg font-semibold text-slate-900 mb-3">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={profile.username}
                    readOnly
                    className="w-full py-3 px-4 rounded-xl border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                    placeholder="Username cannot be changed"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Username cannot be changed after account creation
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-lg font-semibold text-slate-900 mb-3">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full py-3 px-4 rounded-xl border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Email address cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Introduction Field */}
                <div>
                  <label htmlFor="introduction" className="block text-lg font-semibold text-slate-900 mb-3">
                    Bio / Introduction
                  </label>
                  <Textarea
                    id="introduction"
                    name="introduction"
                    value={profile.introduction}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full py-3 px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                    rows={4}
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    A brief description about yourself (optional)
                  </p>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}