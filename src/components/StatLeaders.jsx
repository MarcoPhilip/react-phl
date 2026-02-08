// src/components/StatLeaders.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function StatLeaders({ players, teams, boxScores }) {
  // Choose what we rank by
  const [metric, setMetric] = useState("pts");

  // Build quick lookup maps (memoized)
  const playersById = useMemo(() => {
    const map = new Map();
    for (const p of players) map.set(p.id, p);
    return map;
  }, [players]);

  const teamsById = useMemo(() => {
    const map = new Map();
    for (const t of teams) map.set(t.id, t);
    return map;
  }, [teams]);

  // 1) Aggregate boxScores -> totals per player
  const totals = useMemo(() => {
    const map = new Map();

    for (const row of boxScores) {
      if (!map.has(row.playerId)) {
        map.set(row.playerId, {
          playerId: row.playerId,
          teamId: row.teamId,
          gp: 0,
          pts: 0,
          reb: 0,
          ast: 0,
          stl: 0,
          blk: 0,
          tpm: 0,
        });
      }

      const cur = map.get(row.playerId);

      cur.gp += 1;
      cur.pts += Number(row.pts || 0);
      cur.reb += Number(row.reb || 0);
      cur.ast += Number(row.ast || 0);
      cur.stl += Number(row.stl || 0);
      cur.blk += Number(row.blk || 0);
      cur.tpm += Number(row.tpm || 0);
    }

    return Array.from(map.values()).map((t) => {
      const p = playersById.get(t.playerId);

      const ppg = t.gp ? t.pts / t.gp : 0;
      const rpg = t.gp ? t.reb / t.gp : 0;
      const apg = t.gp ? t.ast / t.gp : 0;
      const spg = t.gp ? t.stl / t.gp : 0;
      const bpg = t.gp ? t.blk / t.gp : 0;
      const tpmg = t.gp ? t.tpm / t.gp : 0;

      return {
        ...t,
        name: p?.name || "Unknown player",
        position: p?.position || "",
        number: p?.number ?? "",
        ppg,
        rpg,
        apg,
        spg,
        bpg,
        tpmg,
      };
    });
  }, [boxScores, playersById]);

  // 2) Sort totals by selected metric
  const leaders = useMemo(() => {
    const sorted = [...totals].sort((a, b) => {
      const diff = (b[metric] ?? 0) - (a[metric] ?? 0);
      if (diff !== 0) return diff;

      const ptsDiff = b.pts - a.pts;
      if (ptsDiff !== 0) return ptsDiff;

      const gpDiff = b.gp - a.gp;
      if (gpDiff !== 0) return gpDiff;

      return a.name.localeCompare(b.name);
    });

    return sorted.slice(0, 10);
  }, [totals, metric]);

  const metricLabelMap = {
    pts: "Points (Total)",
    reb: "Rebounds (Total)",
    ast: "Assists (Total)",
    stl: "Steals (Total)",
    blk: "Blocks (Total)",
    tpm: "3PT Made (Total)",
    ppg: "Points Per Game",
    rpg: "Rebounds Per Game",
    apg: "Assists Per Game",
    spg: "Steals Per Game",
    bpg: "Blocks Per Game",
    tpmg: "3PT Made Per Game",
  };

  function fmtAvg(n) {
    return Number(n || 0).toFixed(1);
  }

  function teamName(teamId) {
    return teamsById.get(teamId)?.name || "Unknown team";
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="h5 mb-0">Stat Leaders</h3>

        <div className="btn-group flex-wrap" role="group" aria-label="Metric">
          {[
            ["pts", "PTS"],
            ["reb", "REB"],
            ["ast", "AST"],
            ["stl", "STL"],
            ["blk", "BLK"],
            ["tpm", "3PM"],
            ["ppg", "PPG"],
            ["rpg", "RPG"],
            ["apg", "APG"],
            ["spg", "SPG"],
            ["bpg", "BPG"],
            ["tpmg", "3PM/G"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`btn btn-sm ${
                metric === key ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setMetric(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-muted mt-2 mb-3">
        Top 10 by <b>{metricLabelMap[metric]}</b> (GP = games with recorded stats).
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
                <th>STL</th>
                <th>BLK</th>
                <th>3PM</th>
                <th>PPG</th>
                <th>RPG</th>
                <th>APG</th>
                <th>SPG</th>
                <th>BPG</th>
                <th>3PM/G</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((r, idx) => (
                <tr key={r.playerId}>
                  <td>{idx + 1}</td>
                  <td>
                    <Link to={`/players/${r.playerId}`} className="text-decoration-none">
                      #{r.number} {r.name} {r.position ? `(${r.position})` : ""}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/teams/${r.teamId}`} className="text-decoration-none">
                      {teamName(r.teamId)}
                    </Link>
                  </td>
                  <td>{r.gp}</td>
                  <td>{r.pts}</td>
                  <td>{r.reb}</td>
                  <td>{r.ast}</td>
                  <td>{r.stl}</td>
                  <td>{r.blk}</td>
                  <td>{r.tpm}</td>
                  <td>{fmtAvg(r.ppg)}</td>
                  <td>{fmtAvg(r.rpg)}</td>
                  <td>{fmtAvg(r.apg)}</td>
                  <td>{fmtAvg(r.spg)}</td>
                  <td>{fmtAvg(r.bpg)}</td>
                  <td>{fmtAvg(r.tpmg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}