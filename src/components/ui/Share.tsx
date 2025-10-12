import { SmilePlus, Copy, X } from "lucide-react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { toast } from "sonner";

function Share({ likesAmount, setDialogState }: { likesAmount: number, setDialogState: (state: boolean) => void }) {
    const shareLink = encodeURI(window.location.href);
    
    return (
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 bg-gray-50 p-4 rounded-lg border border-gray-200 mx-auto ">
        {/* Likes Button */}
        <button
          onClick={() => setDialogState(true)}
          className="bg-white flex items-center justify-center space-x-2 px-11 py-3 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors group"
        >
          <SmilePlus className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">
            {likesAmount}
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