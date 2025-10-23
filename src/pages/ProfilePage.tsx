import { useState, useEffect } from "react";
import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useNavigate } from "react-router-dom";
import { X, User, Lock, Upload, Save, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useAuth } from "@/contexts/authentication";
import { toast } from "sonner";
import axios from "axios";
import Aki2 from "@/assets/Aki2.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, fetchUser } = useAuth();
  const [profile, setProfile] = useState({
    image: "",
    name: "",
    username: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<{ file?: File }>({});

  // Add error boundary for component
  if (!state.user && !state.getUserLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load profile</h2>
            <p className="text-gray-600 mb-4">Please try refreshing the page or logging in again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfile({
          image: state.user?.profile_pic || "",
          name: state.user?.name || "",
          username: state.user?.username || "",
          email: state.user?.email || "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageFile({ file });
    setProfile((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSaving(true);

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

      let imageUrl = profile.image; // Default to current image

      if (imageFile.file) {
        const formData = new FormData();
        formData.append('image', imageFile.file);

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

      // Update local profile state with new image URL
      setProfile((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      // Clear the image file state
      setImageFile({});

      // Refresh user data from server
      await fetchUser();
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Safely extract error message to prevent React rendering errors
      let errorMessage = "Something went wrong. Please try again.";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          errorMessage = String(error.response.data.error);
        } else if (error.message) {
          errorMessage = String(error.message);
        }
      } else if (error instanceof Error) {
        errorMessage = String(error.message);
      }
      
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
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

      <NavBar />
      <main className="flex-grow">
        <div className="w-full container mx-auto px-4 pt-16 pb-8 md:pt-20 md:pb-12">
          <div className="w-full max-w-6xl mx-auto relative">
            {/* Grid Layout: Form + Frieren */}
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-center">
              {/* Main card - Form */}
              <div className="relative bg-white rounded-2xl shadow-2xl px-6 sm:px-8 py-8 border border-gray-100 overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-800 to-transparent"></div>
                  </div>

                  {/* Decorative blur elements */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-violet-200 via-purple-200 to-fuchsia-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none animate-pulse" />
                  <div
                    className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-200 via-violet-200 to-fuchsia-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />

                {/* Navigation */}
                <div className="relative z-10 flex items-center gap-4 mb-6">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 rounded-lg font-semibold border border-violet-200"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/reset-password")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-700 hover:border hover:border-red-200 rounded-lg transition-all duration-200"
                  >
                    <Lock className="h-4 w-4" />
                    Reset Password
                  </button>
                </div>

                {/* Header */}
                <div className="relative z-10 text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent mb-2 animate-fade-in">
                    Profile Settings
                  </h2>
                  <p className="text-gray-600 text-sm flex items-center justify-center gap-1.5">
                    <span>✨</span>
                    Manage your personal information
                    <span>✨</span>
                  </p>
                </div>

                {/* Profile Picture Section */}
                <div className="relative z-10 flex flex-col items-center mb-6">
                  <Avatar className="h-28 w-28 mb-4 border-4 border-white shadow-xl">
                    <AvatarImage
                      src={imageFile.file ? URL.createObjectURL(imageFile.file) : profile.image}
                      alt="Profile"
                      className="object-cover"
                    />
                      <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-500 text-white">
                      <User2 className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <label className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload profile picture
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Display Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 hover:border-violet-300 focus:shadow-lg focus:shadow-violet-100 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gradient-to-r from-white to-violet-50/30"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="username"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Username
                    </label>
                    <Input
                      id="username"
                      name="username"
                      value={profile.username}
                      readOnly
                      className="py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Username cannot be changed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="group relative w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-full transition-all duration-300 font-bold shadow-2xl hover:shadow-violet-500/50 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm overflow-hidden
                    before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:bg-gradient-to-r before:from-fuchsia-400 before:via-violet-400 before:to-purple-400 before:w-0 before:transition-all before:duration-700 before:ease-out hover:before:w-full before:rounded-full
                    after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-white/0 after:via-white/20 after:to-white/0 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-1000"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full relative z-10" />
                          <span className="relative z-10">Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 relative z-10" />
                          <span className="relative z-10">Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Character - Hidden on mobile/tablet */}
              <div className="hidden lg:flex items-center justify-center relative group">
                  {/* Floating Hearts */}
                  <div className="absolute top-10 left-16 w-2 h-2 bg-violet-400/80 rounded-full shadow-lg shadow-violet-400/50 animate-droplet-1"></div>
                  <div className="absolute top-20 right-20 w-2.5 h-2.5 bg-purple-400/70 rounded-full shadow-lg shadow-purple-400/50 animate-droplet-2"></div>
                  <div className="absolute bottom-16 left-12 w-2 h-2 bg-fuchsia-400/90 rounded-full shadow-lg shadow-fuchsia-400/50 animate-droplet-3"></div>

                {/* Character Image with Effects */}
                <div className="relative z-10">
                  {/* Glow Base */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400/30 via-purple-400/30 to-fuchsia-400/30 blur-3xl animate-pulse-slow"></div>

                  {/* Ripple Waves on Hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-400/50 animate-ripple"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-fuchsia-400/40 animate-ripple-delayed"></div>
                  </div>

                  <img
                    src={Aki2}
                    alt="Fern"
                    className="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 relative z-10"
                  />
                </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-80 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 pointer-events-none z-50">
                    <div className="bg-gradient-to-br from-white via-violet-50 to-purple-50 rounded-2xl shadow-2xl p-5 border-2 border-violet-400 relative backdrop-blur-sm">
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-white to-violet-50 border-r-2 border-b-2 border-violet-400 transform rotate-45"></div>
                      <div className="space-y-3 relative z-10">
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 mb-1.5 px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full">
                            <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                              Profile Updated! ✨
                            </span>
                          </div>
                        <p className="text-xs text-gray-600 italic font-medium mt-1">
                          "Looking good!"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}