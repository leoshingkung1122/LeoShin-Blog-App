import { Menu, LogOut, User as UserIcon, KeyRound, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

function DropdownMenuDemo() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, state } = useAuth();
  
  // Show loading state while fetching user data
  if (state.getUserLoading) {
    return (
      <div className="sm:hidden">
        <div className="size-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="sm:hidden focus:outline-none">
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:hidden w-screen rounded-none mt-4 flex flex-col gap-2 py-2 px-0 bg-white/95 backdrop-blur">
        {isAuthenticated ? (
          <>
            {/* Header row */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 ring-1 ring-black/5">
                  <AvatarImage src={state.user?.profile_pic} alt={state.user?.name || state.user?.username || "User"} />
                  <AvatarFallback>{(state.user?.name || state.user?.username || "U").slice(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-gray-800 leading-5">{state.user?.name || state.user?.username || state.user?.email}</span>
                </div>
              </div>
              <button aria-label="Notifications" className="relative grid place-items-center size-10 rounded-full border border-gray-300/70 bg-white">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full" />
              </button>
            </div>
            <div className="border-t" />
            {/* Items */}
            <button onClick={() => navigate("/profile")} className="flex items-center gap-3 px-5 py-4 text-left">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Profile</span>
            </button>
            <div className="border-t mx-4" />
            <button onClick={() => navigate("/reset-password")} className="flex items-center gap-3 px-5 py-4 text-left">
              <KeyRound className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Reset password</span>
            </button>
            <div className="border-t" />
            <button onClick={logout} className="flex items-center gap-3 px-5 py-4 text-left">
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Log out</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/Login")}
              className="px-8 py-4 rounded-full text-center text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/SignUp")}
              className="px-8 py-4 bg-foreground text-center text-white rounded-full hover:bg-muted-foreground transition-colors"
            >
              Sign up
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownMenuDemo;
