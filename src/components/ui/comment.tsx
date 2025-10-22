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
  }, [postId, currentPage]);

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
      <div className={`w-12 h-12 rounded-full ${backgroundClass} flex items-center justify-center ${textClass} font-bold text-lg shadow-md`}>
        {firstLetter}
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-4 px-4 mb-16">
        <h3 className="text-lg font-semibold">Comment</h3>
        <div className="space-y-2">
          <Textarea
            onFocus={() => !isAuthenticated && setDialogState(true)}
            placeholder={isAuthenticated ? "What are your thoughts?" : "Please log in to comment"}
            className="w-full p-4 h-24 resize-none py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            value={newComment}
            onChange={handleTextareaChange}
          />
          <div className="flex justify-end">
            <button 
              onClick={handleSubmitComment}
              disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
              className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 px-4">
        {/* Comments Header */}
        {!isLoading && totalComments > 0 && (
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600">
              {totalComments} comment{totalComments !== 1 ? 's' : ''}
            </h4>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchComments()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {comments.map((comment, index) => (
              <div key={comment.id} className="flex flex-col gap-2 mb-4">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {comment.users?.profile_pic || comment.image ? (
                      <img
                        src={comment.users?.profile_pic || comment.image}
                        alt={comment.users?.name || comment.name}
                        className="rounded-full w-12 h-12 object-cover"
                      />
                    ) : (
                      generateAvatar(comment.users?.name || comment.name)
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col items-start justify-between">
                      <h4 className="font-semibold">
                        {comment.users?.name || comment.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{comment.comment}</p>
                {index < comments.length - 1 && (
                  <hr className="border-gray-300 my-4" />
                )}
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="py-4"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}