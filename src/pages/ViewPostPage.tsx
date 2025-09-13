import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import ViewPost from "@/components/ui/ViewPost";

export default function ViewPostPage() {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow">
          <ViewPost />
        </div>
        <Footer />
      </div>
    );
  }