import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import type { FilterCategory, Category } from "../types/blog";
import { getBadgeColors } from "../utils/badgeColors";

interface UseCategoriesReturn {
  categories: FilterCategory[];
  categoriesWithColors: Category[];
  getCategoryDisplayName: (category: FilterCategory) => string;
  getCategoryColor: (categoryId: number) => string;
  isValidCategory: (category: string) => category is FilterCategory;
  isLoading: boolean;
  error: string | null;
  categoryCount: number;
}

export const useCategories = (): UseCategoriesReturn => {
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          "https://leoshin-blog-app-api-with-db.vercel.app/categories"
        );
        
        if (response.data.success && response.data.data) {
          // Add colors based on new ID starting from 1
          const categoriesWithColors = response.data.data.map(
            (apiCat: { id: number; name: string }, index: number) => {
              const newId = index + 1; // Start from 1, 2, 3, 4, 5, 6...
              return {
                id: apiCat.id, // Keep original id for reference
                newId: newId, // New sequential ID
                name: apiCat.name,
                color: getBadgeColors(newId).dark,
              };
            }
          );

          setApiCategories(categoriesWithColors);
        } else {
          setApiCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
        setApiCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categories: FilterCategory[] = useMemo(
    () => {
      const allCategories = ["All", ...apiCategories.map(cat => cat.name as FilterCategory)];
      return Array.from(new Set(allCategories)); // Remove duplicates
    },
    [apiCategories]
  );

  const categoriesWithColors: Category[] = useMemo(
    () => apiCategories,
    [apiCategories]
  );

  const categoryCount = useMemo(
    () => apiCategories.length,
    [apiCategories]
  );

  const getCategoryDisplayName = useMemo(
    () => (category: FilterCategory): string => {
      return category;
    },
    []
  );

  const getCategoryColor = useMemo(
    () => (categoryId: number): string => {
      return getBadgeColors(categoryId).dark;
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
    categoriesWithColors,
    getCategoryDisplayName,
    getCategoryColor,
    isValidCategory,
    isLoading,
    error,
    categoryCount,
  };
};
