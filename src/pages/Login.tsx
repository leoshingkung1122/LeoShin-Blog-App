import { useState, type FormEvent } from "react";
import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication";
import { toast } from "sonner";
import {
  X,
  Loader2,
  Mail,
  Lock,
  LogIn,
  Sparkles,
  Zap,
  Star,
  Heart,
} from "lucide-react";
import Leo2 from "@/assets/Leo2.png";

interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { login, state } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Validate inputs
  const validateInputs = (): FormErrors => {
    const errors: FormErrors = {};

    // Validate email
    if (!formValues.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Validate password
    if (!formValues.password.trim()) {
      errors.password = "Password is required.";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateInputs();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const result = await login(formValues);
      if (result?.error) {
        // ตรวจสอบว่าเป็น error จากการแบนหรือไม่
        if (result.error === "You have been banned by admin") {
          return toast.custom((t) => (
            <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg mb-1">Account Banned</h2>
                <p className="text-sm">You have been banned by admin</p>
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
        
        // Error อื่นๆ
        return toast.custom((t) => (
          <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg mb-1">{result.error}</h2>
              <p className="text-sm">Please try another password or email</p>
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
      navigate("/");
    }
  };

  // Handle input change
  const handleChange = (key: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <NavBar />
      <main className="flex-grow">
        <div className="w-full container mx-auto px-4 pt-16 pb-8 md:pt-20 md:pb-12">
          <div className="w-full max-w-6xl mx-auto relative">
            {/* Grid Layout: Form + Frieren */}
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-center">
              {/* Main card - Form */}
              <div className="relative bg-white rounded-2xl shadow-xl px-6 sm:px-8 py-8 border border-gray-200 overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-transparent"></div>
                </div>

                {/* Minimal decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-30 -z-10 pointer-events-none animate-pulse" />
                <div
                  className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full blur-3xl opacity-30 -z-10 pointer-events-none animate-pulse"
                  style={{ animationDelay: "1s" }}
                />

                {/* Header with clean design */}
                <div className="relative z-10 text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full mb-4 shadow-lg relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <LogIn className="w-8 h-8 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Sign in to your account
                  </p>
                </div>

                <form
                  className="space-y-4 relative z-10"
                  onSubmit={handleSubmit}
                >
                  <div className="relative space-y-2 group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-gray-600" />
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors duration-200 group-focus-within:text-gray-600" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formValues.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`pl-10 pr-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                          formErrors.email
                            ? "border-red-500 focus:border-red-600 shadow-red-100"
                            : "border-gray-300 focus:border-gray-600 hover:border-gray-400 focus:shadow-lg focus:shadow-gray-100"
                        } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white`}
                        disabled={state.loading}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-shake">
                        <X className="w-3 h-3" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative space-y-2 group">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-gray-600" />
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors duration-200 group-focus-within:text-gray-600" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formValues.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        className={`pl-10 pr-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                          formErrors.password
                            ? "border-red-500 focus:border-red-600 shadow-red-100"
                            : "border-gray-300 focus:border-gray-600 hover:border-gray-400 focus:shadow-lg focus:shadow-gray-100"
                        } placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white`}
                        disabled={state.loading}
                      />
                    </div>
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-shake">
                        <X className="w-3 h-3" />
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="group relative w-full sm:w-auto px-10 py-3 bg-black text-white rounded-full transition-all duration-300 font-bold shadow-2xl hover:shadow-cyan-500/50 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm overflow-hidden
                    before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:bg-gradient-to-r before:from-teal-400 before:via-emerald-400 before:to-blue-400 before:w-0 before:transition-all before:duration-700 before:ease-out hover:before:w-full before:rounded-full
                    after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-white/0 after:via-white/20 after:to-white/0 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-1000"
                      disabled={state.loading}
                    >
                      {state.loading ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4 relative z-10" />
                          <span className="relative z-10">Logging in...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                          <span className="relative z-10">Log In</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="relative z-10 flex items-center gap-4 w-full my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      or
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Sign up link */}
                <div className="relative z-10 text-center">
                  <p className="flex flex-row justify-center items-center gap-2 text-sm text-gray-600 font-medium mb-2">
                    <span>Don&apos;t have an account?</span>
                  </p>
                  <button
                    onClick={() => navigate("/SignUp")}
                    className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-300 font-bold border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200/50 transform hover:-translate-y-0.5"
                  >
                    <span>Create Account</span>
                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Character - Hidden on mobile/tablet */}
              <div className="hidden lg:flex items-center justify-center relative group">
                {/* Water/Ocean Theme Effects */}

                {/* Water Droplets - Falling */}
                <div className="absolute top-10 left-16 w-2 h-2 bg-blue-400/80 rounded-full shadow-lg shadow-blue-400/50 animate-droplet-1"></div>
                <div className="absolute top-20 right-20 w-2.5 h-2.5 bg-cyan-400/70 rounded-full shadow-lg shadow-cyan-400/50 animate-droplet-2"></div>
                <div className="absolute bottom-16 left-12 w-2 h-2 bg-teal-400/90 rounded-full shadow-lg shadow-teal-400/50 animate-droplet-3"></div>
                <div
                  className="absolute bottom-24 right-16 w-1.5 h-1.5 bg-blue-300/80 rounded-full shadow-md shadow-blue-300/40 animate-droplet-1"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-32 left-24 w-1.5 h-1.5 bg-cyan-300/70 rounded-full shadow-md shadow-cyan-300/40 animate-droplet-2"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="absolute top-12 right-12 w-2 h-2 bg-teal-300/85 rounded-full shadow-lg shadow-teal-300/50 animate-droplet-3"
                  style={{ animationDelay: "0.8s" }}
                ></div>

                {/* Character Image with Water Effects */}
                <div className="relative z-10">
                  {/* Water Glow Base */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-cyan-400/30 to-teal-400/30 blur-3xl animate-pulse-slow"></div>

                  {/* Ripple Waves on Hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-400/50 animate-ripple"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-400/40 animate-ripple-delayed"></div>
                  </div>

                  {/* Floating Bubbles - Around Character */}
                  <div className="absolute top-24 right-16 w-4 h-4 rounded-full border-2 border-blue-300/60 opacity-70 animate-bubble-1 shadow-inner"></div>
                  <div className="absolute bottom-28 left-20 w-5 h-5 rounded-full border-2 border-cyan-300/50 opacity-60 animate-bubble-2 shadow-inner"></div>
                  <div className="absolute top-40 left-12 w-3 h-3 rounded-full border-2 border-teal-300/70 opacity-80 animate-bubble-3 shadow-inner"></div>
                  <div
                    className="absolute top-56 right-24 w-3.5 h-3.5 rounded-full border-2 border-blue-300/55 opacity-65 animate-bubble-1 shadow-inner"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute bottom-40 right-12 w-4 h-4 rounded-full border-2 border-cyan-300/60 opacity-70 animate-bubble-2 shadow-inner"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                  <div
                    className="absolute top-32 left-24 w-2.5 h-2.5 rounded-full border-2 border-teal-300/65 opacity-75 animate-bubble-3 shadow-inner"
                    style={{ animationDelay: "0.7s" }}
                  ></div>

                  {/* Small Particles - Water Dust */}
                  <div
                    className="absolute top-28 right-32 w-1 h-1 bg-blue-200/60 rounded-full animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="absolute bottom-32 left-28 w-1 h-1 bg-cyan-200/50 rounded-full animate-pulse"
                    style={{ animationDelay: "0.9s" }}
                  ></div>
                  <div
                    className="absolute top-48 left-32 w-1 h-1 bg-teal-200/70 rounded-full animate-pulse"
                    style={{ animationDelay: "1.2s" }}
                  ></div>

                  <img
                    src={Leo2}
                    alt="Tang San - Water Master"
                    className="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 relative z-10"
                  />
                </div>

                {/* Tooltip/Speech Bubble on Hover - Enhanced */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-80 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 pointer-events-none z-50">
                  <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-2xl shadow-2xl p-5 border-2 border-blue-400 relative backdrop-blur-sm">
                    {/* Speech bubble arrow - pointing down */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-white to-blue-50 border-r-2 border-b-2 border-blue-400 transform rotate-45"></div>

                    {/* Content */}
                    <div className="space-y-3 relative z-10">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 mb-1.5 px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Welcome Back! ⚡
                          </p>
                          <Sparkles className="w-4 h-4 text-cyan-600" />
                        </div>
                        <p className="text-xs text-gray-600 italic font-medium mt-1">
                          "Your journey continues..."
                        </p>
                      </div>
                      <ul className="text-xs text-gray-700 space-y-2 pl-1">
                        <li className="flex items-start gap-2 bg-blue-50/50 p-2 rounded-lg">
                          <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong className="text-blue-600">
                              Lightning Fast:
                            </strong>{" "}
                            Instant access
                          </span>
                        </li>
                        <li className="flex items-start gap-2 bg-cyan-50/50 p-2 rounded-lg">
                          <Star className="w-4 h-4 text-cyan-500 fill-cyan-500 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong className="text-cyan-600">Premium:</strong>{" "}
                            Best experience
                          </span>
                        </li>
                        <li className="flex items-start gap-2 bg-teal-50/50 p-2 rounded-lg">
                          <Heart className="w-4 h-4 text-teal-500 fill-teal-500 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong className="text-teal-600">Safe:</strong>{" "}
                            Protected & encrypted
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* End Grid Layout */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
