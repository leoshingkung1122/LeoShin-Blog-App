import { useState, type FormEvent } from "react";
import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication";
import { toast } from "sonner";
import { X, Loader2, User, AtSign, Mail, Lock, Sparkles } from "lucide-react";

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
        <div className="w-full container mx-auto px-4 py-8 md:py-12">
          <div className="w-full max-w-2xl mx-auto relative">
          
          
          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-2xl px-6 sm:px-12 py-12 border border-gray-100 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-transparent"></div>
            </div>
            
            {/* Header with icon */}
            <div className="relative z-10 text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-full mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm">Join our community today</p>
            </div>
            
            <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
            <div className="relative space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`pl-11 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
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
            <div className="relative space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  placeholder="johndoe123"
                  value={formValues.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={`pl-11 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
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
            <div className="relative space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formValues.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`pl-11 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
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
            <div className="relative space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formValues.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`pl-11 pr-4 py-3 rounded-lg border-2 transition-all duration-200 ${
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
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="group w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white rounded-full hover:from-gray-900 hover:via-gray-800 hover:to-black transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={state.loading}
              >
                {state.loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Divider */}
          <div className="relative z-10 flex items-center gap-4 w-full my-6">
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
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}