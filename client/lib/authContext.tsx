import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getOrCreateDeviceId,
  getDeviceFingerprint,
  isNewDevice,
} from "./deviceTracking";

export interface User {
  id: string;
  deviceId: string;
  username: string;
  avatar: string;
  email?: string;
  createdAt: number;
  lastLogin: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  createAccountFromDevice: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth on app load
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const deviceId = getOrCreateDeviceId();
      const storedUser = localStorage.getItem(`bilibili_user_${deviceId}`);

      if (storedUser) {
        // User already exists on this device
        const userData: User = JSON.parse(storedUser);
        userData.lastLogin = Date.now();
        localStorage.setItem(
          `bilibili_user_${deviceId}`,
          JSON.stringify(userData),
        );
        setUser(userData);
      } else if (isNewDevice()) {
        // New device - create account automatically
        const newUser = await createAccountFromDevice();
        setUser(newUser);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAccountFromDevice = async (): Promise<User> => {
    const deviceId = getOrCreateDeviceId();
    const fp = getDeviceFingerprint();

    // Generate a unique username from device info
    const timestamp = Date.now().toString(36);
    const username = `user_${timestamp}`;

    // Check if this is the first user (make them admin)
    const usersList = JSON.parse(
      localStorage.getItem("bilibili_users_list") || "[]",
    );
    const isFirstUser = usersList.length === 0;

    // Create user object
    const newUser: User = {
      id: `uid_${timestamp}`,
      deviceId,
      username,
      avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}`,
      email: undefined,
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };

    // Store in localStorage (simulating DB)
    localStorage.setItem(`bilibili_user_${deviceId}`, JSON.stringify(newUser));

    // Also store user list (in real app, this would be on backend)
    usersList.push({
      id: newUser.id,
      deviceId,
      username: newUser.username,
      createdAt: newUser.createdAt,
      isAdmin: isFirstUser, // First user is admin
    });
    localStorage.setItem("bilibili_users_list", JSON.stringify(usersList));

    // Save admin user ID if this is first user
    if (isFirstUser) {
      localStorage.setItem("admin_user_id", newUser.id);
    }

    return newUser;
  };

  const login = (newUser: User) => {
    const deviceId = getOrCreateDeviceId();
    localStorage.setItem(`bilibili_user_${deviceId}`, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    const deviceId = getOrCreateDeviceId();
    localStorage.removeItem(`bilibili_user_${deviceId}`);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        logout,
        createAccountFromDevice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
