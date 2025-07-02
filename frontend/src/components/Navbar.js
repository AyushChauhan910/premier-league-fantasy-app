import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        ⚽ Fantasy PL
      </Link>
      <div className="navbar-links">
        {isAuthenticated && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/teams">Teams</Link>
            <Link to="/players">Players</Link>
          </>
        )}
      </div>
      <div className="navbar-auth">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">Hi, {user?.username}</span>
            <button
              className="btn-logout"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link to="/register" className="btn-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
