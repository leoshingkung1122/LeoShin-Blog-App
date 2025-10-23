import { useState } from "react";
import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { User, Lock, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";
import Yuna1 from "@/assets/Yuna1.png";
import { useAuth } from "@/contexts/authentication";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [valid, setValid] = useState({
    password: true,
    newPassword: true,
    confirmNewPassword: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Add error boundary for component
  if (!state.user && !state.getUserLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load page</h2>
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidPassword = password.trim() !== "";
    const isValidNewPassword = newPassword.trim() !== "";
    const isValidConfirmPassword =
      confirmNewPassword.trim() !== "" && confirmNewPassword === newPassword;

    setValid({
      password: isValidPassword,
      newPassword: isValidNewPassword,
      confirmNewPassword: isValidConfirmPassword,
    });

    if (isValidPassword && isValidNewPassword && isValidConfirmPassword) {
      setIsDialogOpen(true);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsDialogOpen(false);

      const response = await axios.post(
        `https://leoshin-blog-app-api-with-db.vercel.app/auth/reset-password`,
        {
          oldPassword: password,
          newPassword: newPassword,
        },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.status === 200) {
        toast.custom((t) => (
          <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg mb-1">Success!</h2>
              <p className="text-sm">
                Password reset successful. You can now log in with your new
                password.
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

        // Clear form fields after successful reset
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      
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
            <h2 className="font-bold text-lg mb-1">Error</h2>
            <p className="text-sm">
              {errorMessage}
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
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-800 to-transparent"></div>
                </div>

                {/* Decorative blur elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-red-200 via-orange-200 to-amber-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none animate-pulse" />
                <div
                  className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-amber-200 via-red-200 to-orange-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none animate-pulse"
                  style={{ animationDelay: "1s" }}
                />

                {/* Navigation */}
                <div className="relative z-10 flex items-center gap-4 mb-6">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 hover:border hover:border-purple-200 rounded-lg transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/reset-password")}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 rounded-lg font-semibold border border-red-200"
                  >
                    <Lock className="h-4 w-4" />
                    Reset Password
                  </button>
                </div>

                {/* Header with animated icon */}
                <div className="relative z-10 text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 rounded-full mb-3 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-amber-300 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <Lock className="w-8 h-8 text-white relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent mb-1.5 animate-fade-in">
                    Security Settings
                  </h2>
                  <p className="text-gray-600 text-sm flex items-center justify-center gap-1.5">
                    <span>🔒</span>
                    Update your password to keep your account secure
                    <span>🔒</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Current Password
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter your current password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`py-3 rounded-xl border-2 transition-all duration-300 ${
                        !valid.password
                          ? "border-red-500 focus:border-red-600 shadow-red-100"
                          : "border-gray-200 focus:border-red-500 hover:border-red-300 focus:shadow-lg focus:shadow-red-100"
                      } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gradient-to-r from-white to-red-50/30`}
                    />
                    {!valid.password && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1 animate-shake">
                        <span>⚠️</span>
                        This field is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`py-3 rounded-xl border-2 transition-all duration-300 ${
                        !valid.newPassword
                          ? "border-red-500 focus:border-red-600 shadow-red-100"
                          : "border-gray-200 focus:border-orange-500 hover:border-orange-300 focus:shadow-lg focus:shadow-orange-100"
                      } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gradient-to-r from-white to-orange-50/30`}
                    />
                    {!valid.newPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1 animate-shake">
                        <span>🔒</span>
                        Password must be at least 8 characters
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirm-new-password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Confirm your new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={`py-3 rounded-xl border-2 transition-all duration-300 ${
                        !valid.confirmNewPassword
                          ? "border-red-500 focus:border-red-600 shadow-red-100"
                          : "border-gray-200 focus:border-amber-500 hover:border-amber-300 focus:shadow-lg focus:shadow-amber-100"
                      } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gradient-to-r from-white to-amber-50/30`}
                    />
                    {!valid.confirmNewPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1 animate-shake">
                        <span>❌</span>
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      className="group relative w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white rounded-full transition-all duration-300 font-bold shadow-2xl hover:shadow-red-500/50 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm overflow-hidden
                    before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:bg-gradient-to-r before:from-amber-400 before:via-orange-400 before:to-red-400 before:w-0 before:transition-all before:duration-700 before:ease-out hover:before:w-full before:rounded-full
                    after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-white/0 after:via-white/20 after:to-white/0 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-1000"
                    >
                      <span className="relative z-10">🔐 Reset Password</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Character - Hidden on mobile/tablet */}
              <div className="hidden lg:flex items-center justify-center relative group">
                {/* Floating Security Elements */}
                <div className="absolute top-10 left-16 w-2 h-2 bg-red-400/80 rounded-full shadow-lg shadow-red-400/50 animate-droplet-1"></div>
                <div className="absolute top-20 right-20 w-2.5 h-2.5 bg-orange-400/70 rounded-full shadow-lg shadow-orange-400/50 animate-droplet-2"></div>
                <div className="absolute bottom-16 left-12 w-2 h-2 bg-amber-400/90 rounded-full shadow-lg shadow-amber-400/50 animate-droplet-3"></div>

                {/* Character Image with Effects */}
                <div className="relative z-10">
                  {/* Glow Base */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/30 via-orange-400/30 to-amber-400/30 blur-3xl animate-pulse-slow"></div>

                  {/* Ripple Waves on Hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-full border-4 border-red-400/50 animate-ripple"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-orange-400/40 animate-ripple-delayed"></div>
                  </div>

                  <img
                    src={Yuna1}
                    alt="Frieren - Security Guardian"
                    className="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 relative z-10"
                  />
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-80 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 pointer-events-none z-50">
                  <div className="bg-gradient-to-br from-white via-red-50 to-orange-50 rounded-2xl shadow-2xl p-5 border-2 border-red-400 relative backdrop-blur-sm">
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-white to-red-50 border-r-2 border-b-2 border-red-400 transform rotate-45"></div>
                    <div className="space-y-3 relative z-10">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 mb-1.5 px-3 py-1 bg-gradient-to-r from-red-100 to-orange-100 rounded-full">
                          <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            Password Secured! 🔒
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 italic font-medium mt-1">
                          "Stay safe out there!"
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
      <ResetPasswordModal
        dialogState={isDialogOpen}
        setDialogState={setIsDialogOpen}
        resetFunction={handleResetPassword}
      />
    </div>
  );
}

function ResetPasswordModal({ 
  dialogState, 
  setDialogState, 
  resetFunction 
}: { 
  dialogState: boolean; 
  setDialogState: (state: boolean) => void; 
  resetFunction: () => void;
}) {
  return (
    <AlertDialog open={dialogState} onOpenChange={setDialogState}>
      <AlertDialogContent className="!fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 bg-gradient-to-br from-white to-red-50 rounded-xl pt-8 pb-8 max-w-[26rem] sm:max-w-lg flex flex-col items-center shadow-2xl border-0 relative overflow-hidden z-50">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-800 to-transparent"></div>
        </div>
        
        {/* Friren in Modal */}
        <div className="absolute top-4 right-4 opacity-30">
          <img 
            src={Yuna1} 
            alt="Friren" 
            className="w-16 h-16 object-contain"
          />
        </div>
        
        {/* Security Icon */}
        <div className="relative z-10 bg-gradient-to-br from-red-100 to-orange-100 p-4 rounded-full mb-6 shadow-lg">
          <Lock className="h-12 w-12 text-red-500" />
        </div>
        
        <AlertDialogTitle className="text-3xl font-bold pb-3 text-center text-gray-800 relative z-10">
          🔐 Confirm Password Reset
        </AlertDialogTitle>
        <AlertDialogDescription className="text-center text-gray-600 mb-8 leading-relaxed relative z-10">
          Are you sure you want to reset your password? This action cannot be undone.
        </AlertDialogDescription>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs relative z-10">
          <button
            onClick={() => setDialogState(false)}
            className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={resetFunction}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Reset Password
          </button>
        </div>
        
        <AlertDialogCancel className="absolute right-4 top-4 p-2 border-none bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:rotate-90 transform">
          <X className="h-5 w-5 text-gray-600" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}