import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BlogCard from "./BlogCard";
import { blogPosts } from "../../data/blogPosts";
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

  const categories:FilterCategory[] = ["Highlight", "Cat", "Inspiration", "General"];

  
  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "Highlight") {
      // Show posts with highest likes (highlight posts)
      return blogPosts;
    }
    return blogPosts.filter((post: BlogPost) => post.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

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
          <Select value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value as FilterCategory)}>
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
            <button key={category} onClick={() => setSelectedCategory(category)} 
            className={`px-4 py-3 transition-colors rounded-sm text-sm font-medium cursor-pointer 
            ${selectedCategory === category ? 
            "bg-[var(--brown-300)] text-[var(--brown-500)]" : "text-muted-foreground hover:bg-[var(--brown-300)] hover:text-[var(--brown-500)]"}`}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0 mt-10 mb-20">
        {filteredPosts.map((post: BlogPost) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </article>
    </div>
  );
}