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
import { Bell, ChevronDown, LogOut, User as UserIcon, KeyRound } from "lucide-react";

function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, state, logout } = useAuth();
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
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout} className="gap-3 py-3">
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden sm:flex space-x-4">
            <button
              onClick={() => navigate("/Login")}
              className="px-8 py-2 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/SignUp")}
              className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors"
            >
              Sign up
            </button>
          </div>
        )}
        <DropdownMenuDemo />
      </nav>
    </header>
  );
}

export default NavBar;
