// Badge color mapping based on category ID (1-6)
export interface BadgeColors {
  light: string;
  dark: string;
}

// Avatar color mapping for user avatars
export interface AvatarColors {
  background: string;
  text: string;
}

export const CATEGORY_COLOR_MAPPING: Record<number, BadgeColors> = {
  1: { light: "#FEE2E2", dark: "#EF4444" }, // Red
  2: { light: "#FEE2E2", dark: "#EF4444" }, // blue
  3: { light: "#EDE9FE", dark: "#8B5CF6" }, // Purple
  4: { light: "#E0E7FF", dark: "#6366F1" }, // Indigo
  5: { light: "#CCFBF1", dark: "#2DD4BF" }, // Teal 
  6: { light: "#FFEDD5", dark: "#F97316" }, // Orange
};

// Avatar color palette - using similar colors to category badges
export const AVATAR_COLOR_MAPPING: AvatarColors[] = [
  { background: "bg-gradient-to-br from-red-400 to-red-600", text: "text-white" }, // Red
  { background: "bg-gradient-to-br from-blue-400 to-blue-600", text: "text-white" }, // Blue
  { background: "bg-gradient-to-br from-green-400 to-green-600", text: "text-white" }, // Green
  { background: "bg-gradient-to-br from-yellow-400 to-yellow-600", text: "text-white" }, // Yellow
  { background: "bg-gradient-to-br from-purple-400 to-purple-600", text: "text-white" }, // Purple
  { background: "bg-gradient-to-br from-pink-400 to-pink-600", text: "text-white" }, // Pink
  { background: "bg-gradient-to-br from-indigo-400 to-indigo-600", text: "text-white" }, // Indigo
  { background: "bg-gradient-to-br from-teal-400 to-teal-600", text: "text-white" }, // Teal
  { background: "bg-gradient-to-br from-orange-400 to-orange-600", text: "text-white" }, // Orange
  { background: "bg-gradient-to-br from-cyan-400 to-cyan-600", text: "text-white" }, // Cyan
  { background: "bg-gradient-to-br from-emerald-400 to-emerald-600", text: "text-white" }, // Emerald
  { background: "bg-gradient-to-br from-violet-400 to-violet-600", text: "text-white" }, // Violet
];

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

/**
 * Get avatar colors for a given name
 * @param name - The user's name
 * @returns AvatarColors object with background and text classes
 */
export const getAvatarColors = (name: string): AvatarColors => {
  const colorIndex = name.charCodeAt(0) % AVATAR_COLOR_MAPPING.length;
  return AVATAR_COLOR_MAPPING[colorIndex];
};

/**
 * Generate avatar component props for a given name
 * @param name - The user's name
 * @returns Object with first letter and color classes
 */
export const generateAvatarProps = (name: string) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const colors = getAvatarColors(name);
  
  return {
    firstLetter,
    backgroundClass: colors.background,
    textClass: colors.text
  };
};
