import React from 'react';
import { getBadgeColorsSafe } from '../../utils/badgeColors';

interface CategoryBadgeProps {
  category?: string;
  categoryId?: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2',
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  categoryId,
  className = '',
  size = 'md'
}) => {
  const colors = getBadgeColorsSafe(categoryId);
  const sizeClass = sizeClasses[size];

  return (
    <span 
      className={`rounded-full font-semibold ${sizeClass} ${className}`}
      style={{ 
        backgroundColor: colors.light,
        color: colors.dark
      }}
    >
      {category || "Uncategorized"}
    </span>
  );
};

export default CategoryBadge;
