import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { FilterCategory, BlogPost } from "../types/blog";

interface UseBlogPostsReturn {
  posts: BlogPost[];
  isLoading: boolean;
  hasMore: boolean;
  selectedCategory: FilterCategory;
  error: string | null;
  setSelectedCategory: (category: FilterCategory) => void;
  loadMore: () => void;
  resetPosts: () => void;
}

export const useBlogPosts = (): UseBlogPostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("Highlight");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (currentPage: number, category: FilterCategory, isNewCategory = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      const baseUrl = "https://blog-post-project-api.vercel.app/posts";
      const params = `page=${currentPage}&limit=6${category !== "Highlight" ? `&category=${category}` : ""}`;
      
      response = await axios.get(`${baseUrl}?${params}`);
      
      setPosts((prevPosts) => 
        isNewCategory || currentPage === 1 
          ? response.data.posts 
          : [...prevPosts, ...response.data.posts]
      );
      
      if (response.data.currentPage >= response.data.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch posts when page or category changes
  useEffect(() => {
    fetchPosts(page, selectedCategory, page === 1);
  }, [page, selectedCategory, fetchPosts]);

  const handleCategoryChange = useCallback((category: FilterCategory) => {
    setSelectedCategory(category);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const resetPosts = useCallback(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    posts,
    isLoading,
    hasMore,
    selectedCategory,
    error,
    setSelectedCategory: handleCategoryChange,
    loadMore,
    resetPosts,
  };
};
