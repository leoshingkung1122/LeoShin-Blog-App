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
        
        {/* Loading Skeleton */}
        {isLoading && (
          <>
            {Array.from({ length: 6 }, (_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse">
                <div className="bg-[var(--brown-200)] rounded-lg overflow-hidden shadow-sm">
                  <div className="h-48 bg-[var(--brown-300)]"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[var(--brown-300)] rounded w-20"></div>
                    <div className="h-6 bg-[var(--brown-300)] rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-[var(--brown-300)] rounded"></div>
                      <div className="h-4 bg-[var(--brown-300)] rounded w-3/4"></div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <div className="h-4 bg-[var(--brown-300)] rounded w-16"></div>
                      <div className="h-4 bg-[var(--brown-300)] rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </article>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="group relative overflow-hidden bg-[var(--brown-600)] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-[var(--brown-500)] hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              View more articles
            </span>
            
            {/* Loading Animation */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">Loading</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--orange)] to-[var(--green)] opacity-0 group-hover:opacity-10 transition-opacity duration-300 cursor-pointer"></div>
          </button>
        </div>
      )}
    </div>
  );
}