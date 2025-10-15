interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({ 
  count = 6, 
  className = "" 
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={`skeleton-${index}`} className={`animate-pulse ${className}`}>
          <div className="bg-[var(--brown-200)] rounded-lg overflow-hidden shadow-sm">
            <div className="h-48 bg-[var(--brown-300)]"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[var(--brown-300)] rounded w-20"></div>
              <div className="h-6 bg-[var(--brown-300)] rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[var(--brown-300)] rounded"></div>
                <div className="h-4 bg-[var(--brown-300)] rounded w-3/4"></div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <div className="h-4 bg-[var(--brown-300)] rounded w-16"></div>
                <div className="h-4 bg-[var(--brown-300)] rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
