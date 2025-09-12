import { useState, useMemo , useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BlogCard from "./BlogCard";
import axios from "axios";

/*import { blogPosts } from "../../data/blogPosts";*/

import type { FilterCategory, BlogPost } from "../../types/blog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("Highlight");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const categories:FilterCategory[] = ["Highlight", "Cat", "Inspiration", "General"];
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory]);

    const fetchPosts = async () => {
    setIsLoading(true); // Set isLoading to true when starting to fetch
      try {
        let response;
        if (selectedCategory === "Highlight") {
          response = await axios.get(
            `https://blog-post-project-api.vercel.app/posts?page=${page}&limit=6`
          );
        } else {
          response = await axios.get(
            `https://blog-post-project-api.vercel.app/posts?page=${page}&limit=6&category=${selectedCategory}`
          );
        }
        setPosts((prevPosts) => page === 1 ? response.data.posts : [...prevPosts, ...response.data.posts]);
        setIsLoading(false); // Set isLoading to false after fetching
        if (response.data.currentPage >= response.data.totalPages) {
          setHasMore(false); // No more posts to load
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false); // Set loading to false in case of error
      }
    }

    const handleLoadMore = () => {
      setPage((prevPage) => prevPage + 1); // Increment page number to load more posts
    };


  return (
    <div className="w-full container mx-auto mb-10">
      <h2 className="text-xl font-bold mb-4 px-4">Latest articles</h2>
      <div className="bg-[var(--brown-200)] px-4 py-4 md:py-3 md:rounded-sm flex flex-col space-y-4 md:flex-row-reverse md:items-center md:space-y-0 md:justify-between shadow-md">
        <div className="w-full md:max-w-sm">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="py-3 bg-white rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
        </div>
        <div className="md:hidden w-full text-[var(--brown-400)]">
            <h2 className="text-sm font-medium mb-2">Category</h2>
          <Select 
           value={selectedCategory}
           onValueChange={(value: FilterCategory) => {
            setSelectedCategory(value);
            setPosts([]); // Clear posts when category changes
            setPage(1); // Reset page to 1
            setHasMore(true); // Reset "has more" state
          }}>

            <SelectTrigger className="w-full py-3 rounded-sm text-muted-foreground bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden md:flex space-x-2">
          {categories.map((category) => (
            <button key={category} 
            onClick={() => {
              setSelectedCategory(category);
              setPosts([]); // Clear posts when category changes
              setPage(1); // Reset page to 1
              setHasMore(true); // Reset "has more" state
            }}
            className={`px-4 py-3 transition-colors rounded-sm text-sm font-medium cursor-pointer 
            ${selectedCategory === category ? 
            "bg-[var(--brown-300)] text-[var(--brown-500)]" : "text-muted-foreground hover:bg-[var(--brown-100)] hover:text-[var(--brown-500)]"}`}
            disabled={selectedCategory === category}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0 mt-10 mb-20">
        {posts.map((post: BlogPost) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        ))}
      </article>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="hover:text-muted-foreground font-medium underline"
          >
            {isLoading ? "Loading..." : "View more"}
          </button>
        </div>
      )}
    </div>
  );
}