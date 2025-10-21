// Badge color mapping based on category ID (1-6)
export interface BadgeColors {
  light: string;
  dark: string;
}

export const CATEGORY_COLOR_MAPPING: Record<number, BadgeColors> = {
  1: { light: "#F3F4F6", dark: "#6B7280" }, // Gray
  2: { light: "#FEE2E2", dark: "#EF4444" }, // Red
  3: { light: "#DBEAFE", dark: "#3B82F6" }, // Blue
  4: { light: "#D1FAE5", dark: "#10B981" }, // Green
  5: { light: "#FEF3C7", dark: "#F59E0B" }, // Yellow
  6: { light: "#EDE9FE", dark: "#8B5CF6" }, // Purple
};

/**
 * Get badge colors for a given category ID
 * @param categoryId - The category ID (1-6)
 * @returns BadgeColors object with light and dark variants
 */
export const getBadgeColors = (categoryId: number): BadgeColors => {
  return CATEGORY_COLOR_MAPPING[categoryId] || CATEGORY_COLOR_MAPPING[1];
};

/**
 * Get badge colors with fallback for undefined categoryId
 * @param categoryId - The category ID (1-6) or undefined
 * @returns BadgeColors object with light and dark variants
 */
export const getBadgeColorsSafe = (categoryId?: number | null): BadgeColors => {
  return categoryId ? getBadgeColors(categoryId) : CATEGORY_COLOR_MAPPING[1];
};
