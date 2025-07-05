import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/leagues.css";

export default function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [leagueName, setLeagueName] = useState("");
  const [leagueCode, setLeagueCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user's leagues on mount
  useEffect(() => {
    api.get("/api/leagues/my")
      .then(res => setLeagues(res.data || res))
      .catch(() => setLeagues([]));
  }, []);

  // Create a new league
  const handleCreateLeague = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(""); setSuccess("");
    try {
      const res = await api.post("/api/leagues", {
        name: leagueName,
        isPublic: true
      });
      setSuccess(`League "${res.data?.name || leagueName}" created!`);
      setLeagues(lgs => [...lgs, res.data || { name: leagueName }]);
      setLeagueName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create league.");
    }
    setCreating(false);
  };

  // Join a league by code
  const handleJoinLeague = async (e) => {
    e.preventDefault();
    setJoining(true);
    setError(""); setSuccess("");
    try {
      await api.post("/api/league-memberships/join", { code: leagueCode });
      setSuccess(`Joined league with code "${leagueCode}"!`);
      setLeagueCode("");
      // Optionally, refetch leagues
      const res = await api.get("/api/leagues/my");
      setLeagues(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join league.");
    }
    setJoining(false);
  };

  return (
    <div className="leagues-page fade-in">
      <h2>My Leagues</h2>
      <div className="leagues-actions">
        <form className="league-form" onSubmit={handleCreateLeague}>
          <input
            type="text"
            placeholder="New League Name"
            value={leagueName}
            onChange={e => setLeagueName(e.target.value)}
            required
          />
          <button className="league-btn" type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create League"}
          </button>
        </form>
        <form className="league-form" onSubmit={handleJoinLeague}>
          <input
            type="text"
            placeholder="Enter League Code"
            value={leagueCode}
            onChange={e => setLeagueCode(e.target.value)}
            required
          />
          <button className="league-btn league-btn-join" type="submit" disabled={joining}>
            {joining ? "Joining..." : "Join League"}
          </button>
        </form>
      </div>
      {error && <div className="league-error">{error}</div>}
      {success && <div className="league-success">{success}</div>}
      <div className="leagues-list">
        {leagues.length === 0 ? (
          <div className="league-empty">You have not joined any leagues yet.</div>
        ) : (
          leagues.map((lg, i) => (
            <div className="league-card pop-in" key={lg.id || i}>
              <div className="league-card-header">
                <span className="league-name">{lg.name}</span>
                {lg.code && (
                  <span className="league-code">Code: <b>{lg.code}</b></span>
                )}
              </div>
              <div className="league-info">
                <span>Admin: {lg.admin_user_id ? `User #${lg.admin_user_id}` : "You"}</span>
                <span>{lg.is_public ? "Public" : "Private"} League</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
