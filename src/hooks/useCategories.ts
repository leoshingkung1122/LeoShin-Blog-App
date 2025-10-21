import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import type { FilterCategory } from "../types/blog";

interface Category {
  id: number;
  name: string;
}

interface UseCategoriesReturn {
  categories: FilterCategory[];
  getCategoryDisplayName: (category: FilterCategory) => string;
  isValidCategory: (category: string) => category is FilterCategory;
  isLoading: boolean;
  error: string | null;
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
          setApiCategories(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
        // No fallback categories - let the UI handle empty state
        setApiCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categories: FilterCategory[] = useMemo(
    () => apiCategories.map(cat => cat.name as FilterCategory),
    [apiCategories]
  );

  const getCategoryDisplayName = useMemo(
    () => (category: FilterCategory): string => {
      return category;
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
    isLoading,
    error,
  };
};
