import { useState, useEffect } from "react";
import { Textarea } from "./Textarea";
import { useAuth } from "@/contexts/authentication";
import axios from "axios";
import { generateAvatarProps } from "@/utils/badgeColors";
import Pagination from "./Pagination";

interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  parent_id?: number;
  name: string;
  email?: string;
  comment: string;
  image?: string;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    name: string;
    username: string;
    profile_pic?: string;
    role?: string;
  };
}

interface CommentProps {
  postId: string;
  setDialogState: (state: boolean) => void;
}

export default function Comment({ postId, setDialogState }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const COMMENTS_PER_PAGE = 5;

  useEffect(() => {
    fetchComments();
  }, [postId, currentPage, fetchComments]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: COMMENTS_PER_PAGE.toString()
      });
      
      const response = await axios.get(
        `https://leoshin-blog-app-api-with-db.vercel.app/comments/${postId}?${params.toString()}`
      );
      
      // Server-side pagination response
      if (response.data && response.data.data) {
        setComments(response.data.data);
        
        // Handle pagination metadata
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalComments(response.data.pagination.total || 0);
        } else if (response.data.meta) {
          // Alternative pagination structure
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalComments(response.data.meta.total || 0);
        } else {
          // If no pagination metadata, assume single page
          setTotalPages(1);
          setTotalComments(response.data.data.length);
        }
      } else {
        setComments([]);
        setTotalPages(1);
        setTotalComments(0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
      setTotalPages(1);
      setTotalComments(0);
      
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError("Post not found or no comments available");
        } else if (error.response?.status && error.response.status >= 500) {
          setError("Server error occurred. Please try again later.");
        } else {
          setError("Failed to load comments. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isAuthenticated) {
      setDialogState(true);
      return;
    }
    setNewComment(e.target.value);
  };

  const handlePageChange = (page: number) => {
    // Validate page number
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when postId changes
  useEffect(() => {
    setCurrentPage(1);
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      setDialogState(true);
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      
      await axios.post(
        `https://leoshin-blog-app-api-with-db.vercel.app/comments`,
        {
          post_id: postId,
          comment: newComment.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewComment("");
      // Reset to first page and refresh comments
      setCurrentPage(1);
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const generateAvatar = (name: string) => {
    const { firstLetter, backgroundClass, textClass } = generateAvatarProps(name);
    
    return (
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${backgroundClass} flex items-center justify-center ${textClass} font-bold text-xl sm:text-2xl shadow-lg`}>
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Comment Input Section */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 mb-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/20 to-purple-100/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Share Your Thoughts
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Join the conversation</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <Textarea
                onFocus={() => !isAuthenticated && setDialogState(true)}
                placeholder={isAuthenticated ? "What's on your mind? Share your thoughts with the community..." : "Please log in to comment"}
                className="w-full p-6 h-40 sm:h-44 resize-none rounded-2xl placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 text-base sm:text-lg leading-relaxed"
                value={newComment}
                onChange={handleTextareaChange}
                maxLength={500}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                {isAuthenticated ? "✓ You're logged in" : "⚠ Please log in to comment"}
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                  newComment.length > 450 
                    ? 'bg-red-100 text-red-700' 
                    : newComment.length > 250 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {newComment.length}/500
                </div>
                <button 
                  onClick={handleSubmitComment}
                  disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="space-y-8">
        {/* Comments Header */}
        {!isLoading && totalComments > 0 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  {totalComments} Comment{totalComments !== 1 ? 's' : ''}
                </h4>
                <p className="text-gray-600 text-sm">Community discussions</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={`comment-skeleton-${index}`} className="animate-pulse">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="w-14 h-14 bg-gray-300 rounded-2xl flex-shrink-0"></div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-5 bg-gray-300 rounded w-32"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-6 text-sm sm:text-base">{error}</p>
              <button
                onClick={() => fetchComments()}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg w-full sm:w-auto"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No comments yet</h3>
              <p className="text-gray-600 mb-2">Be the first to share your thoughts!</p>
              <p className="text-gray-500 text-sm">Start the conversation below</p>
            </div>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-purple-50/30"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -translate-y-10 translate-x-10"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      {comment.users?.profile_pic || comment.image ? (
                        <img
                          src={comment.users?.profile_pic || comment.image}
                          alt={comment.users?.name || comment.name}
                          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 object-cover ring-4 ring-white shadow-lg"
                        />
                      ) : (
                        <div className="rounded-full w-14 h-14 sm:w-16 sm:h-16 ring-4 ring-white shadow-lg">
                          {generateAvatar(comment.users?.name || comment.name)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-gray-900 text-lg sm:text-xl">
                            {comment.users?.name || comment.name}
                          </h4>
                          {comment.users?.role === 'admin' && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="prose prose-gray max-w-none">
                        <div className="text-gray-800 leading-relaxed text-base sm:text-lg break-words overflow-wrap-anywhere word-break-break-word whitespace-pre-wrap">
                          {comment.comment}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="py-2"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}