import NavBar from "@/components/ui/navbar";
import HeroSection from "@/components/ui/heroSection";
import ArticlesSection from "@/components/ui/ArticlesSection";
import Footer from "@/components/ui/footer";

export default function HomePage() {
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