import { useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X, Sparkles } from "lucide-react";
// @ts-ignore - PNG file import
import AkiImage from "../../assets/Aki pose02.PNG";

interface ComingSoonModalProps {
  dialogState: boolean;
  setDialogState: (open: boolean) => void;
  iconType?: "linkedin" | "github" | "email";
}

function ComingSoonModal({
  dialogState,
  setDialogState,
  iconType = "linkedin",
}: ComingSoonModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const handleClickRef = useRef<((e: MouseEvent) => void) | null>(null);

  useEffect(() => {
    if (!dialogState) return;

    // Wait for overlay to be rendered
    const timer = setTimeout(() => {
      // Find the overlay element created by AlertDialog
      const overlay = document.querySelector(
        '[data-slot="alert-dialog-overlay"]'
      ) as HTMLElement;
      if (overlay) {
        overlayRef.current = overlay as HTMLDivElement;
        const handleClick = (e: MouseEvent) => {
          // Only close if clicking directly on overlay, not on content
          if (e.target === overlay) {
            setDialogState(false);
          }
        };
        handleClickRef.current = handleClick;
        overlay.addEventListener("click", handleClick);
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      if (overlayRef.current && handleClickRef.current) {
        overlayRef.current.removeEventListener("click", handleClickRef.current);
        overlayRef.current = null;
        handleClickRef.current = null;
      }
    };
  }, [dialogState, setDialogState]);
  const getIconName = () => {
    switch (iconType) {
      case "linkedin":
        return "LinkedIn";
      case "github":
        return "GitHub";
      case "email":
        return "Email";
      default:
        return "This feature";
    }
  };

  return (
    <AlertDialog open={dialogState} onOpenChange={setDialogState}>
      <AlertDialogContent className="!fixed !top-[50%] !left-[50%] !-translate-x-1/2 !-translate-y-1/2 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-2xl p-0 max-w-[32rem] sm:max-w-2xl md:max-w-3xl w-[calc(100%-2rem)] shadow-2xl border-0 overflow-clip relative z-50">
        {/* Decorative background elements - matching Aki's colors */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-200 to-amber-200 rounded-full blur-3xl opacity-40 -z-10" />

        {/* Grid Layout - Similar to 404 page */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-center w-full px-6 sm:px-8 md:px-10 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 relative">
          {/* Aki Character Image - Left side, large */}
          <div className="relative z-10 flex items-center justify-center order-2 md:order-1">
            <div className="relative">
              <img
                src={AkiImage}
                alt="Aki"
                className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
              {/* Glow effect behind character */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-rose-200/30 to-orange-200/30 blur-3xl -z-10"></div>
              {/* Floating sparkles around Aki */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-300 rounded-full border-4 border-white animate-bounce flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-rose-600" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-orange-300 rounded-full border-3 border-white animate-pulse flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Content Section - Right side */}
          <div className="flex flex-col items-center md:items-start space-y-3 sm:space-y-4 relative z-10 order-1 md:order-2 overflow-visible">
            {/* Title */}
            <AlertDialogTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-center md:text-left bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-normal pb-2 overflow-visible">
              Coming Soon
            </AlertDialogTitle>

            {/* Subtitle - Use AlertDialogDescription with spans to avoid nested block elements */}
            <AlertDialogDescription className="text-center md:text-left text-gray-700 text-sm sm:text-base mt-2">
              <span className="block font-semibold text-rose-700 mb-2">
                {getIconName()} connection is not available yet.
              </span>
              <span className="block text-gray-600">
                We're working hard to bring you this feature. Stay tuned for
                updates!
              </span>
            </AlertDialogDescription>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 w-full my-2 pt-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
              <span className="text-xs text-rose-500 font-medium uppercase tracking-wider">
                Under Development
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            </div>
          </div>

          {/* Close Button */}
          <AlertDialogCancel className="absolute right-4 top-4 p-2 border-none bg-rose-100 hover:bg-rose-200 rounded-full transition-all duration-200 hover:rotate-90 transform cursor-pointer z-50">
            <X className="h-5 w-5 text-rose-600" />
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ComingSoonModal;
