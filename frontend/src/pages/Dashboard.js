import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard fade-in">
      <h1>
        Welcome, <span>{user?.email}</span>!
      </h1>
      <div className="dashboard-cards">
        <div className="dashboard-card bounce-in">
          <div className="dashboard-card-icon">⚽</div>
          <div>
            <div className="dashboard-card-title">Create your team</div>
            <div className="dashboard-card-desc">Pick your dream XI</div>
          </div>
        </div>
        <div className="dashboard-card bounce-in" style={{ animationDelay: "0.2s" }}>
          <div className="dashboard-card-icon">🏆</div>
          <div>
            <div className="dashboard-card-title">Compete in leagues</div>
            <div className="dashboard-card-desc">Climb the leaderboard</div>
          </div>
        </div>
        <div className="dashboard-card bounce-in" style={{ animationDelay: "0.4s" }}>
          <div className="dashboard-card-icon">📅</div>
          <div>
            <div className="dashboard-card-title">See fixtures</div>
            <div className="dashboard-card-desc">Stay up to date</div>
          </div>
        </div>
      </div>
    </div>
  );
}
