import {
  // Bell,
  FileText,
  FolderOpen,
  Key,
  LogOut,
  User,
  Globe,
  Bell,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
import { useState } from "react";

export function AdminSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to check if the current path starts with the base path
  const isActive = (basePath: string) => location.pathname.startsWith(basePath);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          shadow-2xl lg:shadow-xl
        `}
      >
        {/* Brand Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                LeoShin<span className="text-blue-400">.</span>
              </h1>
              <p className="text-sm text-slate-400">Admin panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive("/admin/dashboard")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
          >
            <FileText
              className={`mr-3 h-5 w-5 ${
                isActive("/admin/dashboard")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="font-medium">Article Dashboard</span>
          </Link>

          <Link
            to="/admin/article-management"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive("/admin/article-management")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
          >
            <FileText
              className={`mr-3 h-5 w-5 ${
                isActive("/admin/article-management")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="font-medium">Article management</span>
          </Link>

          <Link
            to="/admin/category-management"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive("/admin/category-management")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
          >
            <FolderOpen
              className={`mr-3 h-5 w-5 ${
                isActive("/admin/category-management")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="font-medium">Category management</span>
          </Link>

          <Link
            to="/admin/users"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive("/admin/users")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
          >
            <Users
              className={`mr-3 h-5 w-5 ${
                isActive("/admin/users")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="font-medium">User management</span>
          </Link>

          <Link
            to="/admin/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive("/admin/profile")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
          >
            <User
              className={`mr-3 h-5 w-5 ${
                isActive("/admin/profile")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="font-medium">Profile</span>
          </Link>

          <Link
            to="/admin/notification"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive("/admin/notification")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
          >
            <Bell
              className={`mr-3 h-5 w-5 ${
                isActive("/admin/notification")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="font-medium">Notification</span>
          </Link>

          <Link
            to="/admin/reset-password"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive("/admin/reset-password")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
          >
            <Key
              className={`mr-3 h-5 w-5 ${
                isActive("/admin/reset-password")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="font-medium">Reset password</span>
          </Link>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
          >
            <Globe className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
            <span className="font-medium">Go to the website</span>
          </Link>
          <button
            onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group w-full text-left"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-400" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
