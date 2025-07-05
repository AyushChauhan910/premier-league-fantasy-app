import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/teamSelection.css";

export default function TeamSelection() {
  const { teamId } = useParams();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

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
    if (isSelected(player.id) || selected.length >= 11) return;
    setLoading(true);
    try {
      await api.post("/api/team-selections", {
        teamId,
        playerId: player.id,
        isCaptain: selected.length === 0,
        isViceCaptain: selected.length === 1,
        isPlaying: true,
        positionInTeam: selected.length + 1,
      });
      const res = await api.get(`/api/team-selections/${teamId}`);
      setSelected(res.data || res);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add player.");
    }
    setLoading(false);
  };

  const handleRemove = async (playerId) => {
    setLoading(true);
    try {
      await api.delete(`/api/team-selections/${teamId}/${playerId}`);
      const res = await api.get(`/api/team-selections/${teamId}`);
      setSelected(res.data || res);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove player.");
    }
    setLoading(false);
  };

  // Search logic: filter by name, team, or position
  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.team.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase())
  );

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
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
                onClick={() => handleRemove(sel.player_id)}
                disabled={loading}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form className="player-search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, team, or position"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-btn" type="submit" disabled={loading}>
          Search
        </button>
        <button
          className="clear-btn"
          type="button"
          onClick={() => {
            setSearch("");
            setSearchInput("");
          }}
          disabled={loading}
        >
          Clear
        </button>
      </form>

      <div className="players-list">
        {filteredPlayers.map((player) => (
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
