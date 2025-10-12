interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingText?: string;
  buttonText?: string;
  className?: string;
}

export default function LoadMoreButton({
  isLoading,
  hasMore,
  onLoadMore,
  loadingText = "Loading",
  buttonText = "View more articles",
  className = ""
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className={`flex justify-center mt-12 ${className}`}>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="group relative overflow-hidden bg-[var(--brown-600)] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-[var(--brown-500)] hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {buttonText}
        </span>
        
        {/* Loading Animation */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{loadingText}</span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--orange)] to-[var(--green)] opacity-0 group-hover:opacity-10 transition-opacity duration-300 cursor-pointer"></div>
      </button>
    </div>
  );
}
