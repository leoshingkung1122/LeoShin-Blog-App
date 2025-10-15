import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import { X, Sparkles, Mail, User } from "lucide-react";

interface CreateAccountModalProps {
  dialogState: boolean;
  setDialogState: (open: boolean) => void;
}

function CreateAccountModal({ dialogState, setDialogState }: CreateAccountModalProps) {
    return (
      <AlertDialog open={dialogState} onOpenChange={setDialogState}>
        <AlertDialogContent className="!fixed !top-[50%] !left-[50%] !-translate-x-1/2 !-translate-y-1/2 bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl pt-12 pb-8 px-8 max-w-[28rem] sm:max-w-xl w-[calc(100%-2rem)] flex flex-col items-center shadow-2xl border-0 overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -z-10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full blur-3xl opacity-30 -z-10" />
          
          {/* Icon with animation */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-bounce" />
          </div>

          {/* Title */}
          <AlertDialogTitle className="text-3xl sm:text-4xl font-bold pb-3 text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Create an account to continue
          </AlertDialogTitle>
          
          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-8 text-sm sm:text-base max-w-md">
            Join our community to unlock all features and start your journey with us today!
          </p>

          {/* Create Account Button */}
          <button className="group relative rounded-full text-white bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-900 hover:via-gray-800 hover:to-black transition-all duration-300 py-4 px-12 text-lg font-semibold w-full sm:w-80 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-3">
              <User className="h-5 w-5" />
              Create account
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Login Link */}
          <AlertDialogDescription className="flex flex-row gap-2 justify-center items-center font-medium text-center text-gray-600">
            <span>Already have an account?</span>
            <a
              href="/login"
              className="text-gray-800 hover:text-gray-600 transition-colors underline decoration-2 underline-offset-2 font-bold flex items-center gap-1 group"
            >
              Log in
              <Mail className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </AlertDialogDescription>

          {/* Close Button */}
          <AlertDialogCancel className="absolute right-4 top-4 p-2 border-none bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:rotate-90 transform">
            <X className="h-5 w-5 text-gray-600" />
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

export default CreateAccountModal;