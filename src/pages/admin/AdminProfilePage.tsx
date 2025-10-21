import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    setImageFile(file);
    setProfile((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("name", profile.name);
      // Username is not editable, so we don't send it

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axios.put(
        "https://leoshin-blog-app-api-with-db.vercel.app/profiles",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to update profile";
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
      fetchUser();
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <Button
            className="px-8 py-2 rounded-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div>
          <div className="flex items-center mb-6">
            <Avatar className="w-24 h-24 mr-4">
              <AvatarImage
                src={profile.image}
                alt="Profile picture"
                className="object-cover"
              />
              <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="profile-upload"
              className="px-8 py-2 bg-background rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors cursor-pointer"
            >
              <span>Upload profile picture</span>
              <input
                id="profile-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          <form
            className="space-y-7 max-w-2xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                name="username"
                value={profile.username}
                readOnly
                className="mt-1 py-3 rounded-sm bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Username cannot be changed"
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                disabled
                className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}