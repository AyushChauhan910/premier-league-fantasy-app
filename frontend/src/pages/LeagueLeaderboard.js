import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/leaderboard.css";

export default function LeagueLeaderboard({ leagueId, leagueName, onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/leagues/${leagueId}/leaderboard`)
      .then(res => setLeaderboard(res.data || res))
      .finally(() => setLoading(false));
  }, [leagueId]);

  return (
    <div className="leaderboard-modal">
      <div className="leaderboard-modal-content">
        <button className="close-btn" onClick={onClose}>Close</button>
        <h2>{leagueName} Leaderboard</h2>
        {loading ? (
          <div>Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div>No teams in this league yet.</div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team Name</th>
                <th>Manager</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={entry.team_id}>
                  <td>{idx + 1}</td>
                  <td>{entry.team_name}</td>
                  <td>{entry.username}</td>
                  <td>{entry.total_points || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
