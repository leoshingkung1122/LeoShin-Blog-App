import DropdownMenuDemo from "./DropdownMenuDemo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Bell, ChevronDown, LogOut, User as UserIcon, KeyRound, Settings } from "lucide-react";

function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, state, logout } = useAuth();
  
  // Show loading state while fetching user data
  if (state.getUserLoading) {
    return (
      <header className="bg-[var(--brown-100)]/80 backdrop-blur border-b">
        <nav className="container mx-auto flex items-center justify-between py-3 px-4 sm:py-4 sm:px-8">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold cursor-pointer tracking-tight hover:opacity-90 transition-opacity"
          >
            LeoShin<span className="text-green-500">.</span>
          </button>
          <div className="hidden sm:flex items-center gap-4">
            {/* Loading skeleton */}
            <div className="flex items-center gap-3">
              <div className="size-9 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
  
  return (
    <header className="bg-[var(--brown-100)]/80 backdrop-blur border-b">
      <nav className="container mx-auto flex items-center justify-between py-3 px-4 sm:py-4 sm:px-8">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold cursor-pointer tracking-tight hover:opacity-90 transition-opacity"
        >
          LeoShin<span className="text-green-500">.</span>
        </button>
        {isAuthenticated ? (
          <div className="hidden sm:flex items-center gap-4">
            {/* Notification bell */}
            <button
              aria-label="Notifications"
              className="relative grid place-items-center size-10 rounded-full border border-gray-300/70 bg-white/70 backdrop-blur hover:bg-white transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full" />
            </button>
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none rounded-full px-2 py-1 hover:bg-white/60 transition-colors">
                <Avatar className="size-9 shadow-sm ring-1 ring-black/5">
                  <AvatarImage src={state.user?.profile_pic} alt={state.user?.name || state.user?.username || "User"} />
                  <AvatarFallback>
                    {(state.user?.name || state.user?.username || "U").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold text-gray-800">
                  {state.user?.name || state.user?.username || state.user?.email}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-gray-200 shadow-xl bg-white/90 backdrop-blur p-2">
                <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-3 py-3">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/reset-password")} className="gap-3 py-3">
                  <KeyRound className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Reset password</span>
                </DropdownMenuItem>
                {/* Admin Panel - Only show for admin users */}
                {state.user?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")} className="gap-3 py-3">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-600 font-medium">Admin Panel</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout} className="gap-3 py-3">
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/Login")}
              className="relative px-6 py-3 rounded-full text-black border-2 border-black bg-white font-semibold overflow-hidden group transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Log in</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
            </button>
            <button
              onClick={() => navigate("/SignUp")}
              className="relative px-6 py-3 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold overflow-hidden group transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Sign up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
            </button>
          </div>
        )}
        <DropdownMenuDemo />
      </nav>
    </header>
  );
}

export default NavBar;
