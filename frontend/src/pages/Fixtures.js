import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/fixtures.css";

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/fixtures")
      .then(res => setFixtures(res.data || res))
      .catch(() => setFixtures([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixtures-page fade-in">
      <h2>Premier League Fixtures</h2>
      {loading ? (
        <div className="fixtures-loading">Loading fixtures...</div>
      ) : fixtures.length === 0 ? (
        <div className="fixtures-empty">No fixtures found.</div>
      ) : (
        <div className="fixtures-list">
          {fixtures.map(fx => (
            <div className="fixture-card" key={fx.id}>
              <div className="fixture-date">
                {new Date(fx.match_date).toLocaleString(undefined, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="fixture-teams">
                <span className="fixture-team">{fx.home_team}</span>
                <span className="fixture-vs">vs</span>
                <span className="fixture-team">{fx.away_team}</span>
              </div>
              <div className="fixture-status">
                {fx.status === "finished"
                  ? `${fx.home_score} - ${fx.away_score}`
                  : fx.status.charAt(0).toUpperCase() + fx.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
