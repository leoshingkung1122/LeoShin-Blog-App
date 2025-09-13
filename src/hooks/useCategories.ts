import { useMemo } from "react";
import type { FilterCategory } from "../types/blog";

interface UseCategoriesReturn {
  categories: FilterCategory[];
  getCategoryDisplayName: (category: FilterCategory) => string;
  isValidCategory: (category: string) => category is FilterCategory;
}

export const useCategories = (): UseCategoriesReturn => {
  const categories: FilterCategory[] = useMemo(
    () => ["Highlight", "Cat", "Inspiration", "General"],
    []
  );

  const getCategoryDisplayName = useMemo(
    () => (category: FilterCategory): string => {
      const displayNames: Record<FilterCategory, string> = {
        Highlight: "Highlight",
        Cat: "Cat",
        Inspiration: "Inspiration",
        General: "General",
      };
      return displayNames[category] || category;
    },
    []
  );

  const isValidCategory = useMemo(
    () => (category: string): category is FilterCategory => {
      return categories.includes(category as FilterCategory);
    },
    [categories]
  );

  return {
    categories,
    getCategoryDisplayName,
    isValidCategory,
  };
};
