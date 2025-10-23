/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import axios, { type AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  profile_pic?: string;
  profilePic?: string; // API returns this field
  username?: string;
  introduction?: string;
}

interface AuthState {
  loading: boolean;
  getUserLoading: boolean;
  error: string | null;
  user: User | null;
}

interface AuthContextType {
  state: AuthState;
  login: (data: { email: string; password: string }) => Promise<{ error?: string } | void>;
  logout: () => void;
  register: (data: { email: string; password: string; name?: string; username?: string }) => Promise<{ error?: string } | void>;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    loading: false,
    getUserLoading: true, // Start with true to prevent flicker
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // Fetch user details using API
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
        const response = await axios.get<User>(
        "https://leoshin-blog-app-api-with-db.vercel.app/auth/get-user",
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
        setState((prevState) => ({
          ...prevState,
          user: {
            ...response.data,
            profile_pic: response.data.profilePic || response.data.profile_pic || ""
          },
          isAuthenticated: true,
          error: null,
          getUserLoading: false,
        }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch user";
      console.error("Error fetching user:", error);
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
        // Don't set user to null on error, keep existing user data
        getUserLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    // Load user on initial app load. Delay UI until first fetch completes by toggling getUserLoading.
    fetchUser();
  }, [fetchUser]);

  // Login user
  const login = async (data: { email: string; password: string }) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post<{ access_token: string }>(
        "https://leoshin-blog-app-api-with-db.vercel.app/auth/login",
        data
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // Ensure user state is populated before navigating to avoid flicker
      await fetchUser();
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || "Login failed";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  // Register user
  const register = async (data: { email: string; password: string; name?: string; username?: string }) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(
        "https://leoshin-blog-app-api-with-db.vercel.app/auth/register",
        data
      );
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/sign-up/success");
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || "Registration failed";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, error: null, loading: false, getUserLoading: false });
    navigate("/");
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        isAuthenticated,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

