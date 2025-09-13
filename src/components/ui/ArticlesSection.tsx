import { useState } from "react";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import LoadingSkeleton from "./LoadingSkeleton";
import LoadMoreButton from "./LoadMoreButton";
import { useBlogPosts, useCategories } from "../../hooks";
import type { BlogPost } from "../../types/blog";

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Use custom hooks
  const {
    posts,
    isLoading,
    hasMore,
    selectedCategory,
    error,
    setSelectedCategory,
    loadMore,
  } = useBlogPosts();
  
  const { categories } = useCategories();


  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full container mx-auto mb-10">
      <h2 className="text-xl font-bold mb-4 px-4">Latest articles</h2>
      
      {/* Header with Search and Category Filter */}
      <div className="bg-[var(--brown-200)] px-4 py-4 md:py-3 md:rounded-sm flex flex-col space-y-4 md:flex-row-reverse md:items-center md:space-y-0 md:justify-between shadow-md">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search articles..."
        />
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p>Error loading articles: {error}</p>
        </div>
      )}
      {/* Articles Grid */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0 mt-10 mb-20">
        {filteredPosts.map((post: BlogPost) => (
          <BlogCard
            key={post.id}
            id={post.id}
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
        {isLoading && <LoadingSkeleton count={6} />}
        
        {/* No Results Message */}
        {!isLoading && filteredPosts.length === 0 && posts.length > 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No articles found matching your search.</p>
          </div>
        )}
        
        {/* No Posts Message */}
        {!isLoading && posts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No articles available.</p>
          </div>
        )}
      </article>

      {/* Load More Button */}
      <LoadMoreButton
        isLoading={isLoading}
        hasMore={hasMore && searchTerm === ""}
        onLoadMore={loadMore}
        buttonText="View more articles"
        loadingText="Loading"
      />
    </div>
  );
}