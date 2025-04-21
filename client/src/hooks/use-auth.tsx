import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define types for auth
type User = {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  role?: string;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = LoginData & {
  fullName: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

// For demo purposes - replace with real authentication
const DEMO_USERS = [
  {
    id: 1,
    username: "brand_manager",
    password: "password",
    fullName: "Jane Smith",
    email: "jane@example.com",
    role: "Brand Manager"
  },
  {
    id: 2, 
    username: "regional_lead",
    password: "password",
    fullName: "John Davis",
    email: "john@example.com",
    role: "Regional Insights Lead"
  },
  {
    id: 3,
    username: "marketing_exec",
    password: "password",
    fullName: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Global Marketing Operations"
  }
];

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [storedUser, setStoredUser] = useState<User | null>(null);
  
  // On component mount, check for stored user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('skuPulseUser');
    if (savedUser) {
      try {
        setStoredUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('skuPulseUser');
      }
    }
  }, []);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // For demo purposes, return the stored user
      return storedUser;
      
      // In a real app, would fetch from API:
      // const res = await apiRequest("GET", "/api/user");
      // if (res.status === 401) return null;
      // return await res.json();
    },
    initialData: storedUser,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // Demo authentication logic
      const demoUser = DEMO_USERS.find(u => u.username === credentials.username);
      
      if (!demoUser || demoUser.password !== credentials.password) {
        throw new Error("Invalid credentials");
      }
      
      // Remove password before returning
      const { password, ...userWithoutPassword } = demoUser;
      return userWithoutPassword;
      
      // In a real app:
      // const res = await apiRequest("POST", "/api/login", credentials);
      // return await res.json();
    },
    onSuccess: (userData: User) => {
      // Save user to localStorage
      localStorage.setItem('skuPulseUser', JSON.stringify(userData));
      setStoredUser(userData);
      queryClient.setQueryData(["currentUser"], userData);
      
      toast({
        title: "Login successful",
        description: `Welcome, ${userData.fullName || userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      // Demo registration logic
      if (DEMO_USERS.some(u => u.username === userData.username)) {
        throw new Error("Username already exists");
      }
      
      // Create a new demo user with the next ID
      const newUser = {
        id: DEMO_USERS.length + 1,
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role
      };
      
      return newUser;
      
      // In a real app:
      // const res = await apiRequest("POST", "/api/register", userData);
      // return await res.json();
    },
    onSuccess: (userData: User) => {
      // Save user to localStorage
      localStorage.setItem('skuPulseUser', JSON.stringify(userData));
      setStoredUser(userData);
      queryClient.setQueryData(["currentUser"], userData);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.fullName || userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // For demo, just clear local storage
      localStorage.removeItem('skuPulseUser');
      
      // In a real app:
      // await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      setStoredUser(null);
      queryClient.setQueryData(["currentUser"], null);
      
      toast({
        title: "Logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}