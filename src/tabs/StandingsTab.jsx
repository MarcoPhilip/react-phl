import { Link } from "react-router-dom";
import { useLeague } from "../context/useLeague";

export default function StandingsTab() {
  const { standings } = useLeague();

  return (
    <>
      <p className="text-muted mb-2">
        Standings are computed from <b>Final</b> games only.
      </p>

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>W</th>
              <th>L</th>
              <th>GP</th>
              <th>PF</th>
              <th>PA</th>
              <th>PD</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((r, idx) => (
              <tr key={r.teamId}>
                <td>{idx + 1}</td>
                <td>
                  <Link to={`/teams/${r.teamId}`} className="text-decoration-none">
                    {r.name}
                  </Link>
                  <div className="text-muted small">{r.city}</div>
                </td>
                <td>{r.wins}</td>
                <td>{r.losses}</td>
                <td>{r.gp}</td>
                <td>{r.pf}</td>
                <td>{r.pa}</td>
                <td>{r.pd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}