import { useState, type FormEvent } from "react";
import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication";
import { toast } from "sonner";
import { X, Loader2, User, AtSign, Mail, Lock, Sparkles } from "lucide-react";
import FrirenHappy from "@/assets/FrirenWithBook.png";

interface FormValues {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export default function SignUpPage() {
  const { register, state } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateInputs = (): FormErrors => {
    const errors: FormErrors = {};

    // Validate name
    if (!formValues.name.trim()) {
      errors.name = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formValues.name)) {
      errors.name = "Name must contain only letters and spaces.";
    } else if (formValues.name.length < 3) {
      errors.name = "Name must be at least 3 characters long.";
    }

    // Validate username
    if (!formValues.username.trim()) {
      errors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formValues.username)) {
      errors.username =
        "Username can only contain letters, numbers, dots, underscores, and dashes.";
    } else if (formValues.username.length < 5) {
      errors.username = "Username must be at least 5 characters long.";
    } else if (formValues.username.length > 15) {
      errors.username = "Username cannot exceed 15 characters.";
    }

    // Validate email
    if (!formValues.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Validate password
    if (!formValues.password.trim()) {
      errors.password = "Password is required.";
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formValues.password)) {
      errors.password = "Password must contain letters and numbers.";
    } else if (formValues.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateInputs();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const result = await register(formValues);
      if (result?.error) {
        let suggestionMessage = "";

        // Check for email or username-related issues
        if (result.error.toLowerCase().includes("email")) {
          suggestionMessage = "Try using a different email address.";
        } else if (result.error.toLowerCase().includes("username")) {
          suggestionMessage = "Try using a different username.";
        }

        return toast.custom((t) => (
          <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg mb-1">{result.error}</h2>
              <p className="text-sm">
                {suggestionMessage && (
                  <span className="block mt-2 text-sm">
                    {suggestionMessage}
                  </span>
                )}
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
    }
  };

  const handleChange = (key: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavBar />
      <main className="flex-grow">
        <div className="w-full container mx-auto px-4 pt-16 pb-8 md:pt-20 md:pb-12">
          <div className="w-full max-w-6xl mx-auto relative">
          
          {/* Grid Layout: Frieren + Form */}
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
            
            {/* Frieren Character with Tooltip - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center justify-center relative group">
              {/* Decorative floating sparkles */}
              <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-20 right-14 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-24 left-16 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
              
              {/* Frieren Image */}
              <div className="relative">
                <img 
                  src={FrirenHappy} 
                  alt="Frieren" 
                  className="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-blue-200/20 to-cyan-200/20 blur-3xl -z-10 group-hover:opacity-100 opacity-70 transition-opacity duration-500"></div>
              </div>
              
              {/* Tooltip/Speech Bubble on Hover - Positioned above */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
                <div className="bg-gradient-to-br from-white via-white to-purple-50 rounded-xl shadow-2xl p-4 border-2 border-purple-300 relative backdrop-blur-sm">
                  {/* Speech bubble arrow - pointing down */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-r-2 border-b-2 border-purple-300 transform rotate-45"></div>
                  
                  {/* Content */}
                  <div className="space-y-2 relative z-10">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <p className="text-sm font-bold text-purple-600">
                          Registration Guide ✨
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 italic">
                        "Let me share some wisdom..."
                      </p>
                    </div>
                    <ul className="text-xs text-gray-700 space-y-1 pl-1">
                      <li className="flex items-start gap-1.5">
                        <span className="text-purple-400 mt-0.5 text-sm">•</span>
                        <span><strong>Name:</strong> Real name for verification</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-400 mt-0.5 text-sm">•</span>
                        <span><strong>Username:</strong> Unique & memorable</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-400 mt-0.5 text-sm">•</span>
                        <span><strong>Email:</strong> Valid for confirmation</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-purple-400 mt-0.5 text-sm">•</span>
                        <span><strong>Password:</strong> Min 8 chars, mixed case</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-pink-400 mt-0.5 text-sm">•</span>
                        <span><strong>Security:</strong> Keep it safe!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          
          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 border border-gray-100 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-transparent"></div>
            </div>
            
            {/* Header with icon */}
            <div className="relative z-10 text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-full mb-3 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm">Join our community today</p>
            </div>
            
            <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            <div className="relative space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                    formErrors.name 
                      ? "border-red-500 focus:border-red-600" 
                      : "border-gray-200 focus:border-gray-800 hover:border-gray-300"
                  } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`}
                  disabled={state.loading}
                />
              </div>
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {formErrors.name}
                </p>
              )}
            </div>
            <div className="relative space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="johndoe123"
                  value={formValues.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={`pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                    formErrors.username 
                      ? "border-red-500 focus:border-red-600" 
                      : "border-gray-200 focus:border-gray-800 hover:border-gray-300"
                  } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`}
                  disabled={state.loading}
                />
              </div>
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {formErrors.username}
                </p>
              )}
            </div>
            <div className="relative space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formValues.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                    formErrors.email 
                      ? "border-red-500 focus:border-red-600" 
                      : "border-gray-200 focus:border-gray-800 hover:border-gray-300"
                  } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`}
                  disabled={state.loading}
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {formErrors.email}
                </p>
              )}
            </div>
            <div className="relative space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formValues.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                    formErrors.password 
                      ? "border-red-500 focus:border-red-600" 
                      : "border-gray-200 focus:border-gray-800 hover:border-gray-300"
                  } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`}
                  disabled={state.loading}
                />
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {formErrors.password}
                </p>
              )}
            </div>
            <div className="flex justify-center pt-1">
              <button
                type="submit"
                className="group w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white rounded-full hover:from-gray-900 hover:via-gray-800 hover:to-black transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                disabled={state.loading}
              >
                {state.loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Divider */}
          <div className="relative z-10 flex items-center gap-3 w-full my-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
          
          {/* Login link */}
          <p className="relative z-10 flex flex-row justify-center items-center gap-2 text-sm text-center text-gray-600 font-medium">
            <span>Already have an account?</span>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-800 hover:text-gray-600 transition-colors underline decoration-2 underline-offset-2 font-bold"
            >
              Log in
            </button>
          </p>
          </div>
          
          </div> {/* End Grid Layout */}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}