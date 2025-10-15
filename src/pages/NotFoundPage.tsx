import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Home, ArrowLeft, Sparkles, Heart, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendBook from "@/assets/FrirenWithBook.png";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <NavBar />
      <main className="flex-1 flex items-center justify-center py-4 sm:py-6">
        <div className="w-full container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="w-full max-w-5xl mx-auto relative">
          
          {/* Main content card */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl px-6 sm:px-10 md:px-12 lg:px-14 py-8 sm:py-10 md:py-12 relative overflow-hidden border-2 border-slate-200">
            {/* Sparkle decorations - hidden on mobile for cleaner look */}
            <div className="hidden sm:block absolute top-4 sm:top-6 left-4 sm:left-6 animate-pulse" style={{ animationDelay: '0s' }}>
              <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-blue-300" />
            </div>
            <div className="hidden sm:block absolute top-6 sm:top-10 right-6 sm:right-8 animate-pulse" style={{ animationDelay: '0.3s' }}>
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-300" />
            </div>
            <div className="hidden md:block absolute bottom-8 md:bottom-10 left-8 md:left-10 animate-pulse" style={{ animationDelay: '0.6s' }}>
              <BookOpen className="w-4 md:w-5 h-4 md:h-5 text-amber-400" />
            </div>
            <div className="hidden sm:block absolute bottom-10 sm:bottom-14 right-4 sm:right-6 animate-pulse" style={{ animationDelay: '0.9s' }}>
              <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-pink-300 fill-pink-300" />
            </div>
            
            {/* Soft gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-blue-50/50 to-cyan-50/50 opacity-60"></div>
            
            {/* Frieren Character Image */}
            <div className="relative z-10 flex items-center justify-center order-2 md:order-1 mb-4 md:mb-0">
              <div className="relative">
                <img 
                  src={FriendBook} 
                  alt="Frieren with Book" 
                  className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
                {/* Glow effect behind character */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/30 via-blue-200/30 to-purple-200/30 blur-3xl -z-10"></div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="flex flex-col items-center md:items-start space-y-3 sm:space-y-4 md:space-y-5 relative z-10 order-1 md:order-2">
              {/* 404 Number */}
              <div className="relative">
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-cyan-400 to-blue-400 drop-shadow-lg">
                  404
                </h1>
              </div>
              
              {/* Text content */}
              <div className="text-center md:text-left space-y-1.5 sm:space-y-2 max-w-md">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-600 to-cyan-600 bg-clip-text text-transparent">
                  あれれ～？ (・・？)
                </h2>
                <p className="text-lg sm:text-xl font-semibold text-gray-700">
                  Page Not Found~
                </p>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-4 md:px-0">
                  このページは魔法の本の中にないみたい...
                  <br/>
                  <span className="text-cyan-600">Let me guide you back home! ✨</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 italic flex items-center justify-center md:justify-start gap-1.5 px-4 md:px-0">
                  <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  <span>(This page isn't in my book of knowledge~)</span>
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto pt-1 sm:pt-2 px-4 sm:px-0">
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-slate-100 to-cyan-100 text-slate-700 border-2 border-slate-300 rounded-full hover:from-slate-200 hover:to-cyan-200 hover:border-cyan-400 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>戻る (Go Back)</span>
                </button>
                
                <button
                  onClick={() => navigate("/")}
                  className="group flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-slate-600 text-white rounded-full hover:from-cyan-600 hover:via-blue-600 hover:to-slate-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 text-xs sm:text-sm"
                >
                  <Home className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  <span>ホームへ ✨ (Back Home)</span>
                </button>
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

