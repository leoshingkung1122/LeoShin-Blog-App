import { useState, useEffect } from "react";
import { SmilePlus, Copy, X } from "lucide-react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authentication";
import axios from "axios";

interface ShareProps {
  postId: string;
  likesAmount: number;
  setDialogState: (state: boolean) => void;
}

function Share({ postId, likesAmount, setDialogState }: ShareProps) {
  const [likeCount, setLikeCount] = useState(likesAmount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const shareLink = encodeURI(window.location.href);

  useEffect(() => {
    fetchPublicLikeCount();
    if (isAuthenticated) {
      fetchUserLikeStatus();
    }
  }, [likesAmount, isAuthenticated, fetchPublicLikeCount, fetchUserLikeStatus]);

  const fetchPublicLikeCount = async () => {
    try {
      const response = await axios.get(
        `https://leoshin-blog-app-api-with-db.vercel.app/likes/${postId}/public`
      );
      
      setLikeCount(response.data.data.likeCount);
    } catch (error) {
      console.error("Error fetching public like count:", error);
      // Fallback to initial likesAmount
      setLikeCount(likesAmount);
    }
  };

  const fetchUserLikeStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://leoshin-blog-app-api-with-db.vercel.app/likes/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setIsLiked(response.data.data.isLiked);
      // Update like count with the most recent data
      setLikeCount(response.data.data.likeCount);
    } catch (error) {
      console.error("Error fetching user like status:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      setDialogState(true);
      return;
    }

    // Optimistic update - update UI immediately
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    
    // Add a small delay for better UX
    setTimeout(() => {
      setIsLiked(!isLiked);
      setLikeCount(previousIsLiked ? likeCount - 1 : likeCount + 1);
    }, 100);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `https://leoshin-blog-app-api-with-db.vercel.app/likes/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update with actual server response
      setIsLiked(response.data.data.isLiked);
      setLikeCount(response.data.data.likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error with animation
      setTimeout(() => {
        setIsLiked(previousIsLiked);
        setLikeCount(previousLikeCount);
      }, 200);
    } finally {
      setIsLoading(false);
    }
  };
    
  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 bg-gray-50 p-4 rounded-lg border border-gray-200 mx-auto">
      {/* Likes Button */}
      <button
        onClick={handleLikeToggle}
        disabled={isLoading}
        className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-full border-2 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer ${
          isLiked 
            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/25" 
            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm hover:shadow-md"
        } ${isLoading ? "opacity-70 cursor-not-allowed transform-none hover:scale-100" : ""}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <SmilePlus className={`w-5 h-5 transition-all duration-300 ${
            isLiked 
              ? "text-white animate-bounce" 
              : "text-gray-600 group-hover:text-gray-700"
          }`} />
        )}
        <span className={`font-semibold text-lg transition-all duration-300 ${
          isLiked 
            ? "text-white" 
            : "text-gray-700 group-hover:text-gray-800"
        }`}>
          {likeCount}
        </span>
      </button>
      
      {/* Share Buttons */}
      <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
        {/* Copy Link Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
            toast.custom((t) => (
              <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start max-w-md w-full">
                <div>
                  <h2 className="font-bold text-lg mb-1">Copied!</h2>
                  <p className="text-sm">
                    This article has been copied to your clipboard.
                  </p>
                </div>
                <button
                  onClick={() => toast.dismiss(t)}
                  className="text-white hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
            ));
          }}
          className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <Copy className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700 font-medium text-sm">
            Copy link
          </span>
        </button>
        
        {/* Social Media Icons */}
        <div className="flex items-center space-x-2">
          <a
            href={`https://www.facebook.com/share.php?u=${shareLink}`}
            target="_blank"
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <FaFacebook className="w-5 h-5 text-white" />
          </a>
          
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`}
            target="_blank"
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <FaLinkedin className="w-5 h-5 text-white" />
          </a>
          
          <a
            href={`https://www.twitter.com/share?&url=${shareLink}`}
            target="_blank"
            className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors"
          >
            <FaTwitter className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Share;