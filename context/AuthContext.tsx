"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("studybuddy_user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      }
    }
    return null;
  });

  useEffect(() => {
    // Just to ensure it's synced if needed, but initialization is handled above
  }, []);

  const login = (email: string, name: string) => {
    const newUser = { id: Date.now().toString(), email, name };
    setUser(newUser);
    localStorage.setItem("studybuddy_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("studybuddy_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
