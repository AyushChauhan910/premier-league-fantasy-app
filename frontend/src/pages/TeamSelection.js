import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/teamSelection.css";

export default function TeamSelection() {
  const { teamId } = useParams();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/players").then((res) => setPlayers(res.data || res));
    api.get(`/api/team-selections/${teamId}`).then((res) => setSelected(res.data || res));
  }, [teamId]);

  const isSelected = (playerId) =>
    selected.some((sel) => sel.player_id === playerId);

  const handleSelect = async (player) => {
    if (isSelected(player.api_id) || selected.length >= 11) return;
    setLoading(true);
    await api.post("/api/team-selections", {
      teamId,
      playerId: player.api_id,
      isCaptain: selected.length === 0,
      isViceCaptain: selected.length === 1,
      isPlaying: true,
      positionInTeam: selected.length + 1,
    });
    const res = await api.get(`/api/team-selections/${teamId}`);
    setSelected(res.data || res);
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
              {players.find((p) => p.api_id === sel.player_id)?.name || "Player"}{" "}
              {sel.isCaptain ? "(C)" : sel.isViceCaptain ? "(VC)" : ""}
            </li>
          ))}
        </ul>
      </div>
      <div className="players-list">
        {players.map((player) => (
          <div
            className={
              "player-card pop-in " +
              (isSelected(player.api_id) ? "player-card-selected" : "")
            }
            key={player.api_id}
            onClick={() => handleSelect(player)}
            style={{
              pointerEvents: loading ? "none" : "auto",
              opacity: isSelected(player.api_id) ? 0.5 : 1,
              cursor: isSelected(player.api_id) ? "not-allowed" : "pointer",
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
