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
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);

  // Fetch all players and current team selection
  useEffect(() => {
    api.get("/api/players").then((res) => setPlayers(res.data || res));
    api.get(`/api/team-selections/${teamId}`).then((res) => {
      setSelected(res.data || res);
      // Set initial captain and vice-captain
      const captain = (res.data || res).find(sel => sel.isCaptain);
      const viceCaptain = (res.data || res).find(sel => sel.isViceCaptain);
      setCaptainId(captain?.player_id || null);
      setViceCaptainId(viceCaptain?.player_id || null);
    });
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
        isCaptain: false,
        isViceCaptain: false,
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
      // If removing captain/vice, unset their IDs
      if (playerId === captainId) setCaptainId(null);
      if (playerId === viceCaptainId) setViceCaptainId(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove player.");
    }
    setLoading(false);
  };

  // Save captain/vice-captain selection
  const handleSave = async () => {
    setLoading(true);
    try {
      // Update all players, setting isCaptain/isViceCaptain as appropriate
      await Promise.all(
        selected.map((sel) =>
          api.post("/api/team-selections", {
            teamId,
            playerId: sel.player_id,
            isCaptain: sel.player_id === captainId,
            isViceCaptain: sel.player_id === viceCaptainId,
            isPlaying: true,
            positionInTeam: sel.position_in_team,
          })
        )
      );
      const res = await api.get(`/api/team-selections/${teamId}`);
      setSelected(res.data || res);
      alert("Team saved!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save team. Please try again."
      );
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
        <table className="selected-players-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Captain</th>
              <th>Vice-Captain</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {selected.map((sel) => {
              const player = players.find((p) => p.id === sel.player_id);
              return (
                <tr key={sel.player_id}>
                  <td className="player-name-cell">{player?.name || "Player"}</td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name="captain"
                        checked={captainId === sel.player_id}
                        onChange={() => setCaptainId(sel.player_id)}
                        disabled={loading || selected.length < 11}
                      />
                      <span className="captain-label">C</span>
                    </label>
                  </td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name="viceCaptain"
                        checked={viceCaptainId === sel.player_id}
                        onChange={() => setViceCaptainId(sel.player_id)}
                        disabled={loading || selected.length < 11}
                      />
                      <span className="vice-captain-label">VC</span>
                    </label>
                  </td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(sel.player_id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          className="save-btn"
          disabled={
            loading ||
            selected.length < 11 ||
            !captainId ||
            !viceCaptainId ||
            captainId === viceCaptainId
          }
          onClick={handleSave}
          style={{ marginTop: "1.2em", minWidth: 120 }}
        >
          Save Team
        </button>
        {captainId === viceCaptainId && (
          <div style={{ color: "#e74c3c", marginTop: "0.5em" }}>
            Captain and Vice-Captain cannot be the same player.
          </div>
        )}
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
