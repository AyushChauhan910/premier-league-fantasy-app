import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="dashboard fade-in">
      <h1>
        Welcome, <span>{user?.username}</span>!
      </h1>
      <div className="dashboard-cards">
        <div className="dashboard-card bounce-in"
          onClick={() => navigate("/teams")}
          style={{ cursor: "pointer" }}
          title="Go to Teams"
        >
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
        <div
          className="dashboard-card bounce-in dashboard-card-clickable"
          onClick={() => navigate("/fixtures")}
          style={{ cursor: "pointer" }}
          title="See Fixtures"
        >
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
