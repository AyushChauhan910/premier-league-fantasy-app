import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/players.css";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [q, setQ] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    api.get("/api/players").then((res) => setPlayers(res.data || res));
  }, []);

  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
    try {
      const res = await api.get(`/api/players/${player.id}/stats`);
      setPlayerStats(res.data);
    } catch (err) {
      setPlayerStats(null);
    }
  };

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
          <div className="player-card pop-in" key={player.api_id} onClick={() => handlePlayerClick(player)}>
            <div className="player-name">{player.name}</div>
            <div className="player-team">{player.team}</div>
            <div className="player-position">{player.position}</div>
            <div className="player-price">£{player.price}m</div>
            {showModal && selectedPlayer?.api_id === player.api_id && (
              <div className="player-modal">
                <div className="player-modal-content">
                  <button onClick={() => setShowModal(false)}>Close</button>
                  <h3>{selectedPlayer.name}</h3>
                  {playerStats ? (
              <ul>
                <li><b>Total Points:</b> {playerStats.total_points}</li>
                <li><b>Goals:</b> {playerStats.goals}</li>
                <li><b>Assists:</b> {playerStats.assists}</li>
                <li><b>Minutes Played:</b> {playerStats.minutes_played}</li>
                <li><b>Clean Sheets:</b> {playerStats.clean_sheet}</li>
                <li><b>Yellow Cards:</b> {playerStats.yellow_cards}</li>
                <li><b>Red Cards:</b> {playerStats.red_cards}</li>
                <li><b>Own Goals:</b> {playerStats.own_goals}</li>
                <li><b>Penalties Saved:</b> {playerStats.penalties_saved}</li>
                <li><b>Penalties Missed:</b> {playerStats.penalties_missed}</li>
                <li><b>Bonus Points:</b> {playerStats.bonus_points}</li>
              </ul>
                  ) : (
                    <p>No stats available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
