import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavBar />
      <main className="flex-grow">
        <div className="w-full container mx-auto px-4 py-16 md:py-24">
          <div className="w-full max-w-2xl mx-auto relative">
          
          {/* Main content card */}
          <div className="flex flex-col space-y-8 items-center w-full bg-white rounded-2xl shadow-2xl px-6 sm:px-20 py-16 relative overflow-hidden border border-gray-100">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -z-10 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full blur-3xl opacity-30 -z-10 pointer-events-none" />
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-transparent"></div>
            </div>
            
            {/* 404 Large Number */}
            <div className="relative z-10">
              <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 animate-pulse">
                404
              </h1>
            </div>
            
            {/* Icon with animation */}
            <div className="relative z-10">
              <div className="h-24 w-24 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300 animate-bounce">
                <AlertCircle className="h-14 w-14 text-white" strokeWidth={2.5} />
              </div>
            </div>
            
            {/* Text content */}
            <div className="text-center space-y-4 relative z-10 max-w-md">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Oops! Page Not Found
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track!
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-full hover:border-gray-800 hover:bg-gray-50 transition-all duration-300 font-semibold shadow-md"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Go Back
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white rounded-full hover:from-gray-900 hover:via-gray-800 hover:to-black transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
