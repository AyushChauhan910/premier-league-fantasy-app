import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      // Optionally, fetch user profile here if you have such endpoint
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/login", { email, password });
      setToken(res.token);
      setUser({ id: res.userId, email });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify({ id: res.userId, email }));
      toast.success("Login successful!");
      return true;
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed");
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
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
