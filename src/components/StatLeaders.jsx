// src/components/StatLeaders.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function StatLeaders({ players, teams, games, boxScores }) {
  const [category, setCategory] = useState("pts"); // pts | reb | ast

  function teamName(teamId) {
    const t = teams.find((x) => x.id === teamId);
    return t ? t.name : "Unknown team";
  }

  const playerTotals = useMemo(() => {
    const totals = new Map();

    for (const row of boxScores) {
      const prev = totals.get(row.playerId) || {
        playerId: row.playerId,
        teamId: row.teamId,
        gp: 0,
        pts: 0,
        reb: 0,
        ast: 0,
      };

      prev.gp += 1;
      prev.pts += row.pts;
      prev.reb += row.reb;
      prev.ast += row.ast;

      totals.set(row.playerId, prev);
    }

    // Convert to array and attach player info
    return Array.from(totals.values())
      .map((t) => {
        const p = players.find((x) => x.id === t.playerId);
        return {
          ...t,
          name: p?.name || "Unknown player",
          position: p?.position || "",
          number: p?.number ?? "",
          ppg: t.gp ? (t.pts / t.gp).toFixed(1) : "0.0",
          rpg: t.gp ? (t.reb / t.gp).toFixed(1) : "0.0",
          apg: t.gp ? (t.ast / t.gp).toFixed(1) : "0.0",
        };
      });
  }, [boxScores, players]);

  const leaders = useMemo(() => {
    const sorted = [...playerTotals].sort((a, b) => b[category] - a[category]);
    return sorted.slice(0, 10);
  }, [playerTotals, category]);

  const categoryLabel =
    category === "pts" ? "Points" : category === "reb" ? "Rebounds" : "Assists";

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="h5 mb-0">Stat Leaders</h3>
        <div className="btn-group" role="group" aria-label="Stat category">
          <button
            type="button"
            className={`btn btn-sm ${
              category === "pts" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCategory("pts")}
          >
            PTS
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              category === "reb" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCategory("reb")}
          >
            REB
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              category === "ast" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCategory("ast")}
          >
            AST
          </button>
        </div>
      </div>

      <p className="text-muted mt-2 mb-3">
        Top 10 by total {categoryLabel.toLowerCase()} (GP = games played).
      </p>

      {leaders.length === 0 ? (
        <p className="empty">No stat data yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Team</th>
                <th>GP</th>
                <th>PTS</th>
                <th>REB</th>
                <th>AST</th>
                <th>PPG</th>
                <th>RPG</th>
                <th>APG</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((r, idx) => (
                <tr key={r.playerId}>
                  <td>{idx + 1}</td>
                  <td>
                    <Link
                      to={`/players/${r.playerId}`}
                      className="text-decoration-none"
                    >
                      #{r.number} {r.name} {r.position ? `(${r.position})` : ""}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/teams/${r.teamId}`}
                      className="text-decoration-none"
                    >
                      {teamName(r.teamId)}
                    </Link>
                  </td>
                  <td>{r.gp}</td>
                  <td>{r.pts}</td>
                  <td>{r.reb}</td>
                  <td>{r.ast}</td>
                  <td>{r.ppg}</td>
                  <td>{r.rpg}</td>
                  <td>{r.apg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}