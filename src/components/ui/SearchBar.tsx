import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { BlogPost } from "@/types/blog";
import CategoryBadge from "./CategoryBadge";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  className?: string;
  showDropdown?: boolean;
  selectedCategory?: string;
}

export default function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search",
  className = "",
  showDropdown = true,
  selectedCategory
}: SearchBarProps) {
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [showDropdownState, setShowDropdownState] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdownState(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Search posts when keyword changes
  useEffect(() => {
    if (!showDropdown) return;
    
    const searchPosts = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setShowDropdownState(false);
        return;
      }

      setShowDropdownState(true);

      try {
        const params: Record<string, string | number> = {
          keyword: searchTerm,
          limit: 6,
        };

        // Add category filter if selected and not empty
        if (selectedCategory && selectedCategory.trim() !== "") {
          params.category = selectedCategory;
        }

        const response = await axios.get(
          `https://leoshin-blog-app-api-with-db.vercel.app/posts`,
          { params }
        );
        
        // Transform posts to include category name as string
        const transformedPosts = (response.data.posts || []).map((post: any) => ({
          ...post,
          category: post.categories?.name || "Uncategorized"
        }));
        
        setSearchResults(transformedPosts);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchPosts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, showDropdown, selectedCategory]);

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
    setShowDropdownState(false);
    onSearchChange("");
  };

  const handleClearSearch = () => {
    onSearchChange("");
    setSearchResults([]);
    setShowDropdownState(false);
  };

  return (
    <div className={`w-full md:max-w-sm ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => showDropdown && searchTerm && setShowDropdownState(true)}
          placeholder={placeholder}
          className="py-3 pl-10 pr-10 bg-white rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown Results */}
        {showDropdown && showDropdownState && searchTerm && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[400px] overflow-y-auto z-50">
            {searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                  >
                    <h4 className="font-medium text-gray-800 line-clamp-1 mb-1">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CategoryBadge 
                        category={post.category} 
                        categoryId={post.category_id}
                        size="sm"
                      />
                      <span className="text-xs text-gray-400">
                        {new Date(post.published_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No results found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
