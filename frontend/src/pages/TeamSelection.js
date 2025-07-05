import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/teamSelection.css";

export default function TeamSelection() {
  const { teamId } = useParams();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all players and current team selection
  useEffect(() => {
    api.get("/api/players").then((res) => setPlayers(res.data || res));
    api.get(`/api/team-selections/${teamId}`).then((res) => setSelected(res.data || res));
  }, [teamId]);

  // Check if a player is already selected for this team
  const isSelected = (playerId) =>
    selected.some((sel) => sel.player_id === playerId);

  // Handle player selection
  const handleSelect = async (player) => {
    // Use player.id (database id) for backend, not api_id
    if (isSelected(player.id) || selected.length >= 11) return;
    setLoading(true);
    try {
      await api.post("/api/team-selections", {
        teamId,
        playerId: player.id, // <-- Use database id here
        isCaptain: selected.length === 0,
        isViceCaptain: selected.length === 1,
        isPlaying: true,
        positionInTeam: selected.length + 1,
      });
      const res = await api.get(`/api/team-selections/${teamId}`);
      setSelected(res.data || res);
    } catch (error) {
      // Optionally show a user-friendly error message
      alert(error.response?.data?.message || "Failed to add player.");
    }
    setLoading(false);
  };

  const handleRemove = async (playerId) => {
  setLoading(true);
  try {
    await api.delete(`/api/team-selections/${teamId}/${playerId}`);
    // Refresh selection
    const res = await api.get(`/api/team-selections/${teamId}`);
    setSelected(res.data || res);
  } catch (error) {
    alert(error.response?.data?.message || "Failed to remove player.");
  }
  setLoading(false);
};

  return (
    <div className="team-selection-page fade-in">
      <h2>Pick Your XI</h2>
      <div className="selected-players">
        <h4>Selected Players ({selected.length}/11):</h4>
        <ul>
          {selected.map((sel, i) => (
            <li key={sel.player_id}>
              {players.find((p) => p.id === sel.player_id)?.name || "Player"}{" "}
              {sel.isCaptain ? "(C)" : sel.isViceCaptain ? "(VC)" : ""}
              <button
                className="remove-btn"
                style={{ marginLeft: "10px" }}
                onClick={() => handleRemove(sel.player_id)}
                disabled={loading}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="players-list">
        {players.map((player) => (
          <div
            className={
              "player-card pop-in " +
              (isSelected(player.id) ? "player-card-selected" : "")
            }
            key={player.id}
            onClick={() => handleSelect(player)}
            style={{
              pointerEvents: loading ? "none" : "auto",
              opacity: isSelected(player.id) ? 0.5 : 1,
              cursor: isSelected(player.id) ? "not-allowed" : "pointer",
            }}
          >
            <div className="player-name">{player.name}</div>
            <div className="player-team">{player.team}</div>
            <div className="player-position">{player.position}</div>
            <div className="player-price">£{player.price}m</div>
          </div>
        ))}
      </div>
    </div>
  );
}
