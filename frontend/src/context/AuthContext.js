import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { getUserById } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Initialize state from localStorage on first render
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Keep isAuthenticated in sync with token
  useEffect(() => {
    setIsAuthenticated(!!token);
    setReady(true); // Mark context as ready after checking token
  }, [token])

  // Sync user from localStorage if token changes and user is not set
  useEffect(() => {
    if (token && !user) {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Login to get token and userId
      const res = await api.post("/api/login", { email, password });
      console.log("Login response:", res);

       const userId = res.data.userId;
       const token = res.data.token;

      setToken(res.token);
      localStorage.setItem("token", token);

      // 2. Fetch user profile using userId
      const userRes = await getUserById(userId);
      setUser(userRes.data);
      console.log("Fetched user profile:", userRes.data); 

      
      localStorage.setItem("user", JSON.stringify(userRes.data));

      setIsAuthenticated(true);
      toast.success("Login successful!");
      return true;
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed");
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, username, password) => {
    setLoading(true);
    try {
      await api.post("/api/register", { email, username, password });
      toast.success("Registration successful! Please login.");
      return true;
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        ready
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
