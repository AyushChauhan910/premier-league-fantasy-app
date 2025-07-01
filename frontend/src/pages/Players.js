import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/players.css";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/api/players").then((res) => setPlayers(res.data || res));
  }, []);

  const filtered = players.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.team.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="players-page fade-in">
      <h2>All Premier League Players</h2>
      <input
        className="player-search"
        placeholder="Search by name or team"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="players-list">
        {filtered.map((player) => (
          <div className="player-card pop-in" key={player.api_id}>
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
