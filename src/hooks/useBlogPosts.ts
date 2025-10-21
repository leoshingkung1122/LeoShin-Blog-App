import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { FilterCategory, BlogPost } from "../types/blog";

interface UseBlogPostsReturn {
  posts: BlogPost[];
  isLoading: boolean;
  hasMore: boolean;
  selectedCategory: FilterCategory;
  searchKeyword: string;
  error: string | null;
  setSelectedCategory: (category: FilterCategory) => void;
  setSearchKeyword: (keyword: string) => void;
  loadMore: () => void;
  resetPosts: () => void;
}

export const useBlogPosts = (): UseBlogPostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("Highlight");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (currentPage: number, category: FilterCategory, keyword: string, isNewCategory = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      const baseUrl = "https://leoshin-blog-app-api-with-db.vercel.app/posts";
      let params = `page=${currentPage}&limit=6`;
      
      // Add keyword if searching
      if (keyword.trim() !== "") {
        params += `&keyword=${encodeURIComponent(keyword)}`;
      }  
      
      if (category !== "Highlight") {
        // Only add category filter if not searching
        params += `&category=${category}`;
      }
      
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

  // Fetch posts when page, category, or search keyword changes
  useEffect(() => {
    fetchPosts(page, selectedCategory, searchKeyword, page === 1);
  }, [page, selectedCategory, searchKeyword, fetchPosts]);

  const handleCategoryChange = useCallback((category: FilterCategory) => {
    setSelectedCategory(category);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  const handleSearchKeywordChange = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
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
    searchKeyword,
    error,
    setSelectedCategory: handleCategoryChange,
    setSearchKeyword: handleSearchKeywordChange,
    loadMore,
    resetPosts,
  };
};
