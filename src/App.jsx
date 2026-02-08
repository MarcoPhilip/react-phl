import useLocalStorage from "./hooks/useLocalStorage";
import { teamsSeed, playersSeed } from "./data/seed";
import TeamForm from "./components/TeamForm";
import PlayerForm from "./components/PlayerForm";

export default function App() {
  // Store teams in LocalStorage (seed used only on first run)
  const [teams, setTeams] = useLocalStorage("phl_teams", teamsSeed);

  // Store players in LocalStorage (seed used only on first run)
  const [players, setPlayers] = useLocalStorage("phl_players", playersSeed);

  // Add a team using data coming from TeamForm
  function handleAddTeam(team) {
    const newTeam = {
      id: crypto.randomUUID(),
      ...team,
    };

    setTeams((prev) => [newTeam, ...prev]);
  }

  // Add a player to a specific team using data coming from PlayerForm
  function handleAddPlayer(teamId, player) {
    const newPlayer = {
      id: crypto.randomUUID(),
      teamId,
      ...player,
    };

    setPlayers((prev) => [newPlayer, ...prev]);
  }

  // Remove a single player by id
  function removePlayer(playerId) {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }

  // Delete a team and also delete all players on that team
  function deleteTeam(teamId) {
    setTeams((prevTeams) => prevTeams.filter((t) => t.id !== teamId));
    setPlayers((prevPlayers) => prevPlayers.filter((p) => p.teamId !== teamId));
  }

  // Reset LocalStorage back to seed data
  function resetLeague() {
    localStorage.removeItem("phl_teams");
    localStorage.removeItem("phl_players");
    window.location.reload();
  }

  // Get all players that belong to a team
  function playersByTeam(teamId) {
    return players.filter((p) => p.teamId === teamId);
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">Peninsula Hoopers League</h1>

        <div className="app-actions">
          <button className="btn" onClick={resetLeague}>
            Reset Data
          </button>
        </div>
      </header>

      <p className="app-subtitle">
        LocalStorage MVP: add teams/players with forms, refresh — data stays.
      </p>

      <hr className="divider" />

      <section className="section">
        <h2 className="section-title">Add Team</h2>
        <TeamForm onAddTeam={handleAddTeam} />
      </section>

      <hr className="divider" />

      <section className="section">
        <h2 className="section-title">Teams</h2>

        {teams.length === 0 ? (
          <p className="empty">No teams yet. Add one above.</p>
        ) : (
          <ul className="teams">
            {teams.map((t) => (
              <li key={t.id} className="team-card">
                <div className="team-header">
                  <div className="team-meta">
                    <h3 className="team-name">{t.name}</h3>
                    <p className="team-sub">
                      {t.city} • Color: {t.color}
                    </p>
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      const ok = confirm(
                        `Delete ${t.name}? This also deletes its players.`
                      );
                      if (!ok) return;
                      deleteTeam(t.id);
                    }}
                  >
                    Delete Team
                  </button>
                </div>

                <div className="team-body">
                  <h4 className="subsection-title">Add Player</h4>
                  <PlayerForm
                    onAddPlayer={(player) => handleAddPlayer(t.id, player)}
                  />

                  <h4 className="subsection-title">Roster</h4>

                  {playersByTeam(t.id).length === 0 ? (
                    <p className="empty">No players yet.</p>
                  ) : (
                    <ul className="roster">
                      {playersByTeam(t.id).map((p) => (
                        <li key={p.id} className="roster-item">
                          <span className="roster-text">
                            #{p.number} {p.name} ({p.position})
                          </span>

                          <button
                            className="btn btn-ghost"
                            onClick={() => removePlayer(p.id)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}