import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import LoadingSkeleton from "./LoadingSkeleton";
import LoadMoreButton from "./LoadMoreButton";
import { useBlogPosts, useCategories } from "../../hooks";
import type { BlogPost } from "../../types/blog";


export default function Articles() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Get categories first
  const { categories, categoriesWithColors, error: categoriesError } = useCategories();
  
  // Use custom hooks with first category as default (only when categories are loaded)
  const {
    posts,
    isLoading,
    hasMore,
    selectedCategory,
    searchKeyword,
    error,
    setSelectedCategory,
    setSearchKeyword,
    loadMore,
  } = useBlogPosts(""); // Always start with empty string to show all posts

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, setSearchKeyword]);

  return (
    <div className="w-full container mx-auto mb-10">
      <h2 className="text-xl font-bold mb-4 px-4">Latest articles</h2>
      
      {/* Header with Search and Category Filter */}
      <div className="bg-[var(--brown-200)] px-4 py-4 md:py-3 md:rounded-sm flex flex-col space-y-4 md:flex-row-reverse md:items-center md:space-y-0 md:justify-between shadow-md">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search articles..."
          selectedCategory={selectedCategory}
        />
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      {/* Error Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p>Error loading articles: {error}</p>
        </div>
      )}
      {categoriesError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
          <p>Error loading categories: {categoriesError}</p>
        </div>
      )}
      {/* Articles Grid */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0 mt-10 mb-20">
        {posts.map((post: BlogPost) => {
          // Find the category by original category_id to get newId
          const categoryDetails = categoriesWithColors.find(cat => cat.id === post.category_id);
          const categoryNewId = categoryDetails?.newId;
          
          return (
            <BlogCard
              key={post.id}
              id={post.id}
              image={post.image}
              category={post.category}
              categoryId={categoryNewId}
              title={post.title}
              description={post.description}
              author={post.author || "Unknown"}
              authorUsername={post.authorUsername}
              authorProfilePic={post.authorProfilePic}
              authorIntroduction={post.authorIntroduction}
              date={new Date(post.published_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          );
        })}
        
        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton count={6} />}
        
        {/* No Results Message */}
        {!isLoading && posts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchKeyword ? "No articles found matching your search." : "No articles available."}
            </p>
          </div>
        )}
      </article>

      {/* Load More Button */}
      <LoadMoreButton
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        buttonText="View more articles"
        loadingText="Loading"
      />
    </div>
  );
}