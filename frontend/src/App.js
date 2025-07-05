import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import TeamSelection from "./pages/TeamSelection";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/animations.css";
import { useAuth } from "./context/AuthContext";
import Fixtures from "./pages/Fixtures";

function App() {

  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes key={isAuthenticated ? "auth" : "guest"}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players"
          element={
            <ProtectedRoute>
              <Players />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-selection/:teamId"
          element={
            <ProtectedRoute>
              <TeamSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fixtures"
          element={
          <ProtectedRoute>
            <Fixtures />
          </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
