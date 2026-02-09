import { Link } from "react-router-dom";
import EditPlayerForm from "../components/EditPlayerForm";
import { useLeague } from "../context/useLeague";

export default function PlayersTab() {
  const {
    playersQuery,
    setPlayersQuery,
    playerResults,
    editingPlayerId,
    setEditingPlayerId,
    updatePlayer,
    removePlayer,
    teamNameById,
  } = useLeague();

  const playersQ = playersQuery.trim().toLowerCase();

  return (
    <>
      <div className="mb-2">
        <label className="form-label">Search players</label>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Name, position, or jersey #..."
            value={playersQuery}
            onChange={(e) => setPlayersQuery(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setPlayersQuery("")}
          >
            Clear
          </button>
        </div>
      </div>

      {playerResults.length === 0 ? (
        <p className="empty">
          {playersQ ? "No players match your search." : "No players yet."}
        </p>
      ) : (
        <ul className="roster">
          {playerResults.map((p) => (
            <li key={p.id} className="roster-item">
              {editingPlayerId === p.id ? (
                <EditPlayerForm
                  initialPlayer={p}
                  onSave={(updates) => {
                    updatePlayer(p.id, updates);
                    setEditingPlayerId(null);
                  }}
                  onCancel={() => setEditingPlayerId(null)}
                />
              ) : (
                <>
                  <Link
                    to={`/players/${p.id}`}
                    className="roster-text text-decoration-none"
                  >
                    #{p.number} {p.name} ({p.position}) —{" "}
                    <b>{teamNameById.get(p.teamId) ?? "Unknown team"}</b>
                  </Link>

                  <div className="roster-actions">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setEditingPlayerId(p.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => removePlayer(p.id)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}