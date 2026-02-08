import { Link } from "react-router-dom";
import TeamForm from "../components/TeamForm";
import EditTeamForm from "../components/EditTeamForm";

export default function TeamsTab({
  onAddTeam,
  teamsQuery,
  setTeamsQuery,
  teamResults,
  teamsQ,
  editingTeamId,
  setEditingTeamId,
  updateTeam,
  deleteTeam,
  players,
}) {
  return (
    <>
      <div className="mb-3">
        <h3 className="h5 mb-2">Add Team</h3>
        <TeamForm onAddTeam={onAddTeam} />
      </div>

      <div className="mb-2">
        <label className="form-label">Search teams</label>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Name, city, or color..."
            value={teamsQuery}
            onChange={(e) => setTeamsQuery(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setTeamsQuery("")}
          >
            Clear
          </button>
        </div>
      </div>

      {teamResults.length === 0 ? (
        <p className="empty">{teamsQ ? "No teams match your search." : "No teams yet."}</p>
      ) : (
        <ul className="teams">
          {teamResults.map((t) => {
            const playerCount = players.filter((p) => p.teamId === t.id).length;

            return (
              <li key={t.id} className="team-card">
                <div className="team-header">
                  <div className="team-meta">
                    {editingTeamId === t.id ? (
                      <EditTeamForm
                        initialTeam={t}
                        onSave={(updates) => {
                          updateTeam(t.id, updates);
                          setEditingTeamId(null);
                        }}
                        onCancel={() => setEditingTeamId(null)}
                      />
                    ) : (
                      <>
                        <h3 className="team-name">
                          <Link to={`/teams/${t.id}`} className="text-decoration-none">
                            {t.name}
                          </Link>
                        </h3>
                        <p className="team-sub mb-0">
                          {t.city} • Color: {t.color} • {playerCount} players
                        </p>
                      </>
                    )}
                  </div>

                  {editingTeamId !== t.id ? (
                    <div className="team-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setEditingTeamId(t.id)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          const ok = confirm(
                            `Delete ${t.name}? This also deletes its players and games.`
                          );
                          if (!ok) return;
                          deleteTeam(t.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}