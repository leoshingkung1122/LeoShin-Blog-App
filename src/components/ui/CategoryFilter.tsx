import type { FilterCategory } from "../../types/blog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  categories: FilterCategory[];
  selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className = ""
}: CategoryFilterProps) {
  return (
    <>
      {/* Mobile Category Filter */}
      <div className={`lg:hidden w-full text-[var(--brown-400)] ${className}`}>
        
        <Select 
          value={selectedCategory}
          onValueChange={(value: FilterCategory) => onCategoryChange(value)}
        >
          <SelectTrigger className="w-full py-3 rounded-sm text-muted-foreground bg-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Category Filter */}
      <div className={`hidden lg:flex space-x-2 ${className}`}>
        {categories.map((category) => (
          <button 
            key={category} 
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-3 transition-colors rounded-sm text-sm font-medium cursor-pointer
              ${selectedCategory === category ? 
                "bg-[var(--brown-300)] text-[var(--brown-500)]" : 
                "text-muted-foreground hover:bg-[var(--brown-100)] hover:text-[var(--brown-500)]"
              }`}
            disabled={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );
}
