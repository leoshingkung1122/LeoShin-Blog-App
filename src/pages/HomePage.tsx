import NavBar from "@/components/ui/navbar";
import HeroSection from "@/components/ui/heroSection";
import ArticlesSection from "@/components/ui/ArticlesSection";
import Footer from "@/components/ui/footer";
import LoadingToast from "@/components/ui/LoadingToast";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingToast size="extra-large" text="Loading" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow">
        <HeroSection />
        <ArticlesSection />
      </div>
      <Footer />
    </div>
  );
}