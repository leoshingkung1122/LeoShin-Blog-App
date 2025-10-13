/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import axios, { type AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  profilePic?: string;
  username?: string;
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
  register: (data: { email: string; password: string; name?: string }) => Promise<{ error?: string } | void>;
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
    getUserLoading: false,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // Fetch user details using API
  const fetchUser = async () => {
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
        "https://blog-post-project-api-with-db.vercel.app/auth/get-user"
      );
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch user";
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser(); // Load user on initial app load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login user
  const login = async (data: { email: string; password: string }) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post<{ access_token: string }>(
        "https://blog-post-project-api-with-db.vercel.app/auth/login",
        data
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // Fetch and set user details
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/");
      await fetchUser();
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
  const register = async (data: { email: string; password: string; name?: string }) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(
        "https://blog-post-project-api-with-db.vercel.app/auth/register",
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

