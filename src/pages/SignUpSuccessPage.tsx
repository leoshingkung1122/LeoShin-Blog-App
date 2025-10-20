import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function SignUpSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <NavBar />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-green-100">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white animate-bounce" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Account Created Successfully!
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 mb-6">
              Welcome to LeoShin Blog! Your account has been created and you can now log in to start exploring.
            </p>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-700">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Registration completed successfully
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:from-gray-900 hover:via-gray-800 hover:to-black transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Continue to Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full text-gray-600 hover:text-gray-800 py-2 px-6 rounded-full font-medium transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>

            {/* Auto redirect notice */}
            <p className="text-xs text-gray-400 mt-4">
              You will be automatically redirected to login in 5 seconds...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
