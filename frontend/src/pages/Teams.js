import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/teams.css";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/teams");
      setTeams(res.data || res); // support both axios default and custom
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setLoading(true);
    try {
      await api.post("/api/teams", { teamName });
      setTeamName("");
      fetchTeams();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teams-page fade-in">
      <h2>Your Teams</h2>
      <form className="team-create-form" onSubmit={handleCreate}>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="New team name"
          required
        />
        <button className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
      <div className="team-list">
        {teams.length === 0 && <div>No teams yet.</div>}
        {teams.map((team) => (
          <Link
            to={`/team-selection/${team.id}`}
            className="team-card slide-in"
            key={team.id}
          >
            <div className="team-card-title">{team.team_name}</div>
            <div className="team-card-budget">
              Budget: £{team.budget_remaining}m
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
