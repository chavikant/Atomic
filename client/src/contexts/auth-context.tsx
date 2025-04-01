import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    password: string;
    name: string;
    email: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Fetch the current user on mount
  const { isLoading, refetch } = useQuery({
    queryKey: ['/api/users/me'],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(queryKey[0] as string, {
          credentials: 'include'
        });
        if (response.status === 401) {
          return null;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  // Update user state when data changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await refetch();
        if (data.data) {
          setUser(data.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    
    fetchUser();
  }, [refetch]);

  // Login mutation
  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return apiRequest("POST", "/api/auth/login", credentials);
    },
    onSuccess: async (res) => {
      const userData = await res.json();
      setUser(userData);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habits/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
    },
  });

  // Register mutation
  const { mutateAsync: registerMutation } = useMutation({
    mutationFn: async (userData: {
      username: string;
      password: string;
      name: string;
      email: string;
    }) => {
      return apiRequest("POST", "/api/auth/register", userData);
    },
  });

  // Logout mutation
  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      setUser(null);
      setIsAuthenticated(false);
      queryClient.invalidateQueries();
      setLocation("/login");
    },
  });

  // Login function
  const login = async (username: string, password: string) => {
    try {
      await loginMutation({ username, password });
      toast({
        title: "Login successful",
        description: `Welcome back, ${user?.name || username}!`,
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData: {
    username: string;
    password: string;
    name: string;
    email: string;
  }) => {
    try {
      await registerMutation(userData);
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error during registration. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutMutation();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "There was an error during logout. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}